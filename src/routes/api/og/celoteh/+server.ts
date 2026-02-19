import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { html } from 'satori-html';
import { supabase } from '$lib/supabase/supabase';
import type { RequestHandler } from './$types';

// Fetch font data
const fontDataInterRegular = fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff'
).then((res) => res.arrayBuffer());

const fontDataInterBold = fetch(
    'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff'
).then((res) => res.arrayBuffer());

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response('Missing ID', { status: 400 });
    }

    // Fetch data from Supabase
    const { data: thought, error } = await supabase
        .from('thoughts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !thought) {
        return new Response('Thought not found', { status: 404 });
    }

    // Get engagement metrics (optional, or just fetch count)
    // For now, let's just use what's in the thought object if available, or fetch counts separately.
    // The previous code showed `likes_count` on the thought object.

    const likesCount = thought.likes_count || 0;
    // Comments count might need a separate query if not on the thought object.
    // Let's check if comments count is easily available. 
    // The previous code fetched all comments to count them: `data.comments.length`.
    // Doing a separate query for count is better for performance here.
    const { count: commentsCount } = await supabase
        .from('thought_comments')
        .select('*', { count: 'exact', head: true })
        .eq('thought_id', id);

    const date = new Date(thought.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const [interRegular, interBold] = await Promise.all([
        fontDataInterRegular,
        fontDataInterBold,
    ]);

    // Template
    const markup = html`<div
        style="display: flex; height: 100%; width: 100%; background-color: #ffffff; padding: 40px; flex-direction: column; justify-content: space-between; font-family: 'Inter', sans-serif;"
    >
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div
                    style="display: flex; width: 60px; height: 60px; border-radius: 50%; background-image: linear-gradient(to bottom right, #3b82f6, #9333ea); align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; margin-right: 16px;"
                >
                    AH
                </div>
                <div style="display: flex; flex-direction: column;">
                    <div style="font-size: 24px; font-weight: 700; color: #111827;">Abroril Huda</div>
                    <div style="font-size: 16px; color: #6b7280;">${date}</div>
                </div>
            </div>
            <div style="font-size: 32px; font-weight: 400; color: #1f2937; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;">
                ${thought.content}
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
             <div style="display: flex; align-items: center; gap: 24px;">
                <div style="display: flex; align-items: center; color: #ef4444;">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span style="font-size: 20px; font-weight: 600; margin-left: 8px; color: #374151;">${likesCount}</span>
                </div>
                 <div style="display: flex; align-items: center; color: #6b7280;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span style="font-size: 20px; font-weight: 600; margin-left: 8px; color: #374151;">${commentsCount || 0}</span>
                </div>
             </div>
             <div style="font-size: 18px; color: #9ca3af; font-weight: 500;">abrorilhuda.me</div>
        </div>
    </div>`;

    const svg = await satori(markup, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: 'Inter',
                data: interRegular,
                weight: 400,
                style: 'normal',
            },
            {
                name: 'Inter',
                data: interBold,
                weight: 700,
                style: 'normal',
            },
        ],
    });

    const resvg = new Resvg(svg, {
        fitTo: {
            mode: 'width',
            value: 1200,
        },
    });

    const image = resvg.render();

    return new Response(image.asPng() as any, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=600',
        },
    });
};
