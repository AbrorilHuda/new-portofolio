import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { RequestEvent } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/supabase';

export const load: PageServerLoad = async () => {
    const { data: nowItems, error } = await supabase
        .from('now_items')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching now_items:', error);
        return { nowItems: [] };
    }

    return { nowItems };
};

export const actions: Actions = {
    create: async ({ request }: RequestEvent) => {
        const formData = await request.formData();
        const project_name = formData.get('project_name') as string;
        const github_url = formData.get('github_url') as string;
        const tasksRaw = formData.get('tasks') as string;
        const sort_order = parseInt(formData.get('sort_order') as string) || 0;

        if (!project_name || !github_url) {
            return fail(400, { error: 'Project name and GitHub URL are required' });
        }
        const tasks = tasksRaw
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean);

        const { error } = await supabase.from('now_items').insert({
            project_name,
            github_url,
            tasks,
            sort_order
        });

        if (error) {
            return fail(500, { error: 'Failed to create item: ' + error.message });
        }

        return { success: true };
    },

    update: async ({ request }: RequestEvent) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const project_name = formData.get('project_name') as string;
        const github_url = formData.get('github_url') as string;
        const tasksRaw = formData.get('tasks') as string;
        const sort_order = parseInt(formData.get('sort_order') as string) || 0;

        if (!id || !project_name || !github_url) {
            return fail(400, { error: 'ID, project name, and GitHub URL are required' });
        }

        const tasks = tasksRaw
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean);

        const { error } = await supabase
            .from('now_items')
            .update({ project_name, github_url, tasks, sort_order, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            return fail(500, { error: 'Failed to update item: ' + error.message });
        }

        return { success: true };
    },

    delete: async ({ request }: RequestEvent) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        const { error } = await supabase.from('now_items').delete().eq('id', id);

        if (error) {
            return fail(500, { error: 'Failed to delete item: ' + error.message });
        }

        return { success: true };
    }
};
