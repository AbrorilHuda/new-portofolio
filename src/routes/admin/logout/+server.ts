import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, cookies }) => {
  try {
    const { error } = await locals.supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
  } catch (err) {
    console.error("Unexpected error during logout:", err);
  }

  // ponytail: fallback hapus cookie session kalau signOut gagal,
  // supaya tidak ada session basi yang tertinggal
  cookies
    .getAll()
    .filter((c) => c.name.startsWith("sb-"))
    .forEach((c) => cookies.delete(c.name, { path: "/" }));

  throw redirect(303, "/");
};
