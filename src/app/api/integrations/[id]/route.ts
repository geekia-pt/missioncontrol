// src/app/api/integrations/[id]/route.ts
// Write integration config back to TOOLS.md of relevant agents
import { NextRequest, NextResponse } from 'next/server'
import { readWorkspaceFile, writeWorkspaceFile } from '@/lib/workspace'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { agentId, toolLine } = await req.json()

  if (!agentId || !toolLine) {
    return NextResponse.json({ error: 'agentId and toolLine are required' }, { status: 400 })
  }

  const current = await readWorkspaceFile(agentId, 'TOOLS.md')
  if (!current) {
    return NextResponse.json({ error: 'Agent TOOLS.md not found' }, { status: 404 })
  }

  // Append the new tool line if not already present
  if (!current.includes(toolLine)) {
    const updated = current + `\n- ${toolLine}`
    const success = await writeWorkspaceFile(agentId, 'TOOLS.md', updated)
    return NextResponse.json({ success, integrationId: id })
  }

  return NextResponse.json({ success: true, note: 'Already present' })
}
