import { PROFILE } from "@/data/profile";

// The page is a client component, so its title lives in this layout.
export const metadata = { title: `Projects | ${PROFILE.name}` };

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
