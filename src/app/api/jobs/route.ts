// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getJobs, triggerJob } from '@/lib/openclaw-client'

export async function GET() {
  const jobs = await getJobs()
  return NextResponse.json({ jobs })
}

export async function POST(req: NextRequest) {
  const { jobId, action } = await req.json()
  if (!jobId || action !== 'run') {
    return NextResponse.json({ error: 'jobId and action=run required' }, { status: 400 })
  }
  const success = await triggerJob(jobId)
  return NextResponse.json({ success })
}
