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
