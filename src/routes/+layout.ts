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
      maxSnippet: 320,           // Allow snippet up to 320 characters
      maxImagePreview: "large",  // Allow large image previews in search results
      maxVideoPreview: -1,       // Allow unlimited video preview
    },
  });

  return {
    ...pageTags.pageMetaTags,
    siteurl,
    defaultimage,
  };
};
