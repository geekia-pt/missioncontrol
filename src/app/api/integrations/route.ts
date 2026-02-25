// src/app/api/integrations/route.ts
import { NextResponse } from 'next/server'
import { getAgentRegistry, readWorkspaceFile } from '@/lib/workspace'
import { checkGatewayHealth } from '@/lib/openclaw-client'

// Known integrations to detect in TOOLS.md
const KNOWN_INTEGRATIONS = [
  { id: 'whatsapp', name: 'WhatsApp Business', icon: '💬', keyword: 'WhatsApp' },
  { id: 'slack', name: 'Slack', icon: '🔌', keyword: 'Slack API' },
  { id: 'google-workspace', name: 'Google Workspace', icon: '📧', keyword: 'Google' },
  { id: 'linear', name: 'Linear', icon: '📋', keyword: 'Linear' },
  { id: 'stripe', name: 'Stripe', icon: '💳', keyword: 'Stripe' },
  { id: 'openclaw-gateway', name: 'OpenClaw Gateway', icon: '🦞', keyword: 'Mission Control API' },
]

export async function GET() {
  const [registry, gatewayUp] = await Promise.all([
    getAgentRegistry(),
    checkGatewayHealth(),
  ])

  // Collect all tools from all TOOLS.md files
  const allTools: Set<string> = new Set()
  for (const entry of registry) {
    const toolsMd = await readWorkspaceFile(entry.id, 'TOOLS.md')
    if (toolsMd) {
      toolsMd.split('\n').forEach(line => {
        const match = line.match(/\*\*([^*]+)\*\*/)
        if (match) allTools.add(match[1])
      })
    }
  }

  const integrations = KNOWN_INTEGRATIONS.map(integ => ({
    ...integ,
    detected: Array.from(allTools).some(t => t.includes(integ.keyword)),
    connected: integ.id === 'openclaw-gateway' ? gatewayUp : false,
  }))

  return NextResponse.json({ integrations, toolsDetected: Array.from(allTools) })
}
