import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Load blog stats
    const { data: blogs } = await locals.supabase
        .from('blogs')
        .select('published');

    const blogStats = {
        total: blogs?.length || 0,
        published: blogs?.filter((b: any) => b.published).length || 0,
        draft: blogs?.filter((b: any) => !b.published).length || 0
    };

    // Load message stats
    const { data: messages } = await locals.supabase
        .from('feedback_messages')
        .select('read');

    const messageStats = {
        total: messages?.length || 0,
        unread: messages?.filter((m: any) => !m.read).length || 0
    };

    return {
        blogStats,
        messageStats
    };
};
