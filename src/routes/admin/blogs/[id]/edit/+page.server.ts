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
        const title_en = (formData.get('title_en') as string) || null;
        const slug = formData.get('slug') as string;
        const content = formData.get('content') as string;
        const content_en = (formData.get('content_en') as string) || null;
        const excerpt = formData.get('excerpt') as string;
        const excerpt_en = (formData.get('excerpt_en') as string) || null;
        const coverImage = formData.get('cover_image') as string;
        const author = formData.get('author') as string;
        const published = formData.get('published') === 'true' || formData.get('published') === 'on';

        if (!title || !slug || !content) {
            return fail(400, {
                error: 'Judul, slug, dan konten wajib diisi',
                title,
                title_en,
                slug,
                content,
                content_en,
                excerpt,
                excerpt_en,
                coverImage,
                author
            });
        }

        const { error } = await locals.supabase
            .from('blogs')
            .update({
                title,
                title_en,
                slug,
                content,
                content_en,
                excerpt: excerpt || null,
                excerpt_en: excerpt_en || null,
                cover_image: coverImage || null,
                author,
                published,
                updated_at: new Date().toISOString()
            })
            .eq('id', params.id);

        if (error) {
            if (error.code === '23505') {
                return fail(400, {
                    error: 'Slug sudah digunakan, gunakan slug yang berbeda',
                    title,
                    title_en,
                    slug,
                    content,
                    content_en,
                    excerpt,
                    excerpt_en,
                    coverImage,
                    author
                });
            }
            return fail(500, {
                error: 'Gagal menyimpan artikel: ' + error.message,
                title,
                title_en,
                slug,
                content,
                content_en,
                excerpt,
                excerpt_en,
                coverImage,
                author
            });
        }

        throw redirect(303, '/admin/blogs');
    }
};
