import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals }) => {
  try {
    const { error } = await locals.supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
  } catch (err) {
    console.error("Unexpected error during logout:", err);
  }

  throw redirect(303, "/");
};
