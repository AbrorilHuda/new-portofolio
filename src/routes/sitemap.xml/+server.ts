import type { RequestHandler } from "./$types";
import { supabase } from "$lib/supabase/supabase";

const siteUrl = "https://abrorilhuda.me";

export const GET: RequestHandler = async () => {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, updated_at, created_at")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  // Static pages
  const staticPages = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    // { url: "/blog", changefreq: "daily", priority: "0.9" },
    // { url: "/about", changefreq: "monthly", priority: "0.8" },
    // { url: "/projects", changefreq: "weekly", priority: "0.8" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
    )
    .join("")}
  
  ${
    blogs
      ? blogs
          .map(
            (blog) => `
  <url>
    <loc>${siteUrl}/blog/${blog.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date(blog.updated_at).toISOString()}</lastmod>
  </url>`
          )
          .join("")
      : ""
  }
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
};
