---
name: company-context
version: 1.0.0
description: Load company-specific context from Maestro's registry before processing any request
---

# Company Context

Load the correct company/business context before processing any task.

## When to Use

Every domain agent MUST call this at the start of any task delegation from Maestro.

## Company Registry

Maintained in `~/.openclaw/workspace-maestro/MEMORY.md` under `## Company Registry`.

Format:
```
| Company | WhatsApp | Slack | Primary Agent |
|---------|----------|-------|---------------|
| Audaces Capital | +351XXX | #direção | diretor |
| RenovAlgarve | +351YYY | #renovalgarve | imobiliario |
| Client A (Eventos) | +351ZZZ | — | eventos |
```

## Steps

1. Read `channel` and `peer.id` from the incoming message context
2. Look up the company registry in Maestro's MEMORY.md
3. Set `{empresa, projeto}` context variables for this task
4. Include context in every response and every cross-agent delegation
5. Never mix context between companies in the same response

## Context Injection Format

When Maestro delegates to a domain agent:
```
[CONTEXT]
empresa: RenovAlgarve
projeto: Obra Portimão — Fase 2
canal: WhatsApp +351YYY
[/CONTEXT]

[TASK]
...
[/TASK]
```

## Privacy Guarantee

A domain agent processing context for Company A MUST NOT include data from Company B, even if it was recently accessed. Each delegation is scoped to a single company.
