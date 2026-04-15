import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { checkRateLimit } from "$lib/rateLimiter";

export const GET: RequestHandler = async ({ request, getClientAddress }) => {
  const apiKey = request.headers.get("x-api-key");
  const clientId = apiKey ? `key:${apiKey}` : `ip:${getClientAddress()}`;

  const rateLimit = checkRateLimit(clientId);

  const headers = new Headers({
    "Content-Type": "application/json",
    "X-RateLimit-Limit": "10000",
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-RateLimit-Reset": String(rateLimit.resetTime),
  });

  if (!rateLimit.allowed) {
    headers.set(
      "Retry-After",
      String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
    );

    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Maximum 10,000 requests per day",
        resetTime: rateLimit.resetTime,
        resetAt: new Date(rateLimit.resetTime).toISOString(),
      }),
      {
        status: 429,
        headers,
      },
    );
  }
  return json(
    {
      profile: {
        meta: {
          version: "2.0",
          schema: "person.v2",
          last_updated: "2026-04-15T08:20:00Z",
          locale: "id-ID",
        },
        identity: {
          display_name: "Moh. Abroril Huda",
          handle: "@Abrordc",
          tagline: "Full-stack Developer ☕️ | Code & Coffee Enthusiast",
          pronouns: "he/him",
          avatar: {
            url: "https://ucarecdn.com/e07fe590-8b63-404b-a62a-e9540db1986a/WhatsAppImage20250602at225118.jpeg",
            alt: "Moh. Abroril Huda profile photo",
          },
          banner: null,
        },
        about: {
          summary:
            "Full-stack developer yang suka ngoding dan ngopi. Membangun solusi digital yang scalable dan user-friendly dari Pamekasan, Madura.",
          location: {
            city: "Pamekasan",
            region: "Jawa Timur",
            country: "Indonesia",
            timezone: "Asia/Jakarta",
            coordinates: null,
          },
          languages: ["id", "en"],
          interests: [
            "Web Development",
            "Open Source",
            "Coffee",
            "Tech Community",
          ],
        },
        contact: {
          email: {
            primary: "moh.abrorilhuda@gmail.com",
            public: true,
          },
          website: "https://abror.madura.dev",
        },
        social: {
          github: {
            url: "https://github.com/AbrorilHuda",
            username: "AbrorilHuda",
          },
          linkedin: {
            url: "https://www.linkedin.com/in/moh-abroril-huda",
            username: "moh-abroril-huda",
          },
          x: {
            url: "https://twitter.com/abror_dc",
            username: "abror_dc",
          },
          instagram: {
            url: "https://www.instagram.com/abrorilhuda",
            username: "abrorilhuda",
          },
          tiktok: {
            url: "https://tiktok.com/@abror_dc",
            username: "abror_dc",
          },
        },
        stats: {
          member_since: "2022-03-15",
          years_active: 4,
          status: "active",
          verified: true,
        },
        badges: [
          {
            id: "early-adopter",
            name: "Early Adopter",
            icon: "🚀",
            earned_at: "2022-03-15",
          },
          {
            id: "open-source",
            name: "Open Source Contributor",
            icon: "🛠️",
            earned_at: null,
          },
        ],
      },
      rateLimit: {
        limit: 10000,
        remaining: rateLimit.remaining,
        used: 10000 - rateLimit.remaining,
        resetAt: new Date(rateLimit.resetTime).toISOString(),
        resetIn: formatDuration(rateLimit.resetTime - Date.now()),
      },
    },
    { headers },
  );
};

function formatDuration(ms: number): string {
  if (ms <= 0) return "0s";

  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(" ") || "0s";
}
