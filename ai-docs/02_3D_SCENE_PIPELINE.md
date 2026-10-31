# 3D Scene Pipeline & Camera Mapping

## 1. Narrative Journey & Camera Waypoints

The portfolio uses single-wheel continuous snap-scrolling (inspired by *Reverse: 1999*) with smooth warp transitions.

| Section Index | Section Name | 3D Space Focus | Visual Concept & Camera Action |
| :---: | :--- | :--- | :--- |
| **0** | **Splash / Intro** | Gargantua Black Hole | Camera rests in front of the massive black hole with gravitational lensing & accretion disk rotation. |
| **1** | **Projects** | Deep Space Galaxies | **Warp transition**: Speed lines / chromatic aberration trigger. Camera zooms out to show Milky Way and Andromeda galaxies side-by-side. |
| **2** | **Technical Skills** | Solar System | **Warp transition**: Dive into the Milky Way galaxy down to our Solar System with revolving planets. |
| **3** | **Achievements** | Earth & Moon | **Warp transition**: Fast focus dive into the Earth and Moon orbit with glowing atmospheric effects. |
| **4** | **About Me (Preview)** | Earth Entry | **Warp transition**: Camera descends toward Earth's surface (clouds/atmosphere entrance), prompting user click to view full Bio page. |

## 2. Scroll-Snapping Architecture (GSAP ScrollTrigger)
```typescript
// ScrollTrigger logic standard for full-page snap navigation
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupSpaceScroll(onSectionChange: (index: number) => void) {
  const sections = document.querySelectorAll('.space-section');
  
  ScrollTrigger.create({
    trigger: '#viewport-container',
    start: 'top top',
    end: `+=${sections.length * 100}%`,
    pin: true,
    scrub: 1,
    snap: {
      snapTo: 1 / (sections.length - 1),
      duration: { min: 0.8, max: 1.2 },
      delay: 0.1,
      ease: 'power3.inOut'
    },
    onUpdate: (self) => {
      const currentIndex = Math.round(self.progress * (sections.length - 1));
      onSectionChange(currentIndex);
    }
  });
}
```

## 3. Audio & SFX Trigger System
- **Background Ambient (BGM)**: Continuous low-volume cosmic ambient synth track (Interstellar theme inspired).
- **Scroll/Warp SFX**: Low-frequency space whoosh / hyperdrive sound played when transitioning between sections.
- **Toggle Control**: Persistent UI audio button (Mute / Unmute) with state stored in Zustand.