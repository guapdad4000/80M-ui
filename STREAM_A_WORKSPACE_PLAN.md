# Stream A: 80m Portal Workspace — Agent-Facing Features (Phases A1–A6)

## Context
- **Repo**: `/home/falcon/Apps/code/80M-ui/`
- **Stack**: Vite + React 19 + Tailwind v4 + framer-motion
- **Design language**: cream `#eae7de` bg, green `#22c55e` accent, brutalist `border-[#111]` + `shadow-[Npx_Npx_0_0_#111]` / `shadow-[Npx_Npx_0_0_#22c55e]`
- **Shared pattern**: `PaperBackground`, `NoiseOverlay`, `MacWindow`, `NeedBox`, `CheckpointCard`, `fadeUp`, `staggerContainer` variants — import from `PortalShared`
- **Current tab state**: App shell uses Session / History / Agents tabs — **Projects tab does not exist yet**
- **Routing**: React Router (via `App.jsx`) — the `/portal` routes mount portal pages

---

## Architecture Overview

```
src/portal/
  PortalHome.jsx       ← current landing (Courses hub)
  PortalShell.jsx      ← RENAME: top nav shell (rename PortalPage → PortalShell)
  workspace/
    WorkspaceShell.jsx      ← tab bar: Projects | Todos | Notes | Files | Memory | Settings
    WorkspaceProjects.jsx    ← Phase A1
    WorkspaceTodos.jsx       ← Phase A2
    WorkspaceNotes.jsx       ← Phase A3
    WorkspaceFiles.jsx       ← Phase A4
    WorkspaceMemory.jsx      ← Phase A5
    WorkspaceSettings.jsx    ← Phase A6
    workspace.css            ← shared workspace layout styles
```

**Data layer**: All state local via `useState`/`useRef` for now. No backend yet. Persist via `localStorage` keys namespaced `80m-ws-*`.

---

## Phase Dependency Graph

```
A1 [Projects]  ──────────────────────────────► A6 [Settings]
   │                                              │
   ▼                                              │
A2 [Todos] ──► A3 [Notes] ◄──┐                   │
   │                         │                   │
   ▼                         │                   │
A4 [Files] ─────────────────┘                   │
   │                                              │
   ▼                                              │
A5 [Memory] ─────────────────────────────────────┘
```

**Key**: A1 is the foundation — it establishes the shell, routing, project data model, and CSS tokens that every other phase depends on.

---

## Phase A1 — Projects Screen (FOUNDATION)
**Priority: 1 — Do this first. Everything depends on it.**

### What it establishes
- `WorkspaceShell` (the tabbed layout)
- Project data model and CRUD
- Sidebar navigation between projects
- Project detail view with task/agent summary
- Shared CSS tokens for all workspace views

### Tasks

#### A1.1 — Rename and refactor PortalPage → PortalShell
- **File**: `src/portal/PortalPage.jsx` → move content to `src/portal/PortalShell.jsx`
- Extract the top header bar into `PortalShell` (the `<header>` with logo, tabs)
- The Shell renders `<Outlet />` for tab content
- Strip course-specific content from Shell — it becomes a dumb layout wrapper

#### A1.2 — Create WorkspaceShell with tab navigation
- **New file**: `src/portal/workspace/WorkspaceShell.jsx`
- Import from `../PortalShell` (the renamed shell), override inner `<Outlet />` slot
- Tab bar: `Projects | Todos | Notes | Files | Memory | Settings`
- Active tab: `bg-[#111] text-[#eae7de]`, inactive: `hover:bg-[#ddd]`
- Cream bg `#eae7de`, brutalist borders
- Route mapping: `/portal` → redirects to `/portal/projects`
- Routes: `/portal/projects`, `/portal/todos`, `/portal/notes`, `/portal/files`, `/portal/memory`, `/portal/settings`

#### A1.3 — Define project data model + localStorage persistence
```js
// localStorage key: "80m-ws-projects"
// Schema:
{
  projects: [
    {
      id: string,          // uuid
      name: string,
      description: string,
      color: string,       // accent color: green | blue | orange | purple
      createdAt: number,    // timestamp
      updatedAt: number,
      agents: [            // agents linked to this project
        { id, name, model, status }
      ],
      tags: string[],
    }
  ],
  activeProjectId: string | null,
}
```

#### A1.4 — Build Projects list view (WorkspaceProjects.jsx)
- **New file**: `src/portal/workspace/WorkspaceProjects.jsx`
- Top: `+ New Project` button — brutalist, `bg-[#111] text-[#eae7de]`
- Grid of project cards (2-col md, 3-col lg)
- Each card: `border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111]`
  - Project name (serif font), description (truncated 2 lines)
  - Color accent bar on left edge
  - Agent count badge + tag chips
  - Last updated timestamp
- Empty state: large centered prompt to create first project
- Framer-motion `staggerContainer` entrance animation
- `NoiseOverlay` in background (consistent with rest of portal)

#### A1.5 — Build Create/Edit Project modal
- Slide-up modal with `motion.div`
- Fields: Name (required), Description (textarea), Color picker (4 swatches), Tags (comma-separated input)
- Validation: name required, max 60 chars
- Create mode vs Edit mode (pre-fill on edit)
- On save: update localStorage, update state, close modal
- Delete button in edit mode: red accent, confirm step

#### A1.6 — Build Project Detail view
- When a project card is clicked → show detail panel (slide in from right, `motion.div`)
- Header: project name (editable inline), description, color, tags
- Agent sub-panel: list of linked agents (name, model, status dot)
- Quick stats: todos count, notes count, files count, memory entries
- `+ Add Agent` button → assigns an agent to this project
- `Edit Project` and `Delete Project` buttons

#### A1.7 — Shared workspace CSS tokens
- **New file**: `src/portal/workspace/workspace.css`
- Define CSS variables for workspace spacing, border radius, shadow
- Brutalist shadow mixin classes: `ws-card`, `ws-card-hover`, `ws-btn`, `ws-btn-ghost`
- Scrollbar styling for workspace panels

#### A1.8 — Wire routes into App.jsx
- Add route: `/portal/projects` → `WorkspaceProjects`
- Redirect `/portal` → `/portal/projects`
- Ensure `WorkspaceShell` wraps all workspace routes

### Phase A1 Deliverables
- `src/portal/PortalShell.jsx` (renamed)
- `src/portal/workspace/WorkspaceShell.jsx`
- `src/portal/workspace/WorkspaceProjects.jsx`
- `src/portal/workspace/workspace.css`
- Updated `App.jsx` routing

---

## Phase A2 — Todos Screen
**Priority: 2 — Depends on A1 (project data model, shell)**

### What it does
Task management scoped to active project. Agents can read/write todos via Hermes prompts.

### Tasks

#### A2.1 — Define todo data model
```js
// localStorage key: "80m-ws-todos"
{
  todos: [
    {
      id: string,
      projectId: string,
      title: string,
      description: string,
      status: "open" | "in_progress" | "done",
      priority: "low" | "medium" | "high",
      assigneeId: string | null,   // agent id
      createdAt: number,
      updatedAt: number,
      dueDate: number | null,
      tags: string[],
    }
  ]
}
```

#### A2.2 — Build WorkspaceTodos.jsx
- **New file**: `src/portal/workspace/WorkspaceTodos.jsx`
- Left sidebar: project selector (dropdown or list of user's projects)
- Main area: Kanban board with 3 columns — `Open | In Progress | Done`
- Or toggle to list view
- Drag-and-drop between columns (use `@dnd-kit/core` — add to package.json if needed)
- Todo card: title, priority badge (color-coded), assignee avatar, due date
- Framer-motion layout animations on drag

#### A2.3 — Create/Edit/Delete todo modal
- Same pattern as A1.5 project modal
- Fields: Title, Description, Status, Priority, Assignee (dropdown of project agents), Due Date, Tags
- Inline quick-add bar at top: type title + Enter to create open todo

#### A2.4 — Filter bar
- Filter by: Project, Assignee, Priority, Status, Tag
- Sort by: Created date, Due date, Priority, Updated
- Search by title/description

#### A2.5 — Agent-facing Hermes prompts (document in component)
```js
// Hermes can write todos via structured output:
// {"action": "create_todo", "projectId": "...", "title": "...", "priority": "high"}
// {"action": "update_todo", "id": "...", "status": "done"}
```

### Phase A2 Deliverables
- `src/portal/workspace/WorkspaceTodos.jsx`
- Updated `workspace.css` with kanban-specific styles

---

## Phase A3 — Notes Screen
**Priority: 3 — Depends on A1 (project scoping)**

### What it does
Rich notes per project. Markdown support. Notes are agent-writable.

### Tasks

#### A3.1 — Define note data model
```js
// localStorage key: "80m-ws-notes"
{
  notes: [
    {
      id: string,
      projectId: string,
      title: string,
      content: string,       // markdown
      tags: string[],
      createdAt: number,
      updatedAt: number,
      pinned: boolean,
    }
  ]
}
```

#### A3.2 — Build WorkspaceNotes.jsx
- **New file**: `src/portal/workspace/WorkspaceNotes.jsx`
- Two-panel layout: left = note list, right = note editor
- Note list: title, preview (first 80 chars), tags, date
- Search + filter by project + tag
- Pinned notes float to top

#### A3.3 — Markdown editor
- Use `react-markdown` (add to package.json) for rendering
- Simple textarea for editing (no rich text needed — agents prefer markdown)
- Split view toggle: edit | preview | split
- Toolbar: bold, italic, code, link, heading shortcuts (button row above textarea)

#### A3.4 — Create/Edit/Delete notes
- Click note to open in editor panel
- `+ New Note` button
- Inline title editing
- Auto-save on blur or after 1s debounce
- Delete with confirmation

### Phase A3 Deliverables
- `src/portal/workspace/WorkspaceNotes.jsx`
- Add `react-markdown` dependency

---

## Phase A4 — Files Screen
**Priority: 4 — Depends on A1 (project scoping)**

### What it does
File browser for project assets (images, PDFs, documents). File metadata only — actual files referenced by path/URL.

### Tasks

#### A4.1 — Define file data model
```js
// localStorage key: "80m-ws-files"
{
  files: [
    {
      id: string,
      projectId: string,
      name: string,
      type: "image" | "document" | "video" | "other",
      size: number,
      path: string,            // local path or URL
      tags: string[],
      uploadedAt: number,
      uploadedBy: string,     // agent id or "user"
    }
  ]
}
```

#### A4.2 — Build WorkspaceFiles.jsx
- **New file**: `src/portal/workspace/WorkspaceFiles.jsx`
- Project selector + folder tree / flat list toggle
- File grid: thumbnails for images, icons for other types
- File card: name, size, type badge, tags, upload date
- Upload button: drag-and-drop zone or file picker input
- Store files as base64 in localStorage (small files) or store path/URL (large files)

#### A4.3 — File preview modal
- Click file → open preview modal
- Images: `<img>` preview
- Documents: link to open in new tab or embed
- Metadata panel: name, size, type, path, tags, uploader

#### A4.4 — File search + filter
- Search by name, filter by type, filter by project, filter by tag

### Phase A4 Deliverables
- `src/portal/workspace/WorkspaceFiles.jsx`

---

## Phase A5 — Memory Screen
**Priority: 5 — Depends on A1 (project + agent scoping)**

### What it does
Agent memory bank — key facts, instructions, and context per project that Hermes/agents should remember.

### Tasks

#### A5.1 — Define memory entry data model
```js
// localStorage key: "80m-ws-memory"
{
  entries: [
    {
      id: string,
      projectId: string,
      type: "fact" | "instruction" | "preference" | "context",
      content: string,
      tags: string[],
      createdAt: number,
      updatedAt: number,
    }
  ]
}
```

#### A5.2 — Build WorkspaceMemory.jsx
- **New file**: `src/portal/workspace/WorkspaceMemory.jsx`
- Project selector
- Entry list: type badge, content, tags, date
- Types get distinct visual treatment:
  - `fact` → blue accent
  - `instruction` → green accent
  - `preference` → orange accent
  - `context` → purple accent

#### A5.3 — Memory editor
- Create/Edit/Delete entries
- Type selector (4 options with icons)
- Content textarea
- Tags input
- Quick-add: type → content inline

#### A5.4 — Search + export
- Search by content
- Filter by type and project
- Export button: copies all memory entries for a project as formatted text (for pasting into Hermes/system prompt)

#### A5.5 — Agent prompt format
```js
// Memory export format for Hermes:
// PROJECT: [Project Name]
// FACTS:
// - ...
// INSTRUCTIONS:
// - ...
// PREFERENCES:
// - ...
// CONTEXT:
// - ...
```

### Phase A5 Deliverables
- `src/portal/workspace/WorkspaceMemory.jsx`

---

## Phase A6 — Settings Screen
**Priority: 6 — Depends on A1 (shell is ready, no data dependencies)**

### What it does
Workspace-level configuration: agent management, API keys, theme, export/import.

### Tasks

#### A6.1 — Define settings data model
```js
// localStorage key: "80m-ws-settings"
{
  agents: [
    { id, name, model, instructions, status: "active" | "paused", avatar }
  ],
  apiKeys: {
    openai: string | null,
    gemini: string | null,
    anthropic: string | null,
  },
  workspace: {
    defaultProjectId: string | null,
    autoSaveInterval: number,  // ms
    theme: "light" | "dark",   // future
  }
}
```

#### A6.2 — Build WorkspaceSettings.jsx
- **New file**: `src/portal/workspace/WorkspaceSettings.jsx`
- Tabbed settings layout within the page:
  - Agents
  - API Keys
  - Workspace
  - Data (Export/Import)

#### A6.3 — Agents tab
- List registered agents
- Add agent: name, model selector (GPT-4o, Claude 3.5, Gemini 2, etc.), instructions textarea, status toggle
- Edit/Delete agent
- Agent cards: avatar (initials), name, model, status dot

#### A6.4 — API Keys tab
- Input fields for: OpenAI, Gemini, Anthropic, Postiz
- Keys masked by default (click to reveal toggle)
- Save → stored in localStorage
- Warning: "Keys are stored locally in your browser. Do not share this device."

#### A6.5 — Workspace tab
- Default project selector
- Auto-save interval slider
- Workspace name

#### A6.6 — Data tab (Export/Import)
- Export All: download `80m-workspace-backup.json` with all localStorage data
- Import: upload `.json` to restore
- Clear All Data: button with double-confirm modal
- Per-section export: Projects, Todos, Notes, Files, Memory (individual downloads)

### Phase A6 Deliverables
- `src/portal/workspace/WorkspaceSettings.jsx`

---

## Implementation Order Summary

| Phase | File(s) | Effort | Key Dependency |
|-------|---------|--------|----------------|
| A1 | `PortalShell`, `WorkspaceShell`, `WorkspaceProjects`, `workspace.css`, routing | High | None — foundation |
| A2 | `WorkspaceTodos` | Medium | A1 (project model, shell) |
| A3 | `WorkspaceNotes` | Medium | A1 (project scoping) |
| A4 | `WorkspaceFiles` | Medium | A1 (project scoping) |
| A5 | `WorkspaceMemory` | Low | A1 (project + agent model) |
| A6 | `WorkspaceSettings` | Medium | A1 (shell ready) |

---

## New Dependencies to Add

```bash
npm install react-markdown @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

| Package | Used In | Purpose |
|---------|---------|---------|
| `react-markdown` | A3 Notes | Markdown rendering |
| `@dnd-kit/core` | A2 Todos | Drag-and-drop Kanban |
| `@dnd-kit/sortable` | A2 Todos | Sortable todo cards |
| `@dnd-kit/utilities` | A2 Todos | CSS utilities for DnD |

---

## Testing Checklist (Per Phase)

- [ ] Phase A1: Create project → edit → delete. Tab navigation works. Data persists on refresh.
- [ ] Phase A2: Create todos in all 3 statuses. Drag between columns. Filter works. Assign to agent.
- [ ] Phase A3: Create note with markdown. Preview renders correctly. Auto-save fires.
- [ ] Phase A4: Upload image file. Preview shows. Delete removes from list.
- [ ] Phase A5: Create entries of each type. Export produces formatted text.
- [ ] Phase A6: Save API keys → masked on reload. Export → valid JSON. Import restores state.

---

## Design Tokens Reference (Brutalist System)

```css
/* Backgrounds */
bg-cream = bg-[#eae7de]

/* Borders */
border-brutalist = border-[3px] border-[#111]

/* Cards */
card = border-[3px] border-[#111] bg-white shadow-[6px_6px_0_0_#111]
card-hover = hover:shadow-[10px_10px_0_0_#22c55e] hover:border-[#22c55e]

/* Buttons */
btn-primary = bg-[#111] text-[#eae7de] hover:bg-[#22c55e] hover:text-[#111]
btn-ghost = border-[2px] border-[#111] hover:border-[#22c55e]

/* Accent */
accent-green = text-[#22c55e] / bg-[#22c55e]
accent-dark = bg-[#111] text-[#eae7de]

/* Typography */
font-serif = font-family: 'Playfair Display'
font-sans = font-family: 'Inter'
font-mono = font-family: 'JetBrains Mono'
```
