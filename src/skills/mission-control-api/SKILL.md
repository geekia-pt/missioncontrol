---
name: mission-control-api
version: 1.0.0
description: Post status updates and data to Mission Control dashboard
---

# Mission Control API

Update the Mission Control dashboard with agent activity.

## When to Use

- After completing a significant task
- When updating a lead, project, or financial record
- After sending a report or proposal

## Endpoints

| Action | Method | Path |
|--------|--------|------|
| Update agent workspace file | PATCH | /api/agents/:id |
| List all agents | GET | /api/agents |
| Get agent detail | GET | /api/agents/:id |
| Create new agent | POST | /api/agents/create |
| Browse memory | GET | /api/memory |
| List integrations | GET | /api/integrations |
| List jobs | GET | /api/jobs |
| Trigger job | POST | /api/jobs |

## Example

```bash
# Update agent TOOLS.md with new integration
PATCH http://localhost:3000/api/agents/comercial
Content-Type: application/json
{ "file": "TOOLS.md", "content": "# TOOLS.md\n\n## Integrations\n- **CRM API**: See credentials\n" }
```

## Base URL

- Local: `http://localhost:3000`
- VPS: `https://your-domain.com`
