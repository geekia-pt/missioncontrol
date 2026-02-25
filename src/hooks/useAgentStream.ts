'use client'
// src/hooks/useAgentStream.ts
import { useEffect, useState } from 'react'

export interface StreamEvent {
  type: string
  gatewayUp?: boolean
  sessions?: unknown[]
  [key: string]: unknown
}

export function useAgentStream() {
  const [lastEvent, setLastEvent] = useState<StreamEvent | null>(null)
  const [gatewayUp, setGatewayUp] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const es = new EventSource('/api/stream')

    es.onopen = () => setConnected(true)

    es.onmessage = (e) => {
      try {
        const data: StreamEvent = JSON.parse(e.data)
        setLastEvent(data)
        if (typeof data.gatewayUp === 'boolean') {
          setGatewayUp(data.gatewayUp)
        }
      } catch { /* ignore malformed events */ }
    }

    es.onerror = () => {
      setConnected(false)
    }

    return () => es.close()
  }, [])

  return { lastEvent, gatewayUp, connected }
}
