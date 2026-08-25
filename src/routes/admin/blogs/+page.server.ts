import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const { data: blogs, error } = await locals.supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading blogs:', error);
        return { blogs: [] };
    }

    return { blogs: blogs || [] };
};

export const actions: Actions = {
    toggle: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const published = formData.get('published') === 'true';

        if (!id) return fail(400, { error: 'ID is required' });

        const { error } = await locals.supabase
            .from('blogs')
            .update({ published })
            .eq('id', id);

        if (error) return fail(500, { error: 'Gagal mengubah status publikasi: ' + error.message });

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) return fail(400, { error: 'ID is required' });

        const { error } = await locals.supabase.from('blogs').delete().eq('id', id);

        if (error) return fail(500, { error: 'Gagal menghapus artikel: ' + error.message });

        return { success: true };
    }
};
