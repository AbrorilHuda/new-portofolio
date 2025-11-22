// src/routes/admin/logout/+server.ts
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createServerClient } from "@supabase/ssr";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const POST: RequestHandler = async ({ cookies }) => {
  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, { ...options, path: "/" })
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
  }

  throw redirect(303, "/");
};
