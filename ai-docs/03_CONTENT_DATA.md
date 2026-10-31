# Content Data & Technical Schemas

All content is structured in JSON-compatible schemas translated to English.

## 1. Projects Data Structure (`data/projects.ts`)

```typescript
export interface Project {
  id: string;
  title: string;
  category: 'Web Development' | 'Game Development' | 'Mobile / Cross-Platform' | 'Database System';
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'b2b-ecommerce',
    title: 'B2B E-Commerce Platform',
    category: 'Web Development',
    shortDescription: 'Enterprise B2B web application with automated Midtrans payment gateway and RBAC authorization.',
    fullDescription: 'Designed and built a full-stack B2B e-commerce platform utilizing Next.js and Supabase (PostgreSQL). Features real-time Midtrans payment links, webhook processing, database-trigger audit logging, and Role-Based Access Control (RBAC) separating Sales and Admin modules.',
    techStack: ['Next.js', 'Supabase', 'PostgreSQL', 'Midtrans API', 'Tailwind CSS'],
    image: '/images/projects/b2b-ecommerce.png',
    featured: true
  },
  {
    id: 'interactive-visual-novel',
    title: 'Interactive Narrative Visual Novel',
    category: 'Game Development',
    shortDescription: 'Story-driven game featuring branching dialogue systems and dynamic game state management.',
    fullDescription: 'Engineered narrative architecture and story-branching logic determining multiple endings (Good/Bad) based on player choices. Implemented interactive dialogue handling and save-state management within a compact two-person development team.',
    techStack: ['GDevelop', 'Game Logic Architecture', 'UI/UX Design'],
    image: '/images/projects/visual-novel.png',
    featured: true
  },
  {
    id: 'pbsi-livescore-web',
    title: 'PBSI South Jakarta Live Score Web App',
    category: 'Mobile / Cross-Platform',
    shortDescription: 'Cross-platform live scoring interface for official sports tournament management.',
    fullDescription: 'Developed responsive cross-platform front-end interfaces using Ionic Framework for a live score reporting web application during an internship at PBSI South Jakarta. Collaborated with QA teams across multiple viewport resolutions.',
    techStack: ['Ionic Framework', 'JavaScript', 'HTML5/CSS3', 'Cross-Platform Dev'],
    image: '/images/projects/pbsi-livescore.png',
    featured: true
  },
  {
    id: 'php-json-crud',
    title: 'Lightweight PHP-JSON Database Manager',
    category: 'Database System',
    shortDescription: 'Self-initiated modular database CRUD application using flat PHP and JSON storage.',
    fullDescription: 'A self-driven project exploring backend CRUD mechanics without heavy RDBMS overhead. Manages data persistence, dynamic filtering, and structure validation via structured JSON objects in standard PHP.',
    techStack: ['PHP', 'JSON', 'RESTful Concept', 'Backend Dev'],
    image: '/images/projects/php-crud.png',
    repoUrl: 'https://github.com/chairulkhuldan',
    featured: false
  }
];
```

## 2. Technical Skills Schema (`data/skills.ts`)

```typescript
export const SKILLS_DATA = {
  webDevelopment: ['Front End Development', 'HTML/CSS', 'PHP', 'Next.js', 'JavaScript', 'Ionic Framework', 'Git'],
  uiUxDesign: ['Figma'],
  graphicDesign: ['Canva', 'Adobe Illustrator'],
  videoEditing: ['Filmora', 'CapCut'],
  gameDev: ['GDevelop 5', 'Renpy']
};
```

## 3. Achievements Schema (`data/achievements.ts`)

```typescript
export interface Achievement {
  id: string;
  type: 'Publication' | 'Certification' | 'Workshop';
  title: string;
  issuer: string;
  date: string;
  description: string;
  image?: string;
  link?: string;
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'pub-youtube-segmentation',
    type: 'Publication',
    title: 'Audience Segmentation Analysis on YouTube Channel',
    issuer: 'Journal of Aviation Vocational National Seminar (SNVP)',
    date: 'December 2024',
    description: 'Published academic research analyzing Virtual YouTuber (VTuber) audience preferences using YouTube Data API, Python scraping, MySQL data warehousing, and ETL pipelines.',
    link: 'https://journal.ppicurug.ac.id/index.php/snvp/article/view/1280/695'
  },
  {
    id: 'cert-englishscore',
    type: 'Certification',
    title: 'British Council EnglishScore Certificate',
    issuer: 'British Council',
    date: 'Issued',
    description: 'Achieved an overall score of 544 (CEFR Level C1 - Advanced proficiency).',
    image: '/images/achievements/English_certificate.png'
  },
  {
    id: 'ws-webvr-aframe',
    type: 'Workshop',
    title: 'Building WebVR Applications using A-Frame',
    issuer: 'Universitas Pembangunan Jaya',
    date: 'May 26, 2023',
    description: 'Hands-on technical workshop on developing 3D Virtual Reality web experiences with A-Frame framework.',
    image: '/images/achievements/WebVR_workshop.png'
  },
  {
    id: 'ws-structured-diagram',
    type: 'Workshop',
    title: 'Structured Systems Analysis & Method Diagrams',
    issuer: 'Universitas Pembangunan Jaya',
    date: '2023',
    description: 'Specialized training in modeling system architectures, structured data flow, and functional diagrams.',
    image: '/images/achievements/diagram_metode_terstruktur_workshop.png'
  }
];
```

## 4. Experience & Bio Schema (`data/experience.ts`)

```typescript
export const EXPERIENCE_DATA = [
  {
    period: 'Feb 2026 - Jul 2026',
    role: 'Web Developer',
    company: 'E-Commerce B2B',
    highlights: [
      'Architected B2B web app with Next.js and Supabase (PostgreSQL).',
      'Integrated Midtrans Payment Gateway for real-time verification.',
      'Configured automated PostgreSQL database trigger audit trails.',
      'Enforced Role-Based Access Control (RBAC) across administrative modules.'
    ]
  },
  {
    period: 'Nov 2025 - Dec 2025',
    role: 'Game Programmer',
    company: 'Visual Novel Development',
    highlights: [
      'Designed dynamic dialogue choice logic leading to Good/Bad endings.',
      'Built custom game state management for progress serialization.'
    ]
  },
  {
    period: 'May 2025 - Aug 2025',
    role: 'Front End Developer Intern',
    company: 'PBSI South Jakarta',
    highlights: [
      'Created cross-platform live scoring UI with Ionic Framework.',
      'Collaborated with QA teams across varied mobile and web viewports.'
    ]
  },
  {
    period: 'Sep 2024 - Jan 2025',
    role: 'Teaching Assistant',
    company: 'Information Security & Network Administration',
    highlights: [
      'Guided students through networking principles and security lab exercises.'
    ]
  }
];
```