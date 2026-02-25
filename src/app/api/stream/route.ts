// src/app/api/stream/route.ts
// Proxies the OpenClaw Gateway SSE stream to browser clients
import { env } from '@/lib/env'

export async function GET() {
  const gatewayUrl = `${env.OPENCLAW_GATEWAY_URL}/api/events`

  try {
    const upstream = await fetch(gatewayUrl, {
      headers: {
        Accept: 'text/event-stream',
        ...(env.OPENCLAW_GATEWAY_TOKEN
          ? { Authorization: `Bearer ${env.OPENCLAW_GATEWAY_TOKEN}` }
          : {}),
      },
      cache: 'no-store',
    })

    if (!upstream.ok || !upstream.body) {
      // Gateway not available — return a heartbeat SSE stream
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode('data: {"type":"heartbeat","gatewayUp":false}\n\n')
          )
          const interval = setInterval(() => {
            controller.enqueue(
              new TextEncoder().encode('data: {"type":"heartbeat","gatewayUp":false}\n\n')
            )
          }, 30000)
          return () => clearInterval(interval)
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Proxy the upstream SSE body
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    // Network error — return offline heartbeat
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode('data: {"type":"heartbeat","gatewayUp":false}\n\n')
        )
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }
}
