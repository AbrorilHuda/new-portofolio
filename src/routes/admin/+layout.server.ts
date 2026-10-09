import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // console.log("🟢 [Server] Data session yang akan dikirim ke klien:");
  // console.log(locals);
  if (url.pathname === "/admin/login") {
    return {};
  }
  if (!locals.user) {
    throw redirect(303, "/admin/login");
  }
  let unreadMessages = 0;
  try {
    const { count } = await locals.supabase
      .from('feedback_messages')
      .select('id', { count: 'exact', head: true })
      .eq('read', false);
    unreadMessages = count ?? 0;
  } catch {
    // fallback if error
  }

  return {
    session: locals.user,
    unreadMessages,
  };
};
