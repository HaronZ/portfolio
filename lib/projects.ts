// EDIT ME: your real projects go here
export type Project = {
  title: string;
  blurb: string;
  tags: string[];
  letter: string;
  cover: "a" | "b" | "c";
  image?: string; // screenshot in public/, shown instead of the letter
  imagePosition?: string; // CSS object-position for the screenshot crop
  href?: string; // live site — makes the card clickable
};

export const projects: Project[] = [
  {
    title: "RallyRide",
    blurb:
      "A ride dispatch platform — real-time booking, driver assignment and live tracking, powered by Cloud Functions. Co-developed the Flutter driver app.",
    tags: ["Web", "Dispatch", "Firebase"],
    letter: "R",
    cover: "a",
    image: "/projects/rallyride.png",
    href: "https://r-allys-admin.vercel.app",
  },
  {
    title: "Ticketing System",
    blurb:
      "An end-to-end ticketing web app — issue, track and resolve, with a clean dashboard that keeps teams unblocked.",
    tags: ["Web", "Full-stack"],
    letter: "T",
    cover: "b",
    image: "/projects/ticketing.png",
    href: "https://mis-helpdesk.vercel.app",
  },
  {
    title: "SIGARS",
    blurb:
      "A brand site for hand-rolled Filipino lomboy-leaf cigars — bold product storytelling with Next.js, Tailwind and Framer Motion, visuals crafted with Higgsfield.",
    tags: ["Web", "Brand", "Tailwind"],
    letter: "S",
    cover: "b",
    image: "/projects/sigars.png",
    imagePosition: "center",
    href: "https://sigars.vercel.app",
  },
  {
    title: "This Website",
    blurb:
      "Apple-style scroll-driven animation built with Next.js, TypeScript and Motion — every frame you just scrolled through is hand-rolled canvas. View the source on GitHub.",
    tags: ["Next.js", "TypeScript", "Motion"],
    letter: "P",
    cover: "c",
    image: "/projects/portfolio.png",
    imagePosition: "center",
    href: "https://github.com/HaronZ/portfolio",
  },
];
