import { error as svelteError, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const { data: blog } = await locals.supabase
        .from('blogs')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!blog) {
        throw svelteError(404, 'Artikel tidak ditemukan');
    }

    return { blog };
};

export const actions: Actions = {
    update: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const excerpt = formData.get('excerpt') as string;
        const coverImage = formData.get('cover_image') as string;
        const author = formData.get('author') as string;
        const published = formData.get('published') === 'true';

        if (!title || !slug || !content) {
            return fail(400, { error: 'Judul, slug, dan konten wajib diisi' });
        }

        const { error } = await locals.supabase
            .from('blogs')
            .update({
                title,
                slug,
                content,
                excerpt,
                cover_image: coverImage || null,
                author,
                published,
                updated_at: new Date().toISOString()
            })
            .eq('id', params.id);

        if (error) {
            if (error.code === '23505') {
                return fail(400, { error: 'Slug sudah digunakan, gunakan slug yang berbeda' });
            }
            return fail(500, { error: 'Gagal menyimpan artikel' });
        }

        throw redirect(303, '/admin/blogs');
    }
};
