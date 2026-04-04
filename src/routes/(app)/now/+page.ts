import { definePageMetaTags } from "svelte-meta-tags";

const siteurl = "https://abror.madura.dev";
const defaultimage = "https://abror.madura.dev/og-default-image.png";

export const load = () => {
  const pageTags = definePageMetaTags({
    title: "Now - Moh.AbrorilHuda",
    description:
      "Apa yang sedang saya kerjakan sekarang — proyek aktif, fokus saat ini, dan repo GitHub terbaru.",
    canonical: `${siteurl}/now`,
    openGraph: {
      type: "website",
      url: `${siteurl}/now`,
      locale: "id_ID",
      title: "Now - Moh.AbrorilHuda",
      description:
        "Apa yang sedang saya kerjakan sekarang — proyek aktif, fokus saat ini, dan repo GitHub terbaru.",
      siteName: "Moh.AbrorilHuda",
      images: [
        {
          url: defaultimage,
          alt: "Now - Moh.AbrorilHuda",
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      creator: "@abror_dc",
      site: "@abror_dc",
      cardType: "summary_large_image",
      title: "Now - Moh.AbrorilHuda",
      description:
        "Apa yang sedang saya kerjakan sekarang — proyek aktif dan repo GitHub terbaru.",
      image: defaultimage,
      imageAlt: "Now - Moh.AbrorilHuda",
    },
  });

  return { ...pageTags.pageMetaTags };
};
