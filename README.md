# 80m UI — The Machine

> The public-facing course portal and marketing site for [80m Systems](https://80m.ai). Three classes. One fully voice-controlled, locally-hosted AI agent stack you own forever.

---

## What Is This?

80m sells a $2,000 self-paced course that teaches you to build your own private AI agent system — voice-controlled, running 24/7 on your own hardware, with zero subscriptions.

This repo is the **course portal UI** + **marketing landing page** for that course. It includes:

- **Landing page** — Sales page, curriculum overview, pricing, FAQ
- **Course portal** — Three immersive, interactive course experiences (Class 01, 02, 03)
- **Portfolio** — Social proof section with client work

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 11 |
| Routing | React Router DOM 7 |
| 3D effects | Three.js |
| Deployment | Static — `npm run build` → `/dist` |

---

## Project Structure

```
80M-ui/
├── src/
│   ├── App.jsx              # Landing page (home route /)
│   ├── PortalPage.jsx       # Course portal (/portal route) — the big one
│   ├── App.css              # Shared styles
│   ├── index.css            # Tailwind base + custom properties
│   ├── main.jsx             # React root + BrowserRouter
│   ├── FuzzyText.jsx         # Glitch/fuzzy text animation component
│   ├── DecryptedText.jsx     # Typewriter/decryption animation
│   └── assets/              # Static images, fonts
├── public/
│   ├── index.html           # SPA shell
│   └── portfolio/           # Client work screenshots
├── dist/                    # Built output (served in production)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server — http://localhost:5173
npm run build        # Production build → /dist
npm run preview      # Preview the built output locally
npm run lint         # ESLint check
```

---

## The Three Classes

### Class 01 — Install the Stack (~75 min)
Get the base system running locally. OpenClaw + Hermes installed from scratch. Voice interface wired up. Agent council running 24/7 as a background daemon.

**Sections:** Money / Terminal / The Council / Hardware Checklist / Docker Explained / Troubleshooting / Localhost vs The World / The Update Loop / The Dumb‑Proof Dictionary / Resource Locker

**Interactive elements:** Copy All buttons on code blocks, embedded terminal aesthetic

---

### Class 02 — Talk to It Properly (~80 min)
Master the LLM context window. Write prompts that don't suck. Inject your brand's voice. Structure outputs for automation pipelines.

**Sections:** Prompting / Context Window / Delegation / Fabric Memory / Chain of Thought / Voice Interaction / Morning Brief / The Dumb‑Proof Dictionary / Resource Locker

**Interactive elements:** Copy All buttons, snarky tone throughout

---

### Class 03 — Own the Infrastructure (~90 min)
Deploy to production. Secure your endpoints. Configure cron jobs. DNS, Nginx reverse proxy, Cloudflare Tunnels, SSL/HTTPS, firewall.

**Sections:** DNS & Domains / Nginx / Server Defense Simulator / SSL-HTTPS / Cloudflare Tunnel / Log Monitoring / Scaling / Firewall / The Dumb‑Proof Dictionary / Resource Locker

**Interactive elements:**
- **Server Defense Simulator** — Live traffic visualizer; send packets and watch the bouncer block/allow them
- **Log Monitor** — Refreshable Nginx access log viewer with simulated brute-force attack detection
- **Firewall Rule Builder** — Form that generates `ufw` commands in real time
- **Quizzes** — 8 sections × 3 questions each with instant feedback, scoring, and pass/fail toasts

---

## The Agent Council

80m agents are named, specialized AI workers. Each has a domain:

| Agent | Role | Color |
|---|---|---|
| **Hermes** | Chief coordinator — orchestrates all other agents | cyan |
| **Prawnius** | Quick tasks, one-offs, short research | cyan |
| **Sir Clawthchilds** | Finance, budgets, spreadsheets, money decisions | gold |
| **Claudnelius** | Code, design, UI, technical architecture | blue |
| **Knowledge Knaight** | Cortex/memory, fact retrieval, research | purple |
| **Knaight of Affairs** | Scheduling, calendars, coordination, Discord | green |
| **Labrina** | Social media, content, audience engagement | pink |
| **Clawdette** | Everyday tasks, delegation coordinator, queen of getting things done | orange |

In the Cortex Mobile app, agents are represented as **orbs** (o1–o7) that map to the DB agents by index. The **Group Chat** (Cortex Council) shows per-agent color bubbles.

---

## Key UI Patterns

### MacWindow
```jsx
<MacWindow title="terminal.sh" className="-rotate-1">
  <div className="p-6 font-mono text-sm text-[#22c55e]">...</div>
</MacWindow>
```
Styled to look like a macOS window — dark chrome, traffic light dots, title bar.

### NeedBox
```jsx
<NeedBox
  title="What you need before you start"
  items={["Item one.", "Item two."]}
/>
```
Prerequisite checklist rendered as a styled callout before each section.

### CopyButton (embedded in MacWindow)
Click-to-copy functionality on all code blocks. Shows "Copied!" feedback for 2 seconds.

### Quiz System
```jsx
const [quizActive, setQuizActive] = useState(false);
const [quizSection, setQuizSection] = useState(null);
```
- Clicking "Take Quiz" sets `quizActive(true)` + `quizSection(N)`
- `QuizModal` renders conditionally with step-by-step questions
- Auto-advances 1.6s after correct answer
- Bottom toast shows score on completion

### Body Scroll Lock
```jsx
useEffect(() => {
  if (activeCourseId) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [activeCourseId]);
```
When a course modal is open, body scroll is locked so only the course content scrolls.

---

## Development Notes

### Why `PortalPage.jsx` is one big file
Course content lives in a single component (~1,900 lines) rather than being split into per-course/per-section files. This keeps course content easy to read top-to-bottom, copy-paste into the agent chat, and maintain as a single narrative. Component definitions (QuizModal, NeedBox, MacWindow, etc.) are defined at the top of the file before the content.

### Tailwind v4
Using Tailwind v4 with the new `@theme` inline CSS variable approach. No `tailwind.config.js` is used for core theme — custom tokens are defined in `src/index.css` under `@theme`.

### Vite + React 19
Rolldown is used as the bundler (via Vite 6). React 19 with the new JSX transform — no `import React from 'react'` needed for JSX, but `React` is still imported where required (e.g., `React.Fragment`).

### Framer Motion
The landing page uses `motion.div` variants for scroll-triggered animations. The portal course view uses simpler CSS transitions for performance.

### SPA Routing
`App.jsx` serves as the landing page at `/`. `PortalPage.jsx` is served at `/portal`. The router in `main.jsx` does a pathname check — no separate route config file needed for a 2-page SPA.

### Static Deploy
`npm run build` outputs to `/dist`. The `serve dist -l 8080 -s` command uses SPA mode (`-s`) so all routes rewrite to `/dist/index.html`.

---

## Git Workflow

```bash
git add .
git commit -m "feat: complete portal with 3 courses, quizzes, simulators"
git push origin main
```

> **Note:** `patch_quiz.py` and `patch_quiz2.py` are one-off scripts used during development. They're committed but not meant to be run again.

---

## Related Repos

- **80M-brand** (`/mnt/7DC21CFC5AB9C3AB/Apps/code/80M-brand/`) — Brand assets, logo, mascot images
- **Cortex Mobile** (`/home/falcon/Apps/code/cortex-mobile/`) — The mobile app that hosts the agent council
- **Hermes Avatar Local** — Desktop voice interface for the 80m agent system

---

*80m Systems — Own your AI stack. No subscriptions. No rent.*
