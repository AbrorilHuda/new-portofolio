import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/supabase/supabase';
import { definePageMetaTags } from "svelte-meta-tags";

export const load: PageServerLoad = async ({ params, url }) => {
    const { id } = params;

    const { data: thought, error: thoughtError } = await supabase
        .from('thoughts')
        .select('*')
        .eq('id', id)
        .single();

    if (thoughtError || !thought) {
        throw error(404, 'Celoteh tidak ditemukan');
    }

    const { data: comments, error: commentsError } = await supabase
        .from('thought_comments')
        .select('*')
        .eq('thought_id', id)
        .order('created_at', { ascending: true });

    if (commentsError) {
        console.error('Error fetching comments:', commentsError);
    }

    // 3. Define Meta Tags (Smart Share)
    const siteUrl = url.origin;
    const description = thought.content.length > 150
        ? thought.content.substring(0, 150) + '...'
        : thought.content;

    const ogImage = `${siteUrl}/api/og/celoteh?id=${id}`;

    const pageTags = definePageMetaTags({
        title: `Celoteh by Abroril Huda: "${description}"`,
        description: "Lihat selengkapnya di Celoteh Abroril Huda.",
        canonical: `${siteUrl}/celoteh/${id}`,
        openGraph: {
            type: 'article' as const,
            url: `${siteUrl}/celoteh/${id}`,
            title: `Celoteh Abroril Huda`,
            description: thought.content,
            images: [
                {
                    url: ogImage,
                    alt: 'Celoteh Content',
                }
            ],
            siteName: 'Moh.AbrorilHuda'
        },
        twitter: {
            site: '@abror_dc',
            cardType: 'summary_large_image' as const,
            title: `Celoteh Abroril Huda`,
            description: thought.content,
            image: ogImage,
            imageAlt: 'Celoteh Content',
        }
    });

    return {
        thought,
        comments: comments || [],
        ...pageTags.pageMetaTags
    };
};

export const actions: Actions = {
    comment: async ({ request, params, cookies }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const content = formData.get('content') as string;

        // 1. Honeypot check
        const honeypot = formData.get('website') as string;
        if (honeypot) {
            console.warn('Bot detected via honeypot');
            // Return success to confuse the bot, but don't save anything
            return { success: true };
        }

        // 2. Cookie Rate Limiting
        const lastCommentTime = cookies.get('last_comment_at');
        const now = Date.now();
        const COOLDOWN_PERIOD = 60 * 1000; // 60 seconds

        if (lastCommentTime) {
            const timeDiff = now - parseInt(lastCommentTime);
            if (timeDiff < COOLDOWN_PERIOD) {
                const remaining = Math.ceil((COOLDOWN_PERIOD - timeDiff) / 1000);
                return fail(429, {
                    error: `Terlalu cepat! Silakan tunggu ${remaining} detik lagi sebelum mengirim komentar baru.`
                });
            }
        }

        const id = params.id;

        if (!name || !content) {
            return fail(400, { error: 'Nama dan komentar wajib diisi' });
        }

        if (!id) {
            return fail(400, { error: 'Invalid ID' });
        }

        // Insert Comment
        const { error: insertError } = await supabase
            .from('thought_comments')
            .insert({
                thought_id: id,
                name,
                content
            });

        if (insertError) {
            return fail(500, { error: 'Gagal mengirim komentar' });
        }

        // Increment Comment Count
        const { error: incrementError } = await supabase.rpc('increment_comments', { row_id: id });

        if (incrementError) {
            console.error('RPC increment_comments failed:', incrementError);
        }

        // Set Cooldown Cookie
        cookies.set('last_comment_at', Date.now().toString(), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 // 60 seconds
        });

        return { success: true };
    },

    like: async ({ request, getClientAddress, params }) => {
        // Reusing like logic from main page if user likes from detail page
        const id = params.id;
        const ip = getClientAddress();

        if (!id) return fail(400, { error: 'ID required' });

        const { data: existingLike } = await supabase
            .from('thought_likes')
            .select('id')
            .eq('thought_id', id)
            .eq('user_ip', ip)
            .single();

        if (existingLike) {
            return fail(400, { error: 'Already liked' });
        }

        await supabase.from('thought_likes').insert({ thought_id: id, user_ip: ip });
        await supabase.rpc('increment_likes', { row_id: id });

        return { success: true };
    }
};
