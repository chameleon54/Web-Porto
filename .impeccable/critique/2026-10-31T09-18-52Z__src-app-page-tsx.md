---
target: home page
total_score: 23
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\chair\\OneDrive\\Desktop\\WORK\\github rep\\Web Porto\\src\\app\\page.tsx"
target_fingerprint: "sha256:6c076df50c88a5cf05a50d91def04431d5f5cad65bf41efa07f9f396c872e067"
target_path: "C:\\Users\\chair\\OneDrive\\Desktop\\WORK\\github rep\\Web Porto\\src\\app\\page.tsx"
timestamp: 2026-10-31T09-18-52Z
slug: src-app-page-tsx
---
Method: dual-agent. Score 23/36 (heuristic 10 n/a), Acceptable.

Verdict: authored hero/splash, generic 2D middle; Observatory Deck idea lives in canvas only.
Detector: 22 advisory (7 font-size, 14 colour, 1 bounce-easing); canvas colours are false positives.

Priority issues:
1. [P1] No persistent contact path on the home journey (layout).
2. [P1] ~6s unskippable splash (harden).
3. [P2] 320px nav: dots crowd audio button, targets under 44px (adapt).
4. [P2] Modal focus trap/return, inactive stops tabbable, splash blocks keys, small /about links (audit, harden).
5. [P2] setState-in-render error in EarthSurfaceModel/LoadingReporter, THREE side warning, favicon 404 (harden).
6. [P3] /about portrait glow/shadow breaks DESIGN.md; 11px off-ramp text; no shared space motif (polish).
