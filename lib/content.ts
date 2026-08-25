// All personal content lives here. Swap the placeholders for real values
// later — nothing personal is hardcoded in the components.
export const content = {
  name: "imahskaibali",
  headline: "Product Designer & Design Engineer",
  subtext: "I design and build digital products end to end.",
  email: "hello@imahskaibali.com",
  resumeUrl: "/resume.pdf",
  socials: [
    { label: "Dribbble", url: "https://dribbble.com/imahskaibali" },
    { label: "X", url: "https://x.com/imahskaibali" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/imahskaibali" },
    { label: "GitHub", url: "https://github.com/imahskaibali" },
  ],
  experience: [
    {
      company: "Vivetica AG",
      url: "https://viveticacapital.ch",
      logo: "/badges/vivetica-mark.svg",
      location: "Zürich, Switzerland",
      locationNote: "(Remote)",
      role: "Product Design Engineer",
      type: "Part-time",
      start: "01.2026",
      end: null, // present
      duration: "8m",
      highlights: [
        "Develop production-ready frontends and hand off to backend teams.",
        "Design and build marketing websites for company products.",
        "Design and build Pro components/blocks, from\nFigma to production-ready React.",
        "Create and maintain design systems that\nscale across multiple products.",
      ],
      tags: ["React", "TypeScript", "Next.js", "Design System", "Figma", "UX"],
    },
  ],
} as const;
