import { projects as fallbackProjects, type Project } from '$lib/data/projects';
import { supabase } from '$lib/supabase/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    // ponytail: fallback ke data hardcode kalau tabel kosong/belum dibuat,
    // hapus saat DB sudah jadi sumber tunggal
    return {
        projects: (data && data.length > 0 ? data : fallbackProjects) as Project[]
    };
};
