export interface Achievement {
  id: string;
  type: "Publication" | "Certification" | "Workshop";
  title: string;
  issuer: string;
  date: string;
  description: string;
  image?: string;
  link?: string;
}

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "pub-youtube-segmentation",
    type: "Publication",
    title: "Audience Segmentation Analysis on YouTube Channel",
    issuer: "Journal of Aviation Vocational National Seminar (SNVP)",
    date: "December 2024",
    description:
      "Published academic research analyzing Virtual YouTuber (VTuber) audience preferences using YouTube Data API, Python scraping, MySQL data warehousing, and ETL pipelines.",
    link: "https://journal.ppicurug.ac.id/index.php/snvp/article/view/1280/695",
  },
  {
    id: "cert-englishscore",
    type: "Certification",
    title: "British Council EnglishScore Certificate",
    issuer: "British Council",
    date: "Issued",
    description: "Achieved an overall score of 544 (CEFR Level C1 - Advanced proficiency).",
    image: "/images/achievements/English_certificate.png",
  },
  {
    id: "ws-webvr-aframe",
    type: "Workshop",
    title: "Building WebVR Applications using A-Frame",
    issuer: "Universitas Pembangunan Jaya",
    date: "May 26, 2023",
    description:
      "Hands-on technical workshop on developing 3D Virtual Reality web experiences with A-Frame framework.",
    image: "/images/achievements/WebVR_workshop.png",
  },
  {
    id: "ws-structured-diagram",
    type: "Workshop",
    title: "Structured Systems Analysis & Method Diagrams",
    issuer: "Universitas Pembangunan Jaya",
    date: "2023",
    description:
      "Specialized training in modeling system architectures, structured data flow, and functional diagrams.",
    image: "/images/achievements/diagram_metode_terstruktur_workshop.png",
  },
];
