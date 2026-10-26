export const SKILLS_DATA = {
  webDevelopment: [
    "Front End Development",
    "HTML/CSS",
    "PHP",
    "Next.js",
    "JavaScript",
    "Ionic Framework",
    "Git",
  ],
  uiUxDesign: ["Figma"],
  graphicDesign: ["Canva", "Adobe Illustrator"],
  videoEditing: ["Filmora", "CapCut"],
  gameDev: ["GDevelop 5", "Renpy"],
} as const;

export type SkillCategoryKey = keyof typeof SKILLS_DATA;

export const SKILL_CATEGORY_LABELS: Record<SkillCategoryKey, string> = {
  webDevelopment: "Web Development",
  uiUxDesign: "UI/UX Design",
  graphicDesign: "Graphic Design",
  videoEditing: "Video Editing",
  gameDev: "Game Development",
};
