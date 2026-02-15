import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ request, locals }) => {
    try {
        const { messageId } = await request.json();

        if (!messageId) {
            return new Response(JSON.stringify({ error: 'Message ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { error } = await locals.supabase
            .from('feedback_messages')
            .delete()
            .eq('id', messageId);

        if (error) {
            console.error('Delete error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Server error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
    try {
        const { messageId, field, value } = await request.json();

        if (!messageId || !field) {
            return new Response(JSON.stringify({ error: 'Message ID and field are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { error } = await locals.supabase
            .from('feedback_messages')
            .update({ [field]: value })
            .eq('id', messageId);

        if (error) {
            console.error('Update error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Server error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
