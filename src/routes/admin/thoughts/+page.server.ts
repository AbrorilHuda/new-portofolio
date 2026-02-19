import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/supabase/supabase';

export const load: PageServerLoad = async ({ locals }) => {
    // Check if session exists (standard admin check)
    // implementing basic auth check if needed, though layout usually handles it
    // const session = await locals.getSession();
    // if (!session) {
    //   throw redirect(303, '/admin/login');
    // }

    const { data: thoughts, error } = await supabase
        .from('thoughts')
        .select('*, thought_comments(*)')
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
    create: async ({ request }) => {
        const formData = await request.formData();
        const content = formData.get('content') as string;
        const imageUrl = formData.get('image_url') as string;
        const isPublic = formData.get('is_public') === 'on';

        if (!content) {
            return fail(400, { error: 'Content is required' });
        }

        const images = imageUrl ? [imageUrl] : [];

        const { error } = await supabase
            .from('thoughts')
            .insert({
                content,
                images,
                is_public: isPublic
            });

        if (error) {
            return fail(500, { error: 'Failed to create thought' });
        }

        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        const { error } = await supabase
            .from('thoughts')
            .delete()
            .eq('id', id);

        if (error) {
            return fail(500, { error: 'Failed to delete thought' });
        }

        return { success: true };
    },

    reply: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const content = formData.get('content') as string;

        if (!id || !content) {
            return fail(400, { error: 'ID and Content are required' });
        }

        // Insert Admin Reply
        const { error: insertError } = await supabase
            .from('thought_comments')
            .insert({
                thought_id: id,
                name: 'Abroril Huda', // Admin Name
                content: content
            });

        if (insertError) {
            return fail(500, { error: 'Failed to reply' });
        }

        // Increment Comment Count
        await supabase.rpc('increment_comments', { row_id: id });

        return { success: true };
    }
};
