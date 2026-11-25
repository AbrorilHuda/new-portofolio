import { definePageMetaTags } from "svelte-meta-tags";

const siteurl = "https://abror.madura.dev";
const defaultimage = "https://abror.madura.dev/og-default-image.png";
const title = "Moh. Abroril Huda — Fullstack Developer (Laravel, React, Next.js)";
const description =
  "Portofolio Moh. Abroril Huda, Fullstack Developer lulusan S1 Informatika (IPK 3.59). Lihat proyek web, sistem bisnis, dan komunitas yang saya bangun.";

export const load = () => {
  const pageTags = definePageMetaTags({
    title,
    description,
    canonical: siteurl,
    openGraph: {
      type: "website",
      url: siteurl,
      locale: "id_ID",
      title,
      description,
      siteName: "Moh. Abroril Huda",
      images: [
        {
          url: defaultimage,
          alt: "Portofolio Moh. Abroril Huda — Fullstack Developer",
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
      title,
      description,
      image: defaultimage,
      imageAlt: "Portofolio Moh. Abroril Huda — Fullstack Developer",
    },
    additionalRobotsProps: {
      maxSnippet: 320,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  });

  return {
    ...pageTags.pageMetaTags,
    siteurl,
    defaultimage,
  };
};
