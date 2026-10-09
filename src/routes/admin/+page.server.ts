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

    // Load thought (celoteh) stats
    let thoughtStats = { total: 0, public: 0, private: 0 };
    try {
        const { data: thoughts } = await locals.supabase
            .from('thoughts')
            .select('is_public');
        if (thoughts) {
            thoughtStats = {
                total: thoughts.length,
                public: thoughts.filter((t: any) => t.is_public !== false).length,
                private: thoughts.filter((t: any) => t.is_public === false).length
            };
        }
    } catch {
        // ignore
    }

    // Load now items stats
    let nowStats = { total: 0, active: 0, completed: 0 };
    try {
        const { data: nowItems } = await locals.supabase
            .from('now_items')
            .select('status');
        if (nowItems) {
            nowStats = {
                total: nowItems.length,
                active: nowItems.filter((n: any) => n.status !== 'completed').length,
                completed: nowItems.filter((n: any) => n.status === 'completed').length
            };
        }
    } catch {
        // ignore
    }

    return {
        blogStats,
        messageStats,
        projectStats,
        thoughtStats,
        nowStats
    };
};


