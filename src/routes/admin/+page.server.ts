import type { PageServerLoad } from './$types';
import { projects as fallbackProjects } from '$lib/data/projects';

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

    // Load project stats
    const { data: projects } = await locals.supabase
        .from('projects')
        .select('*');

    const projectList = projects && projects.length > 0 ? projects : fallbackProjects;
    const projectStats = {
        total: projectList.length,
        published: projects && projects.length > 0
            ? projects.filter((p: any) => p.published !== false).length
            : fallbackProjects.length
    };

    return {
        blogStats,
        messageStats,
        projectStats
    };
};


