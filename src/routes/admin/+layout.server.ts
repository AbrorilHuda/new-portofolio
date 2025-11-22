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
  return {
    session: locals.user,
  };
};
