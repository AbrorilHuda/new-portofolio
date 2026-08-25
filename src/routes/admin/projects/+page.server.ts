import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { extractUuid, deleteUploadcareFile } from '$lib/uploadcare.server';

// ponytail: hapus file lama di Uploadcare setelah DB sukses diubah;
// kalau cleanup gagal, DB tetap benar — file yatim bisa dibersihkan manual
async function cleanupImage(imageUrl: string | null | undefined) {
    const uuid = imageUrl ? extractUuid(imageUrl) : null;
    if (uuid) await deleteUploadcareFile(uuid);
}

export const load: PageServerLoad = async ({ locals }) => {
    const { data: projects } = await locals.supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    return { projects: projects || [] };
};

function parseForm(formData: FormData) {
    const technologies = ((formData.get('technologies') as string) || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

    return {
        title: (formData.get('title') as string).trim(),
        description: ((formData.get('description') as string) || '').trim(),
        image: (formData.get('image') as string).trim(),
        technologies,
        link: ((formData.get('link') as string) || '').trim()
    };
}

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const project = parseForm(await request.formData());

        if (!project.title || !project.image) {
            return fail(400, { error: 'Judul dan gambar wajib diisi' });
        }

        const { error } = await locals.supabase.from('projects').insert(project);

        if (error) return fail(500, { error: 'Gagal menambah project: ' + error.message });

        return { success: true };
    },

    update: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const project = parseForm(formData);

        if (!id || !project.title || !project.image) {
            return fail(400, { error: 'ID, judul, dan gambar wajib diisi' });
        }

        // ambil gambar lama dulu, supaya bisa dibersihkan kalau diganti
        const { data: existing } = await locals.supabase
            .from('projects')
            .select('image')
            .eq('id', id)
            .single();

        const { error } = await locals.supabase
            .from('projects')
            .update(project)
            .eq('id', id);

        if (error) return fail(500, { error: 'Gagal mengubah project: ' + error.message });

        if (existing?.image && existing.image !== project.image) {
            await cleanupImage(existing.image);
        }

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        const id = (await request.formData()).get('id');

        if (!id) return fail(400, { error: 'ID wajib diisi' });

        const { data: existing } = await locals.supabase
            .from('projects')
            .select('image')
            .eq('id', id)
            .single();

        const { error } = await locals.supabase.from('projects').delete().eq('id', id);

        if (error) return fail(500, { error: 'Gagal menghapus project: ' + error.message });

        await cleanupImage(existing?.image);

        return { success: true };
    }
};
