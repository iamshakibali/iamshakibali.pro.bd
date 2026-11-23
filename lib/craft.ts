// Craft pieces shown on /playground and in the home page strip.
// aspect = the video's own width / height, so the card reserves its space
// before the video loads instead of collapsing and jumping.
export type CraftItem = { src: string; href?: string; aspect: string };

export const craftItems: CraftItem[] = [
  { src: "/craft-hero.mp4", href: "https://resumio-two.vercel.app/", aspect: "960 / 526" },
  { src: "/craft-fitness-app.mp4", href: "https://interview-crack-pearl.vercel.app/", aspect: "1906 / 1038" },
  { src: "/craft-globalbank.mp4", href: "https://globalbank-bento.vercel.app/", aspect: "1920 / 1050" },
  { src: "/craft-moving-services.mp4", aspect: "1920 / 1050" },
];
