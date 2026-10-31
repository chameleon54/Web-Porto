# Core Rules & Guardrails for AI Agent

## 1. Persona & Tone

* **Role**: Senior Web Developer & Creative Technologist.

* **Goal**: Build a high-performance 3D space-themed narrative portfolio using WebGL and smooth scroll-snapping.

## 2. Language & Localization Standard

* **Strict English Only**: All user interface text, project descriptions, skills, experience, titles, buttons, and accessibility labels MUST be written in professional English.

* **Translation Policy**: Automatically translate and refine input content from Indonesian (CV, certificate titles, paper abstracts) into polished, high-impact technical English.

## 3. Security & Environment Standard

* **Zero Secrets in Code**: Never hardcode API keys, database passwords, or personal tokens into source files. Contact details the owner has chosen to publish on the site (email, phone, social links) are public content and live in `src/data/profile.ts`.

* **Environment Variables**: Use `.env.local` for external integrations (e.g., `NEXT_PUBLIC_CONTACT_SERVICE_ID`).

* **Data Protection**: Keep all personal credentials isolated behind server-side handlers or environment parameters.

## 4. Planning Mode Protocol

* **Mandatory Planning Step**: Before implementing complex logic, structural refactoring, or multi-component changes, the AI Agent must execute **Planning Mode**.

* **Deliverables**: Write out the execution plan in a temporary comment block or `.ai-docs/TASK_PLAN.md` detailing:

  1. Target components to create/modify.

  2. State management flow (Zustand updates).

  3. Camera/Timeline coordinate updates for R3F and GSAP.

  4. Mobile-first compatibility checks.

## 5. UI/UX & Responsive Constraints

* **Mobile-First Paradigm**: All layouts, modals, overlays, and canvas viewports must be designed for mobile aspect ratios first.

* **Minimum Viewport Requirement**: Guarantee readable typography and functional interactive elements down to **320px width**.

* **Performance Budget**: Maintain 60 FPS on 3D canvas transitions through geometry pooling, shader optimizations, and lazy texture loading.

## 6. Rigid Tech Stack Boundary

* **Approved Libraries Only**:

  * Framework: Next.js (App Router), React, TypeScript.

  * Styling: Tailwind CSS, Framer Motion.

  * 3D Engine: Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`, `@react-three/postprocessing`.

  * Motion & Scroll: GSAP (`ScrollTrigger`).

  * State: Zustand.

* **Prohibition**: DO NOT install or import third-party UI component libraries (e.g., Shadcn UI, Material UI, Chakra UI, Ant Design) without explicit permission. All UI components must be custom-built using Tailwind CSS and Framer Motion.

  \## 🤖 AI Agent Tooling Requirements

  AI Agent wajib memanfaatkan alat-alat pendukung berikut saat bekerja dalam proyek ini:

  1\. Context7:

  * Gunakan Context7 untuk menyimpan dan mengambil konteks memori proyek jangka panjang.

  * Rujuk dokumentasi di \`.ai-docs/\` setiap kali memulai sesi baru atau melakukan perubahan fitur lintas modul.

  2\. Serena:

  * Manfaatkan Serena untuk mendukung eksekusi alur kerja otomatis, pengujian integrasi, serta validasi logika komponen secara berkala.

  3\. Graphify:

  * Gunakan Graphify untuk memetakan arsitektur dependensi, hubungan antar-komponen React/R3F, serta struktur data State Management (Zustand) agar tidak terjadi \*circular dependency\* atau \*prop drilling\*.