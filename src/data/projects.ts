export type ProjectCategory =
  | "Web Development"
  | "Game Development"
  | "Mobile / Cross-Platform"
  | "Database System";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  /** Cover image shown on cards; omit to use the category gradient. */
  image?: string;
  /** Screenshots shown in the project modal. */
  gallery?: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: "b2b-ecommerce",
    title: "B2B E-Commerce Platform",
    category: "Web Development",
    shortDescription:
      "Enterprise B2B web application with automated Midtrans payment gateway and RBAC authorization.",
    fullDescription:
      "Designed and built a full-stack B2B e-commerce platform utilizing Next.js and Supabase (PostgreSQL). Features real-time Midtrans payment links, webhook processing, database-trigger audit logging, and Role-Based Access Control (RBAC) separating Sales and Admin modules.",
    techStack: ["Next.js", "Supabase", "PostgreSQL", "Midtrans API", "Tailwind CSS"],
    image: "/images/projects/b2b_ecommerce_platform1.png",
    gallery: [
      "/images/projects/b2b_ecommerce_platform1.png",
      "/images/projects/b2b_ecommerce_platform2.png",
      "/images/projects/b2b_ecommerce_platform4.png",
    ],
    featured: true,
  },
  {
    id: "interactive-visual-novel",
    title: "Interactive Narrative Visual Novel",
    category: "Game Development",
    shortDescription:
      "Story-driven game featuring branching dialogue systems and dynamic game state management.",
    fullDescription:
      "Engineered narrative architecture and story-branching logic determining multiple endings (Good/Bad) based on player choices. Implemented interactive dialogue handling and save-state management within a compact two-person development team.",
    techStack: ["GDevelop", "Game Logic Architecture", "UI/UX Design"],
    image: "/images/projects/visual_novel_1.png",
    gallery: ["/images/projects/visual_novel_1.png", "/images/projects/visual_novel_2.png"],
    featured: true,
  },
  {
    id: "pbsi-livescore-web",
    title: "PBSI South Jakarta Live Score Web App",
    category: "Mobile / Cross-Platform",
    shortDescription:
      "Cross-platform live scoring interface for official sports tournament management.",
    fullDescription:
      "Developed responsive cross-platform front-end interfaces using Ionic Framework for a live score reporting web application during an internship at PBSI South Jakarta. Collaborated with QA teams across multiple viewport resolutions.",
    techStack: ["Ionic Framework", "JavaScript", "HTML5/CSS3", "Cross-Platform Dev"],
    image: "/images/projects/pbsi_south_jakarta_2.png",
    gallery: [
      "/images/projects/pbsi_south_jakarta_2.png",
      "/images/projects/pbsi_south_jakarta_3.png",
      "/images/projects/pbsi_south_jakarta_1.png",
    ],
    featured: true,
  },
  {
    id: "php-json-crud",
    title: "Lightweight PHP-JSON Database Manager",
    category: "Database System",
    shortDescription:
      "Self-initiated modular database CRUD application using flat PHP and JSON storage.",
    fullDescription:
      "A self-driven project exploring backend CRUD mechanics without heavy RDBMS overhead. Manages data persistence, dynamic filtering, and structure validation via structured JSON objects in standard PHP.",
    techStack: ["PHP", "JSON", "RESTful Concept", "Backend Dev"],
    image: "/images/projects/php_json_1.png",
    gallery: ["/images/projects/php_json_1.png", "/images/projects/php_json_2.png"],
    repoUrl: "https://github.com/chameleon54/not-a-database",
    featured: false,
  },
];
