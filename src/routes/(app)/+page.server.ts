import { enrichProjects, type Project } from '$lib/data/projects';
import { supabase } from '$lib/supabase/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    return {
        projects: enrichProjects(data as Project[] | null)
    };
};
