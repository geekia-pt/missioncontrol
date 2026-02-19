# OPENCLAW Mission Control v2

> AI Agent Orchestration Dashboard for business operations — Marketing, Commercial, Financial, and beyond.

Built by [Audaces Capital](https://audacescapital.com) as the command center for an AI-powered workforce running on the [OpenClaw](https://openclaw.ai) platform.

## Overview

Mission Control is a full-stack dashboard that manages 12+ AI agents across multiple business departments. Think of it as an "operating system" for your AI workforce — monitoring tasks, tracking deliverables, managing client workspaces, and coordinating agent activities in real-time.

### Key Features

- **14 operational pages** — Dashboard, 3D Office, Marketing, CRM, Operational, Hub, Clients, Agents, Financial, Integrations, Memory, Budgets, Market Studies, Settings
- **12 AI Agents** — Aurora, Maven, Pulse, Vega, Nexus, Echo, Sentinel, Onyx, Orion, Atlas, Iris, Ledger
- **7-State Task Machine** — Inbox → Assigned → In Progress → Testing → Review → Done → Archived
- **Activity Audit Trail** — Every action logged with severity, category, agent attribution, and metadata
- **Deliverables Tracking** — Files, URLs, and artifacts tied to tasks with approval workflows
- **Multi-tenant Client Workspaces** — Manage multiple client businesses from one dashboard
- **Dark/Light/System Theme** — Full design system with CSS custom properties
- **Demo Mode** — Read-only mode with privacy controls for presentations
- **SSE-Ready Architecture** — Hooks prepared for real-time Server-Sent Events from OpenClaw Gateway
- **SuperMemory Integration** — Persistent context and token economy tracking

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Routing | React Router v7 |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | React Context (AppContext + ThemeContext) |
| Styling | CSS Custom Properties + Inline Styles |
| Build | Create React App (Webpack) |

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navigation with agent status
│   │   └── Topbar.tsx           # Search, theme toggle, status chips
│   └── DemoBanner.tsx           # Demo mode overlay
├── contexts/
│   ├── ThemeContext.tsx          # Dark/Light/System theme
│   └── AppContext.tsx            # Demo mode, privacy, notifications
├── hooks/
│   └── useSSE.ts                # SSE hook (mock + production ready)
├── data/
│   ├── mockData.ts              # Core data: agents, tasks, leads, activities
│   └── mockDataExpanded.ts      # Extended: clients, financial, budgets, memory
├── pages/
│   ├── Dashboard.tsx            # KPIs, activity feed, kanban, alerts
│   ├── Office.tsx               # 3D office grid with agent desks
│   ├── Marketing.tsx            # Projects kanban, campaigns, email sequences
│   ├── CRM.tsx                  # Lead pipeline, interactions, proposals
│   ├── Operational.tsx          # Project tracking with milestones
│   ├── Orcamentos.tsx           # Construction budgets with categories
│   ├── EstudosMercado.tsx       # Market studies and analysis
│   ├── Hub.tsx                  # Task input/output command center
│   ├── Clients.tsx              # Multi-tenant workspace management
│   ├── Agents.tsx               # Agent grid with detailed profiles
│   ├── Financial.tsx            # Revenue, token costs, platform costs
│   ├── Integrations.tsx         # 24 integration cards
│   ├── Memory.tsx               # SuperMemory entries and stats
│   └── Settings.tsx             # Integration config, office layout, users
└── styles/
    └── globals.css              # Full design system (dark + light themes)
```

## Agents

| Agent | Role | Department | Model |
|-------|------|-----------|-------|
| Aurora | Executive Assistant | Direction | claude-sonnet-4 |
| Maven | Market Analyst | Marketing | claude-opus-4 |
| Pulse | Campaign Manager | Marketing | claude-sonnet-4 |
| Vega | Sales Closer | Commercial | claude-sonnet-4 |
| Nexus | SDR / Qualification | Commercial | claude-haiku-4 |
| Echo | Email Sequencer | Marketing | claude-haiku-4 |
| Sentinel | Project Monitor | Marketing | claude-sonnet-4 |
| Onyx | WhatsApp Support | Commercial | claude-haiku-4 |
| Orion | Budget Manager | Marketing | — |
| Atlas | Website Agent | Marketing | — |
| Iris | Social Media Manager | Marketing | — |
| Ledger | Financial Controller | Direction | — |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app runs on `http://localhost:3000` (or next available port).

## Architecture Decisions

**Why inline styles?** — All styling uses `Record<string, React.CSSProperties>` for type-safe, component-scoped styles with no CSS-in-JS runtime overhead.

**Why SSE over WebSocket?** — Server-Sent Events are simpler for unidirectional server-to-client updates, work through proxies, and auto-reconnect. The `useSSE` hook supports both real and mock modes.

**Why 7-state tasks?** — Inspired by [crshdn/mission-control](https://github.com/crshdn/mission-control), the 7-state machine provides clear lifecycle tracking with automated testing gates and rework loops.

## Roadmap

- [ ] Connect to OpenClaw Gateway via WebSocket
- [ ] Supabase backend for persistent data
- [ ] Real SSE streaming from agent activities
- [ ] Auto-dispatch task assignment
- [ ] Playwright-based deliverable testing
- [ ] LLM routing by task complexity
- [ ] Advanced cron scheduling primitives

## License

MIT

---

Built with AI. Managed by humans. Powered by [OpenClaw](https://openclaw.ai).
