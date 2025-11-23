import type { RequestHandler } from "./$types";
import { supabase } from "$lib/supabase/supabase";

const siteUrl = "https://abrorilhuda.me";
const siteName = "Abrorilhuda.me";
const siteDescription = "Artikel dan tutorial seputar teknologi";

export const GET: RequestHandler = async () => {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteName}</title>
    <description>${siteDescription}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    
    ${
      blogs
        ? blogs
            .map(
              (blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <description><![CDATA[${blog.excerpt || ""}]]></description>
      <link>${siteUrl}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${blog.slug}</guid>
      <pubDate>${new Date(blog.created_at).toUTCString()}</pubDate>
      <author><![CDATA[${blog.author}]]></author>
      ${
        blog.cover_image
          ? `<enclosure url="${blog.cover_image}" type="image/jpeg"/>`
          : ""
      }
      <content:encoded><![CDATA[${blog.content}]]></content:encoded>
    </item>`
            )
            .join("")
        : ""
    }
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
};
