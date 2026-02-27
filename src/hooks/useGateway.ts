'use client'
// src/hooks/useGateway.ts
// Client hooks for OpenClaw gateway data
import { useState, useEffect, useCallback } from 'react'

// ── Types ──

export interface GatewayVitals {
  hostname: string
  uptime: string
  cpu: { usage: number; cores: number; chip: string; loadAvg: number[] }
  memory: { percent: number; usedFormatted: string; totalFormatted: string; freeFormatted: string }
  disk: { percent: number; usedFormatted: string; totalFormatted: string; freeFormatted: string }
}

export interface GatewayCapacity {
  main: { active: number; max: number }
  subagent: { active: number; max: number }
}

export interface GatewaySession {
  key: string
  active: boolean
  recentlyActive: boolean
  minutesAgo: number
  kind?: string
  channel?: string
  model?: string
  tokens?: number
  estCost?: string
  summary?: string
}

export interface LlmUsage {
  claude?: {
    session: { usedPct: number; remainingPct: number }
    weekly: { usedPct: number; remainingPct: number }
  }
  codex?: {
    sessionsToday: number
    tasksToday: number
    usage5hPct: number
    usageDayPct: number
  }
  routing?: {
    total: number
    claudeTasks: number
    codexTasks: number
  }
}

// ── useGatewayHealth ──

export function useGatewayHealth() {
  const [gatewayUp, setGatewayUp] = useState(false)
  const [loading, setLoading] = useState(true)

  const check = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway?q=health')
      const data = await res.json()
      setGatewayUp(data.gatewayUp ?? false)
    } catch {
      setGatewayUp(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    check()
    const interval = setInterval(check, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [check])

  return { gatewayUp, loading, refresh: check }
}

// ── useVitals ──

export function useVitals() {
  const [vitals, setVitals] = useState<GatewayVitals | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway?q=vitals')
      const data = await res.json()
      if (data.vitals) setVitals(data.vitals)
    } catch { /* keep existing */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetch_()
    const interval = setInterval(fetch_, 15000) // refresh every 15s
    return () => clearInterval(interval)
  }, [fetch_])

  return { vitals, loading, refresh: fetch_ }
}

// ── useCapacity ──

export function useCapacity() {
  const [capacity, setCapacity] = useState<GatewayCapacity | null>(null)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway?q=capacity')
      const data = await res.json()
      setCapacity(data)
    } catch { /* keep existing */ }
  }, [])

  useEffect(() => {
    fetch_()
    const interval = setInterval(fetch_, 15000)
    return () => clearInterval(interval)
  }, [fetch_])

  return { capacity, refresh: fetch_ }
}

// ── useSessions ──

export function useSessions(status?: string) {
  const [sessions, setSessions] = useState<GatewaySession[]>([])
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    try {
      const qs = status ? `&status=${status}` : ''
      const res = await fetch(`/api/gateway?q=sessions${qs}`)
      const data = await res.json()
      setSessions(data.sessions || [])
      if (data.statusCounts) setStatusCounts(data.statusCounts)
    } catch { /* keep existing */ }
    finally { setLoading(false) }
  }, [status])

  useEffect(() => {
    fetch_()
    const interval = setInterval(fetch_, 10000) // refresh every 10s
    return () => clearInterval(interval)
  }, [fetch_])

  return { sessions, statusCounts, loading, refresh: fetch_ }
}

// ── useLlmUsage ──

export function useLlmUsage() {
  const [usage, setUsage] = useState<LlmUsage | null>(null)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway?q=llm-usage')
      const data = await res.json()
      if (!data.error) setUsage(data)
    } catch { /* keep existing */ }
  }, [])

  useEffect(() => {
    fetch_()
    const interval = setInterval(fetch_, 60000) // refresh every 60s
    return () => clearInterval(interval)
  }, [fetch_])

  return { usage, refresh: fetch_ }
}
