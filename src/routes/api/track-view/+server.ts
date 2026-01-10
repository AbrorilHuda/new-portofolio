import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { supabase } from "$lib/supabase/supabase";
import { hashString } from "$lib/utils/hash";

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  try {
    const { slug } = await request.json();
    const clientIp = getClientAddress();
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Hash IP for privacy
    const ipHash = await hashString(clientIp);

    const { error } = await supabase.from("page_views").insert({
      slug,
      ip_hash: ipHash,
      user_agent: userAgent,
    });

    if (error) throw error;

    return json({ success: true });
  } catch (err) {
    console.error("Error tracking view:", err);
    return json(
      { success: false, error: "Failed to track view" },
      { status: 500 }
    );
  }
};
