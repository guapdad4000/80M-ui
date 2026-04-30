# Stream B — Execution Plan
## 80m Portal Courses Phases B1–B5: Customer-Facing Landing + Courses

---

## Overview

Build the customer-facing portal experience for the 80m course curriculum:
- **5 courses** (Classes 01–05) — Class 04 Content Forge is the reference impl
- **Stack:** Vite + React 19 + Tailwind v4 + framer-motion + react-router-dom v7
- **Design:** Cream bg (#eae7de), green accent (#22c55e), brutalist borders, ATM mascot, MacWindow component
- **Architecture:** PortalShell wraps all course pages via react-router nested routes

---

## Phase Dependency Graph

```
B0 (foundation) ──► B1 ──► B2 ──► B3 ──► B4 ──► B5
                   (router+shell) (c01 migrate) (c02 migrate) (c03 build)  (courses landing)
```

---

## Phase B0 — Foundation Audit (Parallel Prep)
**Priority: P0 — Do First**
**Depends on: Nothing**

- [ ] Audit `PortalPage.jsx` — identify full course content for C01, C02, C03, C05
- [ ] Audit `courses.txt` / `80-courses.txt` — identify any content not yet in codebase
- [ ] Confirm Class 04 (`Class04.jsx`) is the reference implementation for component patterns
- [ ] Confirm all shared components in `PortalShared.jsx` — count/validate them
- [ ] Confirm `MacWindow`, `PaperBackground`, `NoiseOverlay`, `AtmScrollbar` APIs
- [ ] Check if `FuzzyText` and `DecryptedText` are used in portal routes

**Output:** Checklist of what content exists vs what needs building.

---

## Phase B1 — Router + Shell Rewrite
**Priority: P0 — Must Do First**
**Depends on: B0**

### B1.1 — Rewrite PortalShell

- [ ] Refactor `PortalShell.jsx` to use React Router v7 nested routes properly
- [ ] Move `NoiseOverlay` import from `PortalShared` (already there)
- [ ] Nav bar must show current route label dynamically via `useLocation`
- [ ] "Exit Portal" button navigates to `/` (main site)
- [ ] The shell wraps all portal content via `<Outlet />`
- [ ] Add `framer-motion` page transition wrapper to shell

**File:** `src/portal/PortalShell.jsx`

### B1.2 — Define Portal Route Map

- [ ] Add all 5 course routes to `PortalShell`:
  - `/portal` → `PortalHome` (index)
  - `/portal/class-01` → `Class01`
  - `/portal/class-02` → `Class02`
  - `/portal/class-03` → `Class03`
  - `/portal/class-04` → `Class04`
  - `/portal/class-05` → `Class05` (placeholder/stub initially)

**File:** `src/portal/PortalShell.jsx`

### B1.3 — Wire PortalShell into main.jsx

- [ ] Update `main.jsx` to add `/portal/*` route in BrowserRouter
- [ ] Alternatively: mount `PortalShell` as a parent route at `/portal` with child routes
- [ ] Ensure `/portal` and `/portal/class-XX` both render inside shell

**File:** `src/main.jsx`

### B1.4 — Portal Nav Component

- [ ] Ensure `PortalNav` reads from route map to display current class name
- [ ] Add class count/progress indicator in nav (e.g., "3/5 classes complete")
- [ ] Mobile: hamburger menu or simple horizontal scroll for nav items

**File:** `src/portal/PortalShell.jsx` (PortalNav subcomponent)

### B1.5 — Shell Styling Audit

- [ ] Confirm shell uses same brutalist border + shadow system as Class04.jsx
- [ ] Confirm sticky header with `#111` bg + `#22c55e` border-bottom
- [ ] Ensure `NoiseOverlay` is present in shell (prevents grain flicker on navigation)
- [ ] Check mobile responsiveness of shell layout

**Validation:** Navigate to `/portal`, `/portal/class-01`, `/portal/class-04` — all should render inside shell with correct nav label.

---

## Phase B2 — Class 01 Migration (Install the Stack)
**Priority: P1**
**Depends on: B1 (shell must work first)**

### B2.1 — Extract C01 from PortalPage.jsx

- [ ] Identify the `CourseOneContent` export in `PortalPage.jsx`
- [ ] Copy full component body into `src/portal/Class01.jsx`
- [ ] Adapt: replace top-level `<motion.div fixed inset-0>` wrapper with direct content (shell handles wrapping)
- [ ] Keep sticky header? No — shell has the header. Replace with class-specific header band inside content area.
- [ ] Adapt `onClose` prop: use `useNavigate` to go back to `/portal`

### B2.2 — Component Signature

```jsx
const Class01 = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      {/* Class 01 content — no sticky header, no NoiseOverlay (shell has it) */}
    </motion.div>
  );
};
```

### B2.3 — Import Shared Components

- [ ] Import from `../PortalShared`: `MacWindow`, `PaperBackground`, `NeedBox`, `CheckpointCard`, `CourseBoostPanel`, `SectionMeta`, `FAQItem`
- [ ] Import `NoiseOverlay` — but only if shell does not include it (shell includes it)
- [ ] Replace any inline `NoiseOverlay` / `PaperBackground` instances (shell handles background)

### B2.4 — Section Structure (follow Class04 pattern)

- [ ] Section 0: "Why are we doing this?" (Anti-SaaS Bleed Calculator)
- [ ] Section 1: Hardware Reality Check (interactive checklist)
- [ ] Section 2: Hermes + OpenClaw explanation
- [ ] Section 3: API Keys (VIP Pass)
- [ ] Section 4: Docker / Terminal (interactive mock terminal with button)
- [ ] Section 5: Agent Council (3-card grid)
- [ ] End-of-class CTA

### B2.5 — Interactive Elements to Preserve

- [ ] Anti-SaaS Bleed Calculator (slider, real-time $ calculation)
- [ ] Hardware checklist (4 items with checkboxes)
- [ ] Terminal install simulation (button triggers sequential log lines)
- [ ] Keep all `framer-motion` animations from original

### B2.6 — Route Registration

- [ ] Add `<Route path="class-01" element={<Class01 />} />` to PortalShell
- [ ] Update `PortalCourses.jsx` course list — set C01 status from `stub` to `available`

**File:** `src/portal/Class01.jsx`

---

## Phase B3 — Class 02 Migration (Talk to It Properly)
**Priority: P1**
**Depends on: B1 (shell must work first)**

### B3.1 — Extract C02 from PortalPage.jsx

- [ ] Identify `CourseTwoContent` export in `PortalPage.jsx`
- [ ] Copy full component into `src/portal/Class02.jsx`
- [ ] Remove top-level fixed overlay (shell handles it)
- [ ] Replace `onClose` with `useNavigate` back to `/portal`
- [ ] Remove inline `NoiseOverlay` (shell has it)

### B3.2 — Section Structure

- [ ] Section 0: "Stop Saying Please" (intervention card)
- [ ] Section 1: Boss Mode Prompt Translator (interactive prompt translation)
- [ ] Section 2: Context Windows (interactive slider)
- [ ] Section 3: Memory & Fabric (with/without comparison)
- [ ] Section 4: Cron Jobs / Morning Brief Builder (interactive checklist + simulate)
- [ ] Section 5: Hallucinations (fix section)
- [ ] End-of-class CTA

### B3.3 — Interactive Elements

- [ ] Prompt Translator: weak ask → boss mode translation (3-state toggle)
- [ ] Context Slider: live token counter with color-coded status
- [ ] Morning Brief Builder: checkbox toggles for email/calendar/slack/news
- [ ] Simulate button: generates fake morning brief output

### B3.4 — Route Registration

- [ ] Add `<Route path="class-02" element={<Class02 />} />` to PortalShell
- [ ] Update `PortalCourses.jsx` — set C02 status to `available`

**File:** `src/portal/Class02.jsx`

---

## Phase B4 — Class 03 Build
**Priority: P2**
**Depends on: B1, B2 (uses same patterns)**

### B4.1 — Identify C03 Content

- [ ] Search `courses.txt` / `80-courses.txt` for Class 03 content
- [ ] Check `PortalPage.jsx` for any remaining class exports beyond C01/C02/C04
- [ ] If no content exists, build stub with section skeleton matching Class04 pattern
- [ ] Structure: intro → 5-8 sections → checkpoint card → CTA

### B4.2 — Build Class03 Component

- [ ] Follow same component pattern as Class01/Class02
- [ ] Include: `NeedBox`, `SectionMeta`, `MacWindow`, `CheckpointCard`, `CourseBoostPanel`
- [ ] Add at least 2 interactive elements (not just static text)
- [ ] Wrap in shell, use `useNavigate` for navigation

### B4.3 — Route Registration

- [ ] Add `<Route path="class-03" element={<Class03 />} />` to PortalShell
- [ ] Update `PortalCourses.jsx` — set C03 status (stub or available)

**File:** `src/portal/Class03.jsx`

---

## Phase B5 — Portal Home + Courses Landing Page
**Priority: P1**
**Depends on: B1 (shell), B2, B3, B4**

### B5.1 — Rewrite PortalHome as Full Curriculum Landing

- [ ] Keep `PortalHome` at `/portal` (index route)
- [ ] Replace current single-course display with full curriculum grid
- [ ] Show all 5 classes in a card grid matching `PortalCourses.jsx` pattern

### B5.2 — Curriculum Grid Component

- [ ] Use same card component as `PortalCourses.jsx`
- [ ] Each card shows: class number, title, tagline, status badge (available/stub/locked)
- [ ] Status logic:
  - C01: `available` (B2 done)
  - C02: `available` (B3 done)
  - C03: `stub` (B4 done but content may be partial)
  - C04: `available`
  - C05: `stub` / `coming-soon`
- [ ] Cards link to respective `/portal/class-XX` routes
- [ ] Add progress tracking: read from localStorage which classes completed

### B5.3 — Progress Persistence

- [ ] Add `useLocalStorage` hook or direct `localStorage` usage for class completion
- [ ] Each class: "Mark Complete" button at end writes to localStorage key `80m-portal-progress`
- [ ] Home page reads progress and shows completion badges
- [ ] Format: `{ class01: false, class02: true, class03: false, class04: true, class05: false }`

### B5.4 — ATM Mascot Integration

- [ ] Add ATM mascot element to `PortalHome` (reuse from `App.jsx` if available)
- [ ] Or create simple ATM SVG component in `PortalShared`
- [ ] Place in hero section or as floating element
- [ ] Style: brutalist border + green accent, no rounded corners

### B5.5 — "Courses" Secondary Page

- [ ] Keep or enhance `PortalCourses.jsx` as a `/portal/courses` route
- [ ] More detailed version of home grid with prerequisites section
- [ ] Prerequisites table: C01-C03 foundation, C04-C05 production

### B5.6 — Final Route Map (Complete)

```
/portal                    → PortalHome (curriculum landing)
/portal/courses            → PortalCourses (full catalog)
/portal/class-01           → Class01 (available)
/portal/class-02           → Class02 (available)
/portal/class-03           → Class03 (stub or available)
/portal/class-04           → Class04 (available)
/portal/class-05           → Class05 (stub/coming-soon)
```

---

## Shared Component Checklist

All these must be imported from `../PortalShared` in course components:

| Component | Used In | Notes |
|---|---|---|
| `NoiseOverlay` | Shell only | Canvas-based grain |
| `PaperBackground` | PortalHome, PortalCourses | Cream + blue blobs |
| `MacWindow` | C01, C02, C03, C04 | Terminal window UI |
| `NeedBox` | All classes | Prerequisites list |
| `CheckpointCard` | All classes | Pass/fail checklist |
| `CourseBoostPanel` | All classes | Success criteria + prompts |
| `SectionMeta` | All classes | Time + focus tags |
| `FAQItem` | All classes | Expandable Q&A |
| `QuizModal` | C03, C04, C05 | Quiz flow (follow C04 pattern) |
| `GlossaryTooltip` | All classes | Inline term definitions |
| `CopyBlock` | All classes | Code/text copy button |
| `ResourceList` | All classes | External resource links |

---

## Design System Compliance Checklist

- [ ] Background: `#eae7de` cream (`bg-[#eae7de]`)
- [ ] Primary accent: `#22c55e` green
- [ ] Secondary: `#38bdf8` sky blue
- [ ] Dark: `#111` near-black
- [ ] Borders: `border-[3px] border-[#111]` (brutalist, thick)
- [ ] Shadows: `shadow-[8px_8px_0_0_#111]` (offset, no blur)
- [ ] MacWindow: black bg, green glow, scanline overlay, copy button
- [ ] Typography: `font-serif` for body, `font-sans font-black` for headings, `font-mono` for code/labels
- [ ] Motion: `framer-motion` fade-up stagger on page load
- [ ] ATM mascot: SVG or component, brutalist style, green accents

---

## Testing Checklist

- [ ] Navigate: `/` → `/portal` → `/portal/class-01` → `/portal/class-04` — all work
- [ ] Shell header shows correct class name on each route
- [ ] "Exit Portal" button returns to main site
- [ ] NoiseOverlay grain visible on portal pages
- [ ] MacWindow copy button works on all instances
- [ ] All interactive elements (sliders, checkboxes, buttons) respond correctly
- [ ] Mobile: layout adapts, no horizontal overflow
- [ ] Progress: mark class complete → localStorage updates → home page reflects it
- [ ] Build: `npm run build` passes without errors
- [ ] No console errors on portal routes

---

## File Changes Summary

| File | Action | Phase |
|---|---|---|
| `src/portal/PortalShell.jsx` | Rewrite (nested routes, all 5 courses) | B1 |
| `src/main.jsx` | Add `/portal/*` route | B1 |
| `src/portal/PortalHome.jsx` | Rewrite as curriculum landing | B5 |
| `src/portal/PortalCourses.jsx` | Enhance with status badges + progress | B5 |
| `src/portal/Class01.jsx` | Migrate from PortalPage.jsx + adapt | B2 |
| `src/portal/Class02.jsx` | Migrate from PortalPage.jsx + adapt | B3 |
| `src/portal/Class03.jsx` | Build from docs + stub enhancement | B4 |
| `src/portal/Class04.jsx` | Already complete — validate route wiring | B1 |
| `src/portal/Class05.jsx` | Create stub placeholder | B4 |
| `src/PortalShared.jsx` | Add `AtmMascot` component | B5 |

---

## Priority Order for Execution

1. **B1.1–B1.3** — Shell + Router (foundation — blocks everything)
2. **B2.1–B2.6** — Class 01 migration (first available course)
3. **B3.1–B3.4** — Class 02 migration (second available course)
4. **B4.1–B4.3** — Class 03 build (fills the grid)
5. **B5.1–B5.3** — Portal Home rewrite (curriculum landing)
6. **B5.4** — ATM mascot integration
7. **B5.5** — PortalCourses enhancement
8. **Testing** — Full portal navigation + build validation
