import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { supabase, type Blog } from "$lib/supabase/supabase";
import { marked } from "marked";

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

  const htmlContent = await marked(blog.content);

  return {
    blog: blog as Blog,
    htmlContent: htmlContent,
  };
};
