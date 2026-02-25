// src/app/api/agents/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { readWorkspaceFile, writeWorkspaceFile } from '@/lib/workspace'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [identity, soul, agentsMd, tools, memory] = await Promise.all([
    readWorkspaceFile(id, 'IDENTITY.md'),
    readWorkspaceFile(id, 'SOUL.md'),
    readWorkspaceFile(id, 'AGENTS.md'),
    readWorkspaceFile(id, 'TOOLS.md'),
    readWorkspaceFile(id, 'MEMORY.md'),
  ])

  if (!identity) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  return NextResponse.json({ id, identity, soul, agents: agentsMd, tools, memory })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { file, content } = await req.json()

  const allowedFiles = ['TOOLS.md', 'SOUL.md', 'AGENTS.md', 'MEMORY.md', 'HEARTBEAT.md']
  if (!allowedFiles.includes(file)) {
    return NextResponse.json({ error: 'File not editable via API' }, { status: 400 })
  }

  const success = await writeWorkspaceFile(id, file, content)
  return NextResponse.json({ success })
}
