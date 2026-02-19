import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/supabase/supabase';

export const load: PageServerLoad = async () => {
    const { data: thoughts, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching thoughts:', error);
        return { thoughts: [] };
    }

    return {
        thoughts
    };
};

export const actions: Actions = {
    like: async ({ request, getClientAddress }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const ip = getClientAddress();

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        // Check if IP already liked this thought
        const { data: existingLike } = await supabase
            .from('thought_likes')
            .select('id')
            .eq('thought_id', id)
            .eq('user_ip', ip)
            .single();

        if (existingLike) {
            return fail(400, { error: 'You already liked this thought' });
        }

        // Record the like
        const { error: likeError } = await supabase
            .from('thought_likes')
            .insert({
                thought_id: id,
                user_ip: ip
            });

        if (likeError) {
            return fail(500, { error: 'Failed to like thought' });
        }

        // Increment count using the database function we created
        const { error: incrementError } = await supabase.rpc('increment_likes', { row_id: id });

        if (incrementError) {
            // Fallback manual increment if RPC fails (though RPC is safer)
            // For now just log usage
            console.error('RPC increment_likes failed:', incrementError);
        }

        return { success: true };
    }
};
