import { definePageMetaTags } from "svelte-meta-tags";

const siteurl = "https://abror.madura.dev";
const defaultimage = "https://abror.madura.dev/og-default-image.png";

export const load = () => {
  const pageTags = definePageMetaTags({
    title: "Blog — Moh. Abroril Huda",
    description:
      "Artikel dan catatan teknis seputar pengembangan web fullstack, Laravel, React, Next.js, dan komunitas developer.",
    canonical: `${siteurl}/blog`,
    openGraph: {
      type: "website",
      url: `${siteurl}/blog`,
      locale: "id_ID",
      title: "Blog — Moh. Abroril Huda",
      description:
        "Artikel dan catatan teknis seputar pengembangan web fullstack, Laravel, React, Next.js, dan komunitas developer.",
      siteName: "Moh. Abroril Huda",
      images: [
        {
          url: defaultimage,
          alt: "Blog — Moh. Abroril Huda",
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
      title: "Blog — Moh. Abroril Huda",
      description:
        "Artikel dan catatan teknis seputar pengembangan web fullstack, Laravel, React, Next.js, dan komunitas developer.",
      image: defaultimage,
      imageAlt: "Blog — Moh. Abroril Huda",
    },
  });

  return { ...pageTags.pageMetaTags };
};
