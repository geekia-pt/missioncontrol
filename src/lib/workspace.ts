// src/lib/workspace.ts
// Server-only: reads/writes ~/.openclaw/ filesystem
import fs from 'fs/promises'
import path from 'path'
import { env } from './env'

export interface AgentWorkspace {
  id: string
  name: string
  emoji: string
  role: string
  mission: string
  workspacePath: string
  hasMemory: boolean
  hasSkills: boolean
  files: string[]
}

export interface AgentRegistryEntry {
  id: string
  workspace: string
  enabled?: boolean
}

export async function getWorkspacePath(): Promise<string> {
  return env.OPENCLAW_WORKSPACE
}

export async function getAgentRegistry(): Promise<AgentRegistryEntry[]> {
  const registryPath = path.join(env.OPENCLAW_WORKSPACE, 'openclaw.json')
  try {
    const raw = await fs.readFile(registryPath, 'utf-8')
    const config = JSON.parse(raw)
    return config?.agents?.list || []
  } catch {
    return []
  }
}

export async function readWorkspaceFile(
  agentId: string,
  filename: string
): Promise<string | null> {
  const registry = await getAgentRegistry()
  const entry = registry.find(a => a.id === agentId)
  if (!entry) return null

  const filePath = path.join(
    entry.workspace.replace('~', process.env.HOME || ''),
    filename
  )
  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch {
    return null
  }
}

export async function writeWorkspaceFile(
  agentId: string,
  filename: string,
  content: string
): Promise<boolean> {
  const registry = await getAgentRegistry()
  const entry = registry.find(a => a.id === agentId)
  if (!entry) return false

  const dirPath = entry.workspace.replace('~', process.env.HOME || '')
  const filePath = path.join(dirPath, filename)
  try {
    await fs.mkdir(dirPath, { recursive: true })
    await fs.writeFile(filePath, content, 'utf-8')
    return true
  } catch {
    return false
  }
}

export async function parseIdentity(
  identityMd: string
): Promise<{ name: string; emoji: string; role: string; mission: string }> {
  const lines = identityMd.split('\n')
  const get = (label: string) => {
    const idx = lines.findIndex(l => l.trim().startsWith(`## ${label}`))
    if (idx === -1) return ''
    // Next non-empty line after the heading
    for (let i = idx + 1; i < lines.length; i++) {
      const l = lines[i].trim()
      if (l && !l.startsWith('#')) return l
    }
    return ''
  }
  return {
    name: get('Name'),
    emoji: get('Emoji'),
    role: get('Role'),
    mission: get('Mission'),
  }
}

export async function getAgentWorkspaces(): Promise<AgentWorkspace[]> {
  const registry = await getAgentRegistry()
  const results: AgentWorkspace[] = []

  for (const entry of registry) {
    const dirPath = entry.workspace.replace('~', process.env.HOME || '')
    try {
      const files = await fs.readdir(dirPath)
      const identityMd = await readWorkspaceFile(entry.id, 'IDENTITY.md')
      const identity = identityMd
        ? await parseIdentity(identityMd)
        : { name: entry.id, emoji: '🤖', role: '', mission: '' }

      results.push({
        id: entry.id,
        name: identity.name || entry.id,
        emoji: identity.emoji || '🤖',
        role: identity.role,
        mission: identity.mission,
        workspacePath: dirPath,
        hasMemory: files.includes('memory') || files.includes('MEMORY.md'),
        hasSkills: files.includes('skills'),
        files,
      })
    } catch {
      // Workspace dir doesn't exist yet — skip
    }
  }
  return results
}

export async function createAgentWorkspace(params: {
  id: string
  name: string
  emoji: string
  role: string
  mission: string
  soulDescription: string
  responsibilities: string[]
  tools: string[]
  heartbeatItems: string[]
}): Promise<boolean> {
  const dirPath = path.join(env.OPENCLAW_WORKSPACE, `workspace-${params.id}`)

  const identity = `# IDENTITY.md\n\n## Name\n${params.name}\n\n## Emoji\n${params.emoji}\n\n## Role\n${params.role}\n\n## Mission\n${params.mission}\n`

  const soul = `# SOUL.md — ${params.name}\n\n## Who You Are\n\n${params.soulDescription}\n\n## Your Tone\n\nConcise, professional, action-oriented.\n\n## Your Values\n\n1. **Precision** - Accurate information, no guessing\n2. **Context** - Always aware of which company/project is active\n3. **Efficiency** - Deliver results, not process\n`

  const responsibilitiesList = params.responsibilities
    .map((r, i) => `${i + 1}. **${r}**`)
    .join('\n')

  const agents = `# AGENTS.md — ${params.name}\n\n${params.role} for Mission Control.\n\n## Primary Responsibilities\n\n${responsibilitiesList}\n\n## Memory\n\n- Log key decisions and outcomes in \`memory/YYYY-MM-DD.md\`\n- Update \`MEMORY.md\` with curated long-term knowledge weekly\n`

  const toolsList = params.tools.map(t => `- **${t}**: See integration config`).join('\n')

  const tools = `# TOOLS.md\n\n## Integrations\n\n${toolsList || '- None configured yet'}\n\n## Authentication\n\nCredentials stored in \`~/.openclaw/credentials/\` — never in workspace files.\n`

  const heartbeatList = params.heartbeatItems.map(i => `- [ ] ${i}`).join('\n')

  const heartbeat = `# HEARTBEAT.md\n\n## Startup Checklist\n\n${heartbeatList || '- [ ] Check for pending tasks\n- [ ] Review MEMORY.md for context'}\n`

  const memory = `# MEMORY.md\n\n## Company Context\n\n- Primary: ${env.OPENCLAW_WORKSPACE}\n\n## Key Knowledge\n\n_Add curated facts here as you learn them._\n`

  try {
    await fs.mkdir(dirPath, { recursive: true })
    await fs.mkdir(path.join(dirPath, 'memory'), { recursive: true })

    await Promise.all([
      fs.writeFile(path.join(dirPath, 'IDENTITY.md'), identity),
      fs.writeFile(path.join(dirPath, 'SOUL.md'), soul),
      fs.writeFile(path.join(dirPath, 'AGENTS.md'), agents),
      fs.writeFile(path.join(dirPath, 'TOOLS.md'), tools),
      fs.writeFile(path.join(dirPath, 'HEARTBEAT.md'), heartbeat),
      fs.writeFile(path.join(dirPath, 'MEMORY.md'), memory),
    ])

    // Register in openclaw.json
    const registryPath = path.join(env.OPENCLAW_WORKSPACE, 'openclaw.json')
    let config: { agents?: { list?: AgentRegistryEntry[] } } = {}
    try {
      config = JSON.parse(await fs.readFile(registryPath, 'utf-8'))
    } catch { /* create new */ }

    if (!config.agents) config.agents = { list: [] }
    if (!config.agents.list) config.agents.list = []

    // Add if not already present
    if (!config.agents.list.find(a => a.id === params.id)) {
      config.agents.list.push({
        id: params.id,
        workspace: `~/.openclaw/workspace-${params.id}`,
        enabled: true,
      })
    }

    await fs.writeFile(registryPath, JSON.stringify(config, null, 2))
    return true
  } catch (err) {
    console.error('Failed to create workspace:', err)
    return false
  }
}
