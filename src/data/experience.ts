export interface Experience {
  period: string;
  role: string;
  company: string;
  highlights: string[];
}

export const EXPERIENCE_DATA: Experience[] = [
  {
    period: "Feb 2026 - Jul 2026",
    role: "Web Developer",
    company: "E-Commerce B2B",
    highlights: [
      "Architected B2B web app with Next.js and Supabase (PostgreSQL).",
      "Integrated Midtrans Payment Gateway for real-time verification.",
      "Configured automated PostgreSQL database trigger audit trails.",
      "Enforced Role-Based Access Control (RBAC) across administrative modules.",
    ],
  },
  {
    period: "Nov 2025 - Dec 2025",
    role: "Game Programmer",
    company: "Visual Novel Development",
    highlights: [
      "Designed dynamic dialogue choice logic leading to Good/Bad endings.",
      "Built custom game state management for progress serialization.",
    ],
  },
  {
    period: "May 2025 - Aug 2025",
    role: "Front End Developer Intern",
    company: "PBSI South Jakarta",
    highlights: [
      "Created cross-platform live scoring UI with Ionic Framework.",
      "Collaborated with QA teams across varied mobile and web viewports.",
    ],
  },
  {
    period: "Sep 2024 - Jan 2025",
    role: "Teaching Assistant",
    company: "Information Security & Network Administration",
    highlights: ["Guided students through networking principles and security lab exercises."],
  },
];
