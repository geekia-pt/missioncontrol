// src/app/api/agents/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAgentWorkspace } from '@/lib/workspace'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { id, name, emoji, role, mission, soulDescription, responsibilities, tools, heartbeatItems } = body

  if (!id || !name || !role) {
    return NextResponse.json({ error: 'id, name, role are required' }, { status: 400 })
  }

  // Sanitize id: lowercase, no spaces, alphanumeric + hyphens only
  const safeId = id.toLowerCase().replace(/[^a-z0-9-]/g, '-')

  const success = await createAgentWorkspace({
    id: safeId,
    name,
    emoji: emoji || '🤖',
    role,
    mission: mission || '',
    soulDescription: soulDescription || '',
    responsibilities: responsibilities || [],
    tools: tools || [],
    heartbeatItems: heartbeatItems || [],
  })

  if (!success) {
    return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
  }

  return NextResponse.json({ success: true, agentId: safeId })
}
