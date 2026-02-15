import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Use the authenticated Supabase client from locals
    const { data: messages, error } = await locals.supabase
        .from('feedback_messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading messages:', error);
        return {
            messages: [],
            error: error.message
        };
    }

    return {
        messages: messages || [],
        error: ''
    };
};
