// src/app/api/hub/route.ts
import { NextResponse } from 'next/server'
import { getGatewayState, getSessions } from '@/lib/openclaw-client'

export async function GET() {
  const [state, sessions] = await Promise.all([
    getGatewayState(),
    getSessions(),
  ])

  return NextResponse.json({
    sessions: sessions || [],
    totalTokens: state?.totalTokens || 0,
    totalCost: state?.totalCost || 0,
    vitals: state?.vitals || { cpu: 0, memory: 0, uptime: 0 },
    gatewayUp: !!state,
  })
}
