'use client'
// src/hooks/useAgents.ts
import { useState, useEffect, useCallback } from 'react'
import { useAgentStream } from './useAgentStream'

export interface AgentData {
  id: string
  name: string
  emoji: string
  role: string
  mission: string
  status: 'online' | 'busy' | 'idle' | 'error'
  activeSessions: number
  gatewayConnected: boolean
  hasMemory: boolean
  hasSkills: boolean
}

export function useAgents() {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [loading, setLoading] = useState(true)
  const { lastEvent, gatewayUp } = useAgentStream()

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents')
      const data = await res.json()
      setAgents(data.agents || [])
    } catch { /* keep existing data */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  // Refresh agent list on live events
  useEffect(() => {
    if (lastEvent?.type === 'session_update' || lastEvent?.type === 'session_end') {
      fetchAgents()
    }
  }, [lastEvent, fetchAgents])

  return { agents, loading, gatewayUp, refresh: fetchAgents }
}
