export interface Credit {
  id: string;
  type: "3D Model" | "Music";
  title: string;
  author: string;
  /** Author profile, when known; the name links here. */
  authorUrl?: string;
  /** Where the work is published; the whole credit links here. */
  url: string;
  /** Short licence label, shown as plain text. */
  license?: string;
  /** What was changed (required by CC BY when a work is modified). */
  changes?: string;
  /** Platform name shown on the link. */
  source: "Sketchfab" | "YouTube";
}

export const CREDITS_DATA: Credit[] = [
  {
    id: "galaxy-model",
    type: "3D Model",
    title: "Need some space?",
    author: "Loïc Norgeot",
    authorUrl: "https://sketchfab.com/norgeotloic",
    url: "https://sketchfab.com/3d-models/need-some-space-d6521362b37b48e3a82bce4911409303",
    source: "Sketchfab",
    license: "CC BY 4.0",
    changes: "Recentered and rescaled, and rendered with custom glow and blending.",
  },
  {
    id: "earth-model",
    type: "3D Model",
    title: "Earth",
    author: "Akshat",
    authorUrl: "https://sketchfab.com/shooter24994",
    url: "https://sketchfab.com/3d-models/earth-41fc80d85dfd480281f21b74b2de2faa",
    source: "Sketchfab",
    license: "CC BY 4.0",
    changes:
      "Texture extracted and re-lit with a custom day/night shader, with generated city lights added to the night side.",
  },
  {
    id: "background-music",
    type: "Music",
    title:
      "Hans Zimmer (Interstellar Main Theme) - Space 4k - no copyright Interstaller inspired Music",
    author: "PowerStanik",
    authorUrl: "https://www.youtube.com/@PowerStanik",
    url: "https://youtu.be/LpGx4uqtvgs",
    source: "YouTube",
  },
];
