// src/app/api/memory/route.ts
import { NextResponse } from 'next/server'
import { getAgentRegistry, readWorkspaceFile } from '@/lib/workspace'

export async function GET() {
  const registry = await getAgentRegistry()
  const memories: Array<{ agentId: string; file: string; content: string; size: number }> = []

  for (const entry of registry) {
    // Read MEMORY.md
    const memoryMd = await readWorkspaceFile(entry.id, 'MEMORY.md')
    if (memoryMd) {
      memories.push({
        agentId: entry.id,
        file: 'MEMORY.md',
        content: memoryMd,
        size: memoryMd.length,
      })
    }

    // Read today's daily log
    const today = new Date().toISOString().split('T')[0]
    const dailyLog = await readWorkspaceFile(entry.id, `memory/${today}.md`)
    if (dailyLog) {
      memories.push({
        agentId: entry.id,
        file: `memory/${today}.md`,
        content: dailyLog,
        size: dailyLog.length,
      })
    }
  }

  return NextResponse.json({ memories })
}
