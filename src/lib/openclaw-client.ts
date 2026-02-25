// src/lib/openclaw-client.ts
// Server-only: called from API routes only, never from client components
import { env } from './env'

export interface OCSession {
  id: string
  status: 'live' | 'recent' | 'idle'
  model: string
  channel: string
  tokens: number
  cost: number
  startedAt: string
  summary?: string
}

export interface OCJob {
  id: string
  name: string
  schedule: string
  status: 'active' | 'paused' | 'running' | 'failed'
  lastRun?: string
  nextRun?: string
}

export interface OCState {
  sessions: OCSession[]
  jobs: OCJob[]
  vitals: {
    cpu: number
    memory: number
    uptime: number
  }
  totalTokens: number
  totalCost: number
}

function authHeaders(): Record<string, string> {
  if (!env.OPENCLAW_GATEWAY_TOKEN) return {}
  return { Authorization: `Bearer ${env.OPENCLAW_GATEWAY_TOKEN}` }
}

export async function getGatewayState(): Promise<OCState | null> {
  try {
    const res = await fetch(`${env.OPENCLAW_GATEWAY_URL}/api/state`, {
      headers: authHeaders(),
      next: { revalidate: 5 }, // 5-second cache
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getSessions(): Promise<OCSession[]> {
  try {
    const res = await fetch(`${env.OPENCLAW_GATEWAY_URL}/api/sessions`, {
      headers: authHeaders(),
      next: { revalidate: 5 },
    })
    if (!res.ok) return []
    const data = await res.json()
    // Gateway returns { sessions: [...], pagination: ... }
    return Array.isArray(data) ? data : (data.sessions ?? [])
  } catch {
    return []
  }
}

export async function getJobs(): Promise<OCJob[]> {
  try {
    const res = await fetch(`${env.OPENCLAW_GATEWAY_URL}/api/jobs`, {
      headers: authHeaders(),
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    // Gateway may return array or { jobs: [...] }
    return Array.isArray(data) ? data : (data.jobs ?? [])
  } catch {
    return []
  }
}

export async function triggerJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${env.OPENCLAW_GATEWAY_URL}/api/jobs/${jobId}/run`, {
      method: 'POST',
      headers: authHeaders(),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function checkGatewayHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${env.OPENCLAW_GATEWAY_URL}/api/health`, {
      headers: authHeaders(),
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}
