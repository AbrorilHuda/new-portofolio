import { definePageMetaTags } from "svelte-meta-tags";

const siteurl = "https://abrorilhuda.me";
const defaultimage = "https://abrorilhuda.me/og-image.png";

export const load = () => {
  const pageTags = definePageMetaTags({
    title: "Blogs - Moh.AbrorilHuda",
    description:
      "Artikel dan tulisan seputar hal-hal random, programming, dan pengalaman sebagai Full-Stack Developer, vibe",
    canonical: `${siteurl}/blog`,
    openGraph: {
      type: "website",
      url: `${siteurl}/blog`,
      locale: "id_ID",
      title: "Blogs - Moh.AbrorilHuda",
      description:
        "Artikel dan tulisan seputar hal-hal random, programming, dan pengalaman sebagai Full-Stack Developer, vibe",
      siteName: "Moh.AbrorilHuda",
      images: [
        {
          url: defaultimage,
          alt: "Blogs - Moh.AbrorilHuda",
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
      title: "Blogs - Moh.AbrorilHuda",
      description:
        "Artikel dan tulisan hal-hal random, programming, dan pengalaman sebagai Full-Stack Developer, vibe",
      image: defaultimage,
      imageAlt: "Blogs - Moh.AbrorilHuda",
    },
  });

  return { ...pageTags.pageMetaTags };
};
