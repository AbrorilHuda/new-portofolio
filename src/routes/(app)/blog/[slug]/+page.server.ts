import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { supabase, type Blog } from "$lib/supabase/supabase";
import { marked } from "marked";
import { definePageMetaTags } from "svelte-meta-tags";

const siteurl = "https://abrorilhuda.me";
const defaultImage = `${siteurl}/og-default-image.png`;

export const load: PageServerLoad = async ({ params }: any) => {
  const { data: blog, error: fetchError } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (fetchError || !blog) {
    throw error(404, {
      message: "Artikel tidak ditemukan",
    });
  }

  function formatDateISO(date: string) {
    return new Date(date).toISOString();
  }

  // Configure marked renderer for code blocks
  const renderer = new marked.Renderer();

  renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
    const language = lang || 'plaintext';
    const escapedCode = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    return `
      <div class="code-block-wrapper relative group my-6">
        <div class="code-header flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 rounded-t-lg border-b border-gray-700">
          <span class="text-xs font-mono text-gray-400 uppercase">${language}</span>
          <button class="copy-btn opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white text-xs font-medium flex items-center gap-1.5" data-code="${escapedCode.replace(/"/g, '&quot;')}">
            <svg class="copy-icon w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            <span class="copy-text">Copy</span>
            <svg class="check-icon w-4 h-4 hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
        <pre class="!mt-0 !rounded-t-none"><code class="language-${language}">${escapedCode}</code></pre>
      </div>
    `;
  };

  marked.setOptions({ renderer });

  const htmlContent = await marked(blog.content);
  const pageTags = definePageMetaTags({
    title: `${blog.title}`,
    description: blog.excerpt || "",
    canonical: `${siteurl}/blog/${blog.slug}`,
    openGraph: {
      type: "article",
      url: `${siteurl}/blog/${blog.slug}`,
      locale: "id_ID",
      title: blog.title,
      description: blog.excerpt || "",
      siteName: "Moh.AbrorilHuda",
      article: {
        publishedTime: formatDateISO(blog.created_at),
        modifiedTime: formatDateISO(blog.updated_at),
        authors: [blog.authors || "Moh.AbrorilHuda"],
        // tags: blog.tags || [],
      },
      images: [
        {
          url: blog.cover_image || defaultImage,
          alt: blog.title,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      creator: "@abror_dc",
      site: "@abror_dc",
      cardType: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || "",
      image: blog.cover_image || defaultImage,
      imageAlt: blog.title,
    },
  });

  return {
    blog: blog as Blog,
    htmlContent: htmlContent,
    siteurl,
    defaultImage,
    ...pageTags.pageMetaTags,
  };
};
