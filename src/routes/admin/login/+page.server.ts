import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, "/admin");
  }
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (!email || !password) {
      return fail(400, { error: "Email dan password wajib diisi" });
    }

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return fail(400, { error: error.message });
    }
    throw redirect(303, "/admin");
  },
};
