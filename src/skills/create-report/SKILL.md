---
name: create-report
version: 1.0.0
description: Generate formatted reports — executive summary, detailed operational, or Slack-ready
---

# Create Report

Generate structured reports for different audiences and channels.

## When to Use

- Weekly/monthly performance summaries
- Project status updates
- Financial period reports
- Post-event debrief reports
- Cross-department dashboards

## Report Types

### Executive Summary
- Max 5 bullet points
- Each bullet: metric + trend + implication
- Format: plain text, no tables
- Audience: owner, investor

### Detailed Operational
- Full context with sections per domain
- Tables for metrics, timelines for projects
- Format: Markdown with headers
- Audience: management team

### Slack Update
- Max 3 lines
- Bold key numbers
- Include emoji status indicator
- Audience: team channel

## Steps

1. Identify report type and audience
2. Call relevant API routes to gather data (agents, memory, jobs)
3. Structure content according to format template above
4. Send via appropriate channel (Slack API or WhatsApp) or return as Markdown
5. Log report generation in `memory/YYYY-MM-DD.md`

## Example Slack Update

```
📊 *Semana 8 — Audaces Capital*
💰 Faturação: €12.400 (+18% vs semana anterior)
🔴 2 faturas em atraso · 🟢 3 obras no prazo · 📣 1 campanha ativa
```
