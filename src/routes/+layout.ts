import { definePageMetaTags } from "svelte-meta-tags";

const siteurl = "https://abrorilhuda.me";
const defaultimage = "https://abrorilhuda.me/og-default-image.png";
const description =
  "Portofolio resmi Abrorilhuda. Profesional kreatif yang berdedikasi memberikan solusi inovatif dan hasil kerja berkualitas tinggi. Jelajahi proyek dan keahlian saya di sini.";

export const load = () => {
  const pageTags = definePageMetaTags({
    title: "Moh.AbrorilHuda",
    description: description,
    canonical: siteurl,
    openGraph: {
      type: "website",
      url: siteurl,
      locale: "id_ID",
      title: "Moh.AbrorilHuda",
      description: description,
      siteName: "Moh.AbrorilHuda",
      images: [
        {
          url: defaultimage,
          alt: "Moh.AbrorilHuda",
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
      title: "Moh.AbrorilHuda",
      description: description,
      image: defaultimage,
      imageAlt: "Moh.AbrorilHuda",
    },
    additionalRobotsProps: {
      noarchive: true,
      nosnippet: true,
      maxSnippet: -1,
      maxImagePreview: "none",
      maxVideoPreview: -1,
      notranslate: true,
      noimageindex: true,
    },
  });

  return {
    ...pageTags.pageMetaTags,
    siteurl,
    defaultimage,
  };
};
