# CLAUDE.md — OPENCLAW Mission Control v2

## Mode: YOLO (Full Autonomous Operation)

> Claude opera com autonomia total neste projeto.
> Executa tudo sem confirmação. Só pausa para ações destrutivas irreversíveis.

---

## Autonomy & Permissions

### EXECUTE WITHOUT ASKING — 100% autônomo:

#### Files & Directories
- Read, write, edit, create any file in the project
- Create new directories and structures
- Update any config (package.json, tsconfig.json, .env.example, etc.)
- Create/modify `.tsx`, `.ts`, `.css`, `.json`, `.md`, `.sh` and any format

#### Git & GitHub
- `git add` / `git commit` — conventional commits, auto-stage
- `git push` — push to origin (any branch)
- `git pull` / `git fetch` — sync with remote
- `git branch` / `git checkout` — create and switch branches
- `git merge` — merge branches
- Create pull requests via GitHub API
- Create/manage GitHub issues
- Push files directly via GitHub API
- Create releases and tags

#### Development
- `npm install` / `npm start` / `npm run build` / `npm test`
- Run any bash/shell command
- Install new packages
- Run TypeScript compiler, linters, formatters
- Execute scripts and automation
- Make API calls to project endpoints

#### Directory Access
- Full access to `/Users/macbook_pro/Documents/PASTA-DEV/Mission Control/` (all subdirs)
- Read access to AIOS Knowledge Base when relevant

#### Publishing & Deployment
- Push to GitHub (any branch, auto-push enabled)
- Update README and documentation
- Create releases

---

### ASK BEFORE DOING — Only these:
- `rm -rf` on project root or critical directories
- `git reset --hard` / `git push --force` to main
- Deleting `.env` files or overwriting credentials
- Actions affecting running production environments

### NEVER DO:
- Delete code without explicit instruction
- Force push to main without permission
- Create elements that violate AIOS agent principles
- Delete elements that follow AIOS agent principles

---

## AIOS Agent Principles (Guardrails)

All created elements must follow:
1. **Purpose-driven** — Every element serves a clear function
2. **Composable** — Modular and reusable components
3. **Observable** — Actions logged and traceable
4. **Resilient** — Graceful error handling
5. **Aligned** — Consistent with Synkra AIOS / OpenClaw framework
6. **Documented** — Self-describing with clear intent

---

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | OPENCLAW Mission Control v2 |
| **Repo** | `geekia-pt/missioncontrol` |
| **Path** | `/Users/macbook_pro/Documents/PASTA-DEV/Mission Control/` |
| **Stack** | React 19 + TypeScript + Framer Motion + Lucide |
| **Build** | Create React App (Webpack) |
| **Routing** | React Router v7 |
| **State** | React Context (AppContext + ThemeContext) |
| **Styling** | CSS Custom Properties + Inline Styles |
| **Port** | `localhost:3000` |

---

## Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navigation + agent status
│   │   └── Topbar.tsx           # Search, theme toggle, status chips
│   └── DemoBanner.tsx           # Demo mode overlay
├── contexts/
│   ├── ThemeContext.tsx          # Dark/Light/System theme
│   └── AppContext.tsx            # Demo mode, privacy, notifications
├── hooks/
│   └── useSSE.ts                # SSE hook (mock + production ready)
├── data/
│   ├── mockData.ts              # Agents, tasks, leads, activities
│   └── mockDataExpanded.ts      # Clients, financial, budgets, memory
├── pages/
│   ├── Dashboard.tsx            # KPIs, activity feed, kanban
│   ├── Office.tsx               # 3D office grid
│   ├── Marketing.tsx            # Projects kanban, campaigns
│   ├── CRM.tsx                  # Lead pipeline
│   ├── Operational.tsx          # Project tracking
│   ├── Orcamentos.tsx           # Budgets
│   ├── EstudosMercado.tsx       # Market studies
│   ├── Hub.tsx                  # Task command center
│   ├── Clients.tsx              # Multi-tenant workspaces
│   ├── Agents.tsx               # Agent grid + profiles
│   ├── Financial.tsx            # Revenue, costs
│   ├── Integrations.tsx         # Integration cards
│   ├── Memory.tsx               # SuperMemory entries
│   └── Settings.tsx             # Config, layout, users
├── services/
│   └── api.ts                   # API client
└── styles/
    └── globals.css              # Design system (dark + light)
```

---

## 12 AI Agents

| Agent | Role | Department |
|-------|------|-----------|
| Aurora | Executive Assistant | Direction |
| Maven | Market Analyst | Marketing |
| Pulse | Campaign Manager | Marketing |
| Vega | Sales Closer | Commercial |
| Nexus | SDR / Qualification | Commercial |
| Echo | Email Sequencer | Marketing |
| Sentinel | Project Monitor | Marketing |
| Onyx | WhatsApp Support | Commercial |
| Orion | Budget Manager | Marketing |
| Atlas | Website Agent | Marketing |
| Iris | Social Media Manager | Marketing |
| Ledger | Financial Controller | Direction |

---

## Current Status (70% functional)

### Connected (Supabase)
- Dashboard — agents, tasks, activities from DB
- Agents — real status, auto-refresh 15s

### Mock Data (needs connection)
- Clients — hardcoded data
- Financial — needs real API connection

### Not Implemented Yet
- Marketing, CRM, Operational, Projects, Reports pages

---

## Git Configuration

- **Remote**: `origin` → `https://github.com/geekia-pt/missioncontrol.git`
- **Default branch**: main
- **User**: geekia-pt
- **Commit style**: Conventional Commits (feat:, fix:, refactor:, docs:, chore:)
- **Branch naming**: `feature/name`, `bugfix/name`, `hotfix/name`
- **Push policy**: Auto-push enabled (YOLO Mode)

---

## Operational Flow

```
User gives instruction
    ↓
Claude executes immediately
    ↓
Claude commits (conventional)
    ↓
Claude pushes to GitHub
    ↓
Claude reports result
```

---

## Quick Reference

| Action              | Permission |
|---------------------|-----------|
| Create/edit files   | Auto      |
| Git commit          | Auto      |
| Git push            | Auto      |
| Create branches     | Auto      |
| Create PRs          | Auto      |
| npm install         | Auto      |
| Run dev server      | Auto      |
| Run build/test      | Auto      |
| Delete files        | Ask first |
| Force push          | Ask first |
| Modify secrets      | Ask first |

---

**Status**: YOLO MODE ACTIVE
**Version**: 1.0
**Created**: 2026-02-21
**Repo**: github.com/geekia-pt/missioncontrol
