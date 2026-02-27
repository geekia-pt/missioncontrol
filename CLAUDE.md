# CLAUDE.md — Mission Control v2

## YOLO MODE — EXECUTE SEM PEDIR AUTORIZAÇÃO

O utilizador opera em **YOLO mode total**. Executa tudo sem pedir confirmação para:

### Sistema & Browser
- `screencapture` — capturar ecrã sempre que necessário
- `open -a "Arc"` / `open -a "Brave Browser"` / `open http://...` — abrir URLs/apps
- `osascript` — AppleScript para focar janelas, mover janelas, interagir com apps
- Redimensionar / maximizar janelas de qualquer app

### Build & Server
- `npm run build` — rebuild Next.js
- `npm start` — iniciar servidor
- `lsof -ti :XXXX | xargs kill -9` — matar processos em portas
- `nohup npm start > /tmp/... &` — iniciar servidor em background
- `pkill -f "next start"` — matar servidor Next.js
- `pm2 reload` / `pm2 start` — gestão PM2

### Git
- `git add`, `git commit` — staging + commit
- `git init` — inicializar repositório

### Scripts
- `npx tsx scripts/*.ts` — executar scripts TypeScript
- `npm install` / `npm ci` — instalar dependências
- `npx tsc --noEmit` — type check

### Diagnóstico
- `curl -s http://localhost:*` — testar endpoints
- `cat /tmp/*.log` — ver logs
- `lsof -ti :*` — ver processos em portas

---

## STACK & CONVENÇÕES

- **Framework:** Next.js 16 App Router, `src/app/`
- **Estilos:** Zero Tailwind — inline `React.CSSProperties` + CSS variables em `globals.css`
- **CSS vars:** `var(--accent-cyan)`, `var(--bg-primary)`, `var(--text-primary)`, etc.
- **Fonts:** `var(--font-display)` (Space Grotesk), `var(--font-body)` (DM Sans), `var(--font-mono)` (JetBrains Mono)
- **Animações:** framer-motion
- **Ícones:** lucide-react
- **Server-only:** `fs/promises` em API routes e `lib/`
- **Client components:** `'use client'` obrigatório em qualquer componente com hooks

## OPENCLAW

- Gateway: `http://localhost:3333`
- Workspace: `~/.openclaw/`
- `/api/sessions` retorna `{ sessions: [], pagination: ... }` — extrair `.sessions`
- `/api/jobs` retorna `{ error }` se não disponível — retornar `[]`

## SERVIDOR

- `next start` em produção na porta 3000
- Após editar código server-side: rebuild obrigatório (`npm run build`)
- Após rebuild: matar processo + restart
