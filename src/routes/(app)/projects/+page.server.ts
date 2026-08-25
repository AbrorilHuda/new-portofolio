import { projects as fallbackProjects, type Project } from '$lib/data/projects';
import { supabase } from '$lib/supabase/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading projects:', error);
    }

    return {
        projects: (data && data.length > 0 ? data : fallbackProjects) as Project[]
    };
};
