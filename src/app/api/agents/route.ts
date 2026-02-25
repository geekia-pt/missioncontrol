// src/app/api/agents/route.ts
import { NextResponse } from 'next/server'
import { getAgentWorkspaces } from '@/lib/workspace'
import { getSessions, checkGatewayHealth } from '@/lib/openclaw-client'

export async function GET() {
  const [workspaces, sessions, gatewayUp] = await Promise.all([
    getAgentWorkspaces(),
    getSessions(),
    checkGatewayHealth(),
  ])

  // Merge workspace data with live session status
  const agents = workspaces.map(ws => {
    const activeSessions = sessions.filter(s => s.id.includes(ws.id))
    const isBusy = activeSessions.some(s => s.status === 'live')
    return {
      ...ws,
      status: isBusy ? 'busy' : 'idle',
      activeSessions: activeSessions.length,
      gatewayConnected: gatewayUp,
    }
  })

  return NextResponse.json({ agents, gatewayUp })
}
