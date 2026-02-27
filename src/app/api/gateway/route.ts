// src/app/api/gateway/route.ts
// Proxies OpenClaw Gateway endpoints to the frontend
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { checkGatewayHealth } from '@/lib/openclaw-client'

function authHeaders(): Record<string, string> {
  if (!env.OPENCLAW_GATEWAY_TOKEN) return {}
  return { Authorization: `Bearer ${env.OPENCLAW_GATEWAY_TOKEN}` }
}

async function proxyGateway(endpoint: string, revalidate?: number) {
  try {
    const res = await fetch(`${env.OPENCLAW_GATEWAY_URL}${endpoint}`, {
      headers: authHeaders(),
      ...(revalidate !== undefined ? { next: { revalidate } } : { cache: 'no-store' as const }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// GET /api/gateway?q=state|vitals|sessions|llm-usage|capacity|health
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || 'state'

  switch (q) {
    case 'state': {
      const data = await proxyGateway('/api/state', 5)
      return NextResponse.json(data || { error: 'gateway_offline' })
    }
    case 'vitals': {
      const data = await proxyGateway('/api/vitals', 10)
      return NextResponse.json(data || { vitals: null })
    }
    case 'sessions': {
      const page = request.nextUrl.searchParams.get('page') || '1'
      const status = request.nextUrl.searchParams.get('status') || ''
      const qs = `?page=${page}${status ? `&status=${status}` : ''}`
      const data = await proxyGateway(`/api/sessions${qs}`)
      return NextResponse.json(data || { sessions: [], pagination: {} })
    }
    case 'llm-usage': {
      const data = await proxyGateway('/api/llm-usage', 30)
      return NextResponse.json(data || { error: 'gateway_offline' })
    }
    case 'capacity': {
      const data = await proxyGateway('/api/capacity', 10)
      return NextResponse.json(data || { main: { active: 0, max: 0 }, subagent: { active: 0, max: 0 } })
    }
    case 'cron': {
      const data = await proxyGateway('/api/cron')
      return NextResponse.json(data || { cron: [] })
    }
    case 'health': {
      const up = await checkGatewayHealth()
      return NextResponse.json({ gatewayUp: up })
    }
    default:
      return NextResponse.json({ error: 'unknown query' }, { status: 400 })
  }
}
