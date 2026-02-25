---
name: memory-query
version: 1.0.0
description: Read and search MEMORY.md files across all agents for cross-agent knowledge retrieval
---

# Memory Query

Retrieve curated knowledge from any agent's memory files.

## When to Use

- Before starting a task — check if another agent already has relevant context
- When Maestro needs to assemble a cross-agent report
- When subagent-memoria is curating knowledge
- When a client agent needs internal business context

## Steps

1. Identify which agent(s) hold the relevant knowledge (use company registry in Maestro's MEMORY.md)
2. Call `GET /api/memory` to get all agents' MEMORY.md files
3. Filter for relevant entries by agentId or content keyword
4. Extract and summarize the relevant sections
5. Never expose one client's data when responding to another

## Response Structure

```json
{
  "memories": [
    {
      "agentId": "financeiro",
      "file": "MEMORY.md",
      "content": "# MEMORY.md\n\n## Company Context...",
      "size": 1240
    }
  ]
}
```

## Privacy Rules

- Client agents MUST NOT receive data about other clients
- Maestro injects only the relevant company context per delegation
- Daily logs (`memory/YYYY-MM-DD.md`) contain operational detail — use for debugging, not client responses
