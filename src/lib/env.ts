// src/lib/env.ts
// Server-only environment — never imported in client components
export const env = {
  OPENCLAW_GATEWAY_URL: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3333',
  OPENCLAW_GATEWAY_TOKEN: process.env.OPENCLAW_GATEWAY_TOKEN || '',
  OPENCLAW_WORKSPACE: process.env.OPENCLAW_WORKSPACE || `${process.env.HOME}/.openclaw`,
}
