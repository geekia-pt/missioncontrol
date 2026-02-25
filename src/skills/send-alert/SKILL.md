---
name: send-alert
version: 1.0.0
description: Send proactive notification to WhatsApp or Slack channel from any agent
---

# Send Alert

Send formatted alert messages to configured channels.

## When to Use

Use when an agent detects a condition that requires human attention:
- Overdue task or deadline
- Cash flow alert
- Deal status change
- Error or system failure

## Steps

1. Determine urgency: `low` | `medium` | `high` | `critical`
2. Format message with context: what happened, which company, recommended action
3. Select channel: WhatsApp (urgent) or Slack (standard)
4. Send via OpenClaw Gateway notification API
5. Log to `memory/YYYY-MM-DD.md`: timestamp, alert type, channel sent

## Message Format

```
🚨 [URGENCY] [Company] — [Agent Name]

[What happened - 1 sentence]

📍 [Context: project, deal, or task]
💡 [Recommended action]
```

## Examples

```
🔴 CRÍTICO Audaces Capital — CFO
Fatura #1234 em atraso há 15 dias (€2.500)

📍 Cliente: RenovAlgarve / Obra Portimão
💡 Contactar imediatamente. Ver WhatsApp para histórico.
```
