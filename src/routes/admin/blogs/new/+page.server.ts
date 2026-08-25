import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { supabaseAdmin } from "$lib/supabase/supabase.server";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const title = data.get("title") as string;
    const title_en = (data.get("title_en") as string) || null;
    const slug = data.get("slug") as string;
    const content = data.get("content") as string;
    const content_en = (data.get("content_en") as string) || null;
    const excerpt = data.get("excerpt") as string;
    const excerpt_en = (data.get("excerpt_en") as string) || null;
    const coverImage = data.get("cover_image") as string;
    const author = data.get("author") as string;
    const published = data.get("published") === "true" || data.get("published") === "on";

    // Validasi
    if (!title || !slug || !content) {
      return fail(400, {
        error: "Judul, slug, dan konten wajib diisi",
        title,
        title_en,
        slug,
        content,
        content_en,
        excerpt,
        excerpt_en,
        coverImage,
        author,
      });
    }

    // Insert dengan service role key (bypass RLS)
    const { data: blog, error } = await supabaseAdmin
      .from("blogs")
      .insert([
        {
          title,
          title_en,
          slug,
          content,
          content_en,
          excerpt: excerpt || null,
          excerpt_en: excerpt_en || null,
          cover_image: coverImage || null,
          author: author || "Abrordc",
          published,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);

      if (error.code === "23505") {
        return fail(400, {
          error: "Slug sudah digunakan, gunakan slug yang berbeda",
          title,
          title_en,
          slug,
          content,
          content_en,
          excerpt,
          excerpt_en,
          coverImage,
          author,
        });
      }

      return fail(500, {
        error: "Gagal menyimpan artikel: " + error.message,
        title,
        title_en,
        slug,
        content,
        content_en,
        excerpt,
        excerpt_en,
        coverImage,
        author,
      });
    }

    // Berhasil - redirect ke list blogs
    throw redirect(303, "/admin/blogs");
  },
} satisfies Actions;
