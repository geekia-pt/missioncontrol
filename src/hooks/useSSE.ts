// ═══════════════════════════════════════════════
// MISSION CONTROL — SSE Ready Architecture
// Server-Sent Events hook for real-time updates
// Currently in mock mode — ready for OpenClaw Gateway
// ═══════════════════════════════════════════════

import { useEffect, useRef, useCallback, useState } from 'react';

// ── SSE Event Types (matching crshdn/mission-control pattern) ──
export type SSEEventType =
  | 'task_created' | 'task_updated' | 'task_deleted'
  | 'activity_logged' | 'deliverable_added'
  | 'agent_spawned' | 'agent_completed' | 'agent_status_changed'
  | 'notification' | 'heartbeat';

export interface SSEEvent {
  type: SSEEventType;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface SSEConfig {
  url: string;              // SSE endpoint URL
  reconnectDelay?: number;  // ms between reconnection attempts (default: 5000)
  maxRetries?: number;      // max reconnection attempts (default: 10)
  onEvent?: (event: SSEEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export interface SSEState {
  isConnected: boolean;
  retryCount: number;
  lastEventTime: string | null;
  eventsReceived: number;
}

// ── Hook ──
export function useSSE(config: SSEConfig | null): SSEState {
  const [state, setState] = useState<SSEState>({
    isConnected: false,
    retryCount: 0,
    lastEventTime: null,
    eventsReceived: 0,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const reconnectDelay = config?.reconnectDelay ?? 5000;
  const maxRetries = config?.maxRetries ?? 10;

  const connect = useCallback(() => {
    if (!config?.url) return;

    try {
      const es = new EventSource(config.url);

      es.onopen = () => {
        retryCountRef.current = 0;
        setState(prev => ({ ...prev, isConnected: true, retryCount: 0 }));
        config.onConnect?.();
      };

      es.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);

          // Skip heartbeats from stats
          if (data.type !== 'heartbeat') {
            setState(prev => ({
              ...prev,
              lastEventTime: data.timestamp,
              eventsReceived: prev.eventsReceived + 1,
            }));
          }

          config.onEvent?.(data);
        } catch (e) {
          console.warn('[SSE] Failed to parse event:', e);
        }
      };

      es.onerror = (error) => {
        es.close();
        setState(prev => ({ ...prev, isConnected: false }));
        config.onDisconnect?.();
        config.onError?.(error);

        // Auto-reconnect
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current += 1;
          setState(prev => ({ ...prev, retryCount: retryCountRef.current }));

          retryTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      };

      eventSourceRef.current = es;
    } catch (e) {
      console.error('[SSE] Connection error:', e);
    }
  }, [config, reconnectDelay, maxRetries]);

  // ── Lifecycle ──
  useEffect(() => {
    if (config?.url) {
      connect();
    }

    return () => {
      eventSourceRef.current?.close();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [config?.url, connect]);

  return state;
}

// ── Mock SSE for development ──
// Simulates SSE events without a real server
export function useMockSSE(
  onEvent?: (event: SSEEvent) => void,
  intervalMs: number = 8000,
): SSEState {
  const [state, setState] = useState<SSEState>({
    isConnected: true,
    retryCount: 0,
    lastEventTime: null,
    eventsReceived: 0,
  });

  useEffect(() => {
    const mockEvents: SSEEvent[] = [
      { type: 'agent_status_changed', payload: { agentId: 'ag-003', status: 'busy' }, timestamp: new Date().toISOString() },
      { type: 'task_updated', payload: { taskId: 't-001', status: 'testing' }, timestamp: new Date().toISOString() },
      { type: 'activity_logged', payload: { type: 'email_sent', agentId: 'ag-006' }, timestamp: new Date().toISOString() },
      { type: 'notification', payload: { message: 'New lead from website' }, timestamp: new Date().toISOString() },
      { type: 'deliverable_added', payload: { taskId: 't-004', type: 'file' }, timestamp: new Date().toISOString() },
    ];

    let index = 0;
    const interval = setInterval(() => {
      const event = { ...mockEvents[index % mockEvents.length], timestamp: new Date().toISOString() };
      setState(prev => ({
        ...prev,
        lastEventTime: event.timestamp,
        eventsReceived: prev.eventsReceived + 1,
      }));
      onEvent?.(event);
      index++;
    }, intervalMs);

    return () => clearInterval(interval);
  }, [onEvent, intervalMs]);

  return state;
}
