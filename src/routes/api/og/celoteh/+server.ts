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
    const likesCount = thought.likes_count || 0;
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
        style="display: flex; height: 100%; width: 100%; background-color: #ffffff; padding: 48px; flex-direction: column; justify-content: space-between; font-family: 'Inter', sans-serif;"
    >
        <div style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; margin-bottom: 28px;">
                <div
                    style="display: flex; width: 64px; height: 64px; border-radius: 50%; background-image: linear-gradient(to bottom right, #3b82f6, #9333ea); align-items: center; justify-content: center; color: white; font-size: 26px; font-weight: 700; margin-right: 16px; flex-shrink: 0;"
                >
                    AH
                </div>
                <div style="display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="font-size: 26px; font-weight: 700; color: #111827;">Abroril Huda</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="#1d9bf0">
                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C1.88 9.33 1 10.57 1 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.91.2 3.92-.81s1.26-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-6.31-2.39l-4.5 6a.75.75 0 0 1-1.19.03l-1.95-2.6a.75.75 0 1 1 1.2-.9l1.33 1.77 3.93-5.24a.75.75 0 0 1 1.18.94z"/>
                        </svg>
                    </div>
                    <div style="font-size: 17px; color: #6b7280;">${date}</div>
                </div>
            </div>
            <div style="font-size: 45px; font-weight: 400; color: #1f2937; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;">
                ${thought.content}
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; padding-top: 22px; margin-top: 24px;">
             <div style="display: flex; align-items: center; gap: 28px;">
                <div style="display: flex; align-items: center; color: #ef4444;">
                   <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span style="font-size: 22px; font-weight: 600; margin-left: 8px; color: #374151;">${likesCount}</span>
                </div>
                 <div style="display: flex; align-items: center; color: #6b7280;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span style="font-size: 22px; font-weight: 600; margin-left: 8px; color: #374151;">${commentsCount || 0}</span>
                </div>
             </div>
             <div style="font-size: 20px; color: #9ca3af; font-weight: 500;">abrorilhuda.me</div>
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
