# Mission Control - Estado Atual (2026-02-19)

## ✅ O QUE ESTÁ IMPLEMENTADO

### Frontend
- **Dashboard** (src/pages/Dashboard.tsx) - Conectado ao Supabase via API
  - Mostra agentes reais do banco
  - Mostra tarefas reais do banco
  - Mostra atividades recentes
- **Agents** (src/pages/Agents.tsx) - Conectado ao Supabase
  - Lista todos agentes com status real
  - Auto-refresh a cada 15s
- **Clients** (src/pages/Clients.tsx) - **DADOS FICTÍCIOS**
  - Lista hardcoded (Zion Oasis, RenovAlgarve, ConstruAgil)
  - Precisa conectar ao Supabase
- **Financial** (src/pages/Financial.tsx) - **DADOS FICTÍCIOS**
  - Dashboard de custos por provider
  - Precisa conectar à API real (/api/financial)

### Backend (API)
**Localização:** `/data/.openclaw/workspace/mission-control/`

**Endpoints funcionando:**
- `GET /health` - Status da API
- `GET /api/agents` - Lista agentes do Supabase
- `GET /api/tasks` - Lista tarefas do Supabase
- `POST /api/tasks` - Cria tarefa (com Model Router)
- `GET /api/activities` - Lista atividades recentes
- `GET /api/model-stats` - Estatísticas Model Router
- `POST /api/select-model` - Recomenda modelo por tarefa
- `GET /api/financial` - Dashboard financeiro

**Model Router:**
- `model-router.js` - Sistema de otimização de custos
- 3 providers: OpenAI, OpenRouter, Claude
- Seleção automática baseada no tipo de tarefa

---

## ⚠️ O QUE FALTA IMPLEMENTAR

### Frontend
1. **Página Clients** - Conectar ao Supabase
   - Criar tabela `clients` no Supabase
   - Implementar CRUD via API
2. **Página Financial** - Conectar API real
   - Usar endpoint `/api/financial`
   - Dados reais de uso por provider
3. **Outras páginas** (não implementadas):
   - Marketing
   - CRM
   - Operational
   - Projects
   - Reports

### Backend
1. **Criar tabela clients** no Supabase
2. **Implementar endpoints clients:**
   - `GET /api/clients`
   - `POST /api/clients`
   - `PUT /api/clients/:id`
   - `DELETE /api/clients/:id`
3. **Sistema de spawn de sub-agentes**
4. **Integração com OpenClaw sessions**

---

## 🔑 CONFIGURAÇÕES

### Supabase
**URL:** `https://dtjjlxfktssvmvuqsoqr.supabase.co`
**Project ID:** `dtjjlxfktssvmvuqsoqr`

**Tabelas existentes:**
- `agents` (id, agent_id, name, role, department, status, capabilities, created_at)
- `tasks` (id, task_id, title, state, assigned_to, priority, created_at)
- `activities` (id, agent_id, type, message, severity, created_at)

**Credenciais:** Ver `/data/.openclaw/workspace/.env.supabase`

### API Keys
**Arquivo:** `/data/.openclaw/workspace/.env.models`

```bash
OPENAI_API_KEY=sk-proj-sa3ysl...
OPENROUTER_API_KEY=sk-or-v1-6a4578...
```

### Frontend
**Arquivo:** `/data/.openclaw/workspace/mission-control-frontend/.env`

```bash
REACT_APP_API_URL=https://employers-ericsson-tower-understanding.trycloudflare.com
```

---

## 🚀 COMO RODAR

### Backend
```bash
cd /data/.openclaw/workspace/mission-control
node api.js
# Roda na porta 4000
```

### Frontend
```bash
cd /data/.openclaw/workspace/mission-control-frontend
npm start  # Desenvolvimento
# OU
npm run build && npx serve -s build  # Produção
```

### Start completo (com túneis)
```bash
/data/.openclaw/workspace/mission-control/start-complete.sh
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
mission-control/
├── api.js                    # API principal (Express + Supabase)
├── model-router.js           # Sistema Model Router
├── MODEL-ROUTER-README.md    # Documentação Model Router
├── start-complete.sh         # Script inicialização completa
└── package.json

mission-control-frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx     # ✅ Conectado
│   │   ├── Agents.tsx        # ✅ Conectado
│   │   ├── Clients.tsx       # ⚠️  Dados fictícios
│   │   └── Financial.tsx     # ⚠️  Dados fictícios
│   ├── services/
│   │   └── api.ts            # Cliente API
│   └── ...
├── .env                      # Configuração API URL
├── .env.example              # Template
└── package.json
```

---

## 💡 PRÓXIMOS PASSOS (PARA CLAUDE CODE)

1. **Criar tabela `clients` no Supabase:**
   ```sql
   CREATE TABLE clients (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name TEXT NOT NULL,
     email TEXT,
     phone TEXT,
     company TEXT,
     status TEXT DEFAULT 'active',
     projects JSONB DEFAULT '[]',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **Implementar CRUD clients no backend** (api.js)

3. **Conectar Clients.tsx à API real**

4. **Conectar Financial.tsx à API real** (endpoint já existe)

5. **Implementar páginas restantes:**
   - Marketing (integração RenovAlgarve)
   - CRM (gestão leads)
   - Operational (tarefas operacionais)
   - Projects (Zion Oasis, etc)
   - Reports (relatórios)

---

**Estado:** 70% funcional (Dashboard, Agents, API, Model Router OK)  
**Falta:** 30% (Clients real, Financial real, outras páginas)
