// ═══════════════════════════════════════════════
// MISSION CONTROL v2 — Expanded Data Layer
// Clientes, Financeiro, Orçamentos, Memory, Hub
// ═══════════════════════════════════════════════

import { Agent } from './mockData';

// ── Client Workspaces (Multi-tenant) ──
export interface ClientWorkspace {
  id: string;
  name: string;
  logo: string;
  type: 'construcao' | 'imobiliario' | 'negocio_local';
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'onboarding' | 'active' | 'paused';
  agentsActive: number;
  agentsTotal: number;
  monthlyBilling: number;
  onboardingStep: number;
  totalSteps: number;
  contactName: string;
  contactEmail: string;
  createdAt: string;
  openclawConnected: boolean;
}

export const clientWorkspaces: ClientWorkspace[] = [
  {
    id: 'ws-001', name: 'Construções Ribeiro', logo: '🏗️', type: 'construcao',
    plan: 'pro', status: 'active', agentsActive: 4, agentsTotal: 5,
    monthlyBilling: 497, onboardingStep: 5, totalSteps: 5,
    contactName: 'António Ribeiro', contactEmail: 'antonio@ribeiroconstrucoes.pt',
    createdAt: '2025-11-15', openclawConnected: true,
  },
  {
    id: 'ws-002', name: 'Imobiliária Costa & Filhos', logo: '🏠', type: 'imobiliario',
    plan: 'pro', status: 'active', agentsActive: 3, agentsTotal: 4,
    monthlyBilling: 397, onboardingStep: 5, totalSteps: 5,
    contactName: 'Maria Costa', contactEmail: 'maria@costaimoveis.pt',
    createdAt: '2025-12-01', openclawConnected: true,
  },
  {
    id: 'ws-003', name: 'Padaria Artesanal Doce Pão', logo: '🥖', type: 'negocio_local',
    plan: 'starter', status: 'active', agentsActive: 2, agentsTotal: 3,
    monthlyBilling: 197, onboardingStep: 5, totalSteps: 5,
    contactName: 'Carlos Ferreira', contactEmail: 'carlos@docepao.pt',
    createdAt: '2026-01-10', openclawConnected: false,
  },
  {
    id: 'ws-004', name: 'TechStart Porto', logo: '💻', type: 'negocio_local',
    plan: 'enterprise', status: 'onboarding', agentsActive: 0, agentsTotal: 6,
    monthlyBilling: 0, onboardingStep: 2, totalSteps: 5,
    contactName: 'Sofia Neves', contactEmail: 'sofia@techstart.pt',
    createdAt: '2026-02-10', openclawConnected: false,
  },
  {
    id: 'ws-005', name: 'Construtora Algarve Sol', logo: '🌅', type: 'construcao',
    plan: 'pro', status: 'paused', agentsActive: 0, agentsTotal: 4,
    monthlyBilling: 0, onboardingStep: 5, totalSteps: 5,
    contactName: 'Pedro Santos', contactEmail: 'pedro@algarvesol.pt',
    createdAt: '2025-10-20', openclawConnected: true,
  },
];

// ── Financial Data ──
export interface TokenUsage {
  agentId: string;
  date: string;
  inputTokens: number;
  outputTokens: number;
  costInput: number;
  costOutput: number;
  taskId?: string;
}

export interface FinancialSummary {
  month: string;
  totalRevenue: number;
  totalTokenCost: number;
  totalPlatformCost: number;
  profit: number;
  activeClients: number;
  totalTasks: number;
}

export const financialSummaries: FinancialSummary[] = [
  { month: '2026-02', totalRevenue: 1091, totalTokenCost: 87.40, totalPlatformCost: 145, profit: 858.60, activeClients: 3, totalTasks: 342 },
  { month: '2026-01', totalRevenue: 1288, totalTokenCost: 102.30, totalPlatformCost: 145, profit: 1040.70, activeClients: 4, totalTasks: 418 },
  { month: '2025-12', totalRevenue: 894, totalTokenCost: 68.50, totalPlatformCost: 145, profit: 680.50, activeClients: 2, totalTasks: 256 },
];

export interface PlatformCost {
  id: string;
  name: string;
  monthlyCost: number;
  category: string;
  icon: string;
}

export const platformCosts: PlatformCost[] = [
  { id: 'pc-01', name: 'OpenClaw Pro', monthlyCost: 49, category: 'Core', icon: '⚡' },
  { id: 'pc-02', name: 'Anthropic API (Claude)', monthlyCost: 35, category: 'AI', icon: '🧠' },
  { id: 'pc-03', name: 'Resend (Email)', monthlyCost: 20, category: 'Comunicação', icon: '📧' },
  { id: 'pc-04', name: 'WhatsApp Business API', monthlyCost: 15, category: 'Comunicação', icon: '💬' },
  { id: 'pc-05', name: 'Cloudflare Pro', monthlyCost: 20, category: 'Infra', icon: '☁️' },
  { id: 'pc-06', name: 'SuperMemory', monthlyCost: 6, category: 'Core', icon: '🧠' },
];

export const tokenPricing = {
  inputPerMillion: 3.00,
  outputPerMillion: 15.00,
};

export const agentTokenUsage = [
  { agentId: 'ag-001', name: 'Aurora', inputTokens: 2400000, outputTokens: 890000, tasks: 45, cost: 20.55 },
  { agentId: 'ag-002', name: 'Maven', inputTokens: 3800000, outputTokens: 1200000, tasks: 23, cost: 29.40 },
  { agentId: 'ag-003', name: 'Pulse', inputTokens: 1500000, outputTokens: 600000, tasks: 38, cost: 13.50 },
  { agentId: 'ag-004', name: 'Vega', inputTokens: 1200000, outputTokens: 450000, tasks: 52, cost: 10.35 },
  { agentId: 'ag-005', name: 'Nexus', inputTokens: 900000, outputTokens: 320000, tasks: 61, cost: 7.50 },
  { agentId: 'ag-006', name: 'Echo', inputTokens: 600000, outputTokens: 200000, tasks: 28, cost: 4.80 },
  { agentId: 'ag-007', name: 'Sentinel', inputTokens: 400000, outputTokens: 150000, tasks: 18, cost: 3.45 },
  { agentId: 'ag-008', name: 'Onyx', inputTokens: 200000, outputTokens: 80000, tasks: 12, cost: 1.80 },
];

// ── Orçamentos (Construção) ──
export interface Orcamento {
  id: string;
  projectName: string;
  clientId: string;
  clientName: string;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'recusado' | 'em_execucao';
  totalValue: number;
  createdAt: string;
  categories: OrcamentoCategory[];
}

export interface OrcamentoCategory {
  name: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
}

export const orcamentos: Orcamento[] = [
  {
    id: 'orc-001', projectName: 'Remodelação T3 Foz', clientId: 'ws-001',
    clientName: 'Construções Ribeiro', status: 'aprovado', totalValue: 45800,
    createdAt: '2026-01-20',
    categories: [
      { name: 'Demolições', items: [
        { description: 'Demolição paredes interiores', quantity: 35, unitPrice: 25, total: 875 },
        { description: 'Remoção pavimento', quantity: 80, unitPrice: 12, total: 960 },
      ], subtotal: 1835 },
      { name: 'Alvenaria', items: [
        { description: 'Parede tijolo 11', quantity: 28, unitPrice: 35, total: 980 },
        { description: 'Parede tijolo 15', quantity: 12, unitPrice: 42, total: 504 },
      ], subtotal: 1484 },
      { name: 'Acabamentos', items: [
        { description: 'Cerâmico pavimento', quantity: 80, unitPrice: 45, total: 3600 },
        { description: 'Pintura paredes', quantity: 200, unitPrice: 8, total: 1600 },
      ], subtotal: 5200 },
    ],
  },
  {
    id: 'orc-002', projectName: 'Moradia V4 Maia', clientId: 'ws-001',
    clientName: 'Construções Ribeiro', status: 'enviado', totalValue: 185000,
    createdAt: '2026-02-05', categories: [],
  },
  {
    id: 'orc-003', projectName: 'Loja Centro Comercial', clientId: 'ws-005',
    clientName: 'Construtora Algarve Sol', status: 'rascunho', totalValue: 32000,
    createdAt: '2026-02-15', categories: [],
  },
];

// ── Estudos de Mercado ──
export interface EstudoMercado {
  id: string;
  title: string;
  zone: string;
  segment: string;
  status: 'em_pesquisa' | 'rascunho' | 'completo' | 'entregue';
  agentId: string;
  createdAt: string;
  keyFindings?: string[];
  clientId?: string;
}

export const estudosMercado: EstudoMercado[] = [
  {
    id: 'em-001', title: 'Mercado Imobiliário Porto Centro', zone: 'Porto Centro',
    segment: 'Residencial T2/T3', status: 'completo', agentId: 'ag-002',
    createdAt: '2026-02-10',
    keyFindings: ['Preço médio m² subiu 8.2% YoY', 'Maior procura: T2 renovados', 'Yield médio arrendamento: 5.1%'],
    clientId: 'ws-002',
  },
  {
    id: 'em-002', title: 'Análise Concorrência Padarias Artesanais', zone: 'Braga',
    segment: 'F&B / Padaria', status: 'completo', agentId: 'ag-002',
    createdAt: '2026-01-28',
    keyFindings: ['3 concorrentes diretos num raio de 2km', 'Gap: nenhum oferece delivery própria', 'Ticket médio zona: €4.50'],
    clientId: 'ws-003',
  },
  {
    id: 'em-003', title: 'Oportunidades Construção Algarve 2026', zone: 'Algarve',
    segment: 'Construção Nova', status: 'em_pesquisa', agentId: 'ag-002',
    createdAt: '2026-02-18', keyFindings: [],
  },
];

// ── Hub: Inputs & Outputs ──
export interface HubTask {
  id: string;
  type: 'input';
  content: string;
  attachments: HubAttachment[];
  agentId: string;
  priority: 'normal' | 'urgente';
  clientId?: string;
  projectTag?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface HubDelivery {
  id: string;
  type: 'output';
  title: string;
  description: string;
  agentId: string;
  files: HubAttachment[];
  status: 'para_revisao' | 'aprovado' | 'rejeitado' | 'entregue_cliente';
  taskId: string;
  createdAt: string;
}

export interface HubAttachment {
  name: string;
  type: 'pdf' | 'image' | 'audio' | 'doc' | 'spreadsheet' | 'other';
  size: string;
  url?: string;
}

export const hubTasks: HubTask[] = [
  {
    id: 'ht-001', type: 'input', content: 'Preparar proposta comercial para a TechStart Porto com os nossos planos enterprise. Incluir case studies.',
    attachments: [{ name: 'briefing_techstart.pdf', type: 'pdf', size: '2.4 MB' }],
    agentId: 'ag-004', priority: 'urgente', clientId: 'ws-004', projectTag: 'Onboarding',
    status: 'in_progress', createdAt: '2026-02-19 08:30',
  },
  {
    id: 'ht-002', type: 'input', content: 'Criar posts para Instagram da Padaria Doce Pão. Tema: promoção de fim de semana.',
    attachments: [
      { name: 'fotos_paes.zip', type: 'other', size: '15 MB' },
      { name: 'audio_instrucoes.mp3', type: 'audio', size: '1.2 MB' },
    ],
    agentId: 'ag-003', priority: 'normal', clientId: 'ws-003',
    status: 'completed', createdAt: '2026-02-18 14:00',
  },
  {
    id: 'ht-003', type: 'input', content: 'Atualizar orçamento da Moradia V4 Maia com os novos preços de materiais.',
    attachments: [{ name: 'tabela_precos_fev2026.xlsx', type: 'spreadsheet', size: '340 KB' }],
    agentId: 'ag-007', priority: 'normal', clientId: 'ws-001', projectTag: 'Orçamentos',
    status: 'pending', createdAt: '2026-02-19 10:00',
  },
];

export const hubDeliveries: HubDelivery[] = [
  {
    id: 'hd-001', type: 'output', title: 'Proposta Comercial TechStart Porto v1',
    description: 'Proposta enterprise com 3 planos, case studies incluídos, e ROI projetado.',
    agentId: 'ag-004', status: 'para_revisao', taskId: 'ht-001',
    files: [
      { name: 'proposta_techstart_v1.pdf', type: 'pdf', size: '4.8 MB' },
      { name: 'roi_projection.xlsx', type: 'spreadsheet', size: '120 KB' },
    ],
    createdAt: '2026-02-19 11:45',
  },
  {
    id: 'hd-002', type: 'output', title: 'Posts Instagram Doce Pão — Promo Weekend',
    description: '4 posts com copy e imagens. Formato story + feed. Agendados para sáb 10h.',
    agentId: 'ag-003', status: 'aprovado', taskId: 'ht-002',
    files: [
      { name: 'post_1_feed.png', type: 'image', size: '2.1 MB' },
      { name: 'post_2_story.png', type: 'image', size: '1.8 MB' },
      { name: 'copy_posts.doc', type: 'doc', size: '45 KB' },
    ],
    createdAt: '2026-02-18 17:30',
  },
  {
    id: 'hd-003', type: 'output', title: 'Relatório Semanal — Mercado Imobiliário Porto',
    description: 'Análise semanal com variações de preço, novas listagens e tendências.',
    agentId: 'ag-002', status: 'entregue_cliente', taskId: '',
    files: [
      { name: 'report_imoveis_porto_w7.pdf', type: 'pdf', size: '3.2 MB' },
    ],
    createdAt: '2026-02-17 18:00',
  },
];

// ── SuperMemory ──
export interface MemoryEntry {
  id: string;
  agentId: string;
  category: 'client' | 'process' | 'preference' | 'knowledge';
  content: string;
  source: string;
  createdAt: string;
  accessCount: number;
}

export const memoryEntries: MemoryEntry[] = [
  { id: 'mem-001', agentId: 'ag-004', category: 'client', content: 'Ricardo Mendes prefere comunicação via WhatsApp. Horário ideal: 10h-12h.', source: 'Interação CRM', createdAt: '2026-02-15', accessCount: 12 },
  { id: 'mem-002', agentId: 'ag-002', category: 'knowledge', content: 'Preço médio m² Porto Centro: €3.200 (fev 2026). Tendência: +8.2% YoY.', source: 'Estudo de Mercado', createdAt: '2026-02-10', accessCount: 8 },
  { id: 'mem-003', agentId: 'ag-003', category: 'preference', content: 'Padaria Doce Pão usa tom informal e emojis nos posts. Cores da marca: #D4A437 e #2C1810.', source: 'Briefing cliente', createdAt: '2026-01-12', accessCount: 23 },
  { id: 'mem-004', agentId: 'ag-001', category: 'process', content: 'Reuniões de sprint: segunda 9h. Review: sexta 16h. Formato: 15min standup + action items.', source: 'Config equipa', createdAt: '2026-01-05', accessCount: 45 },
  { id: 'mem-005', agentId: 'ag-005', category: 'client', content: 'Construções Ribeiro: decisor é António, mas Ana (assistente) trata da agenda. Email para agendamentos: ana@ribeiroconstrucoes.pt', source: 'CRM Notes', createdAt: '2025-12-20', accessCount: 15 },
  { id: 'mem-006', agentId: 'ag-004', category: 'knowledge', content: 'Ticket médio vendas Audaces: €8.500 (serviços) / €25.000 (imobiliário). Ciclo médio: 14 dias / 45 dias.', source: 'Pipeline analysis', createdAt: '2026-01-30', accessCount: 19 },
];

export const memoryStats = {
  totalMemories: 847,
  tokensSaved: 12400000,
  estimatedSavings: 37.20,
  avgRetrievalTime: '45ms',
  categoryCounts: { client: 234, process: 189, preference: 156, knowledge: 268 },
};

// ── Integrations Expanded ──
export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'comunicacao' | 'crm' | 'redes_sociais' | 'site_seo' | 'produtividade' | 'financeiro';
  icon: string;
  connected: boolean;
  url?: string;
  configurable: boolean;
}

export const integrations: Integration[] = [
  // Core
  { id: 'int-01', name: 'OpenClaw Gateway', description: 'Orquestração de agentes AI', category: 'core', icon: '⚡', connected: true, url: 'gateway.openclaw.ai', configurable: true },
  { id: 'int-02', name: 'SuperMemory', description: 'Contexto persistente e economia de tokens', category: 'core', icon: '🧠', connected: true, url: 'api.supermemory.ai', configurable: true },
  { id: 'int-03', name: 'Stripe', description: 'Pagamentos, subscrições e faturação', category: 'financeiro', icon: '💳', connected: true, url: 'dashboard.stripe.com', configurable: true },
  // Comunicação
  { id: 'int-04', name: 'Resend / SendGrid', description: 'Envio de emails transacionais e marketing', category: 'comunicacao', icon: '📧', connected: true, url: 'resend.com', configurable: true },
  { id: 'int-05', name: 'WhatsApp Business API', description: 'Mensagens e atendimento via WhatsApp', category: 'comunicacao', icon: '💬', connected: false, configurable: true },
  { id: 'int-06', name: 'Twilio SMS', description: 'Envio de SMS e notificações', category: 'comunicacao', icon: '📱', connected: false, configurable: true },
  // CRM
  { id: 'int-07', name: 'GoHighLevel', description: 'CRM principal — funis, automações, landing pages', category: 'crm', icon: '🎯', connected: false, configurable: true },
  { id: 'int-08', name: 'HubSpot', description: 'CRM alternativo com marketing automation', category: 'crm', icon: '🔶', connected: false, configurable: true },
  { id: 'int-09', name: 'Calendly / Cal.com', description: 'Agendamento de reuniões e demos', category: 'crm', icon: '📅', connected: true, url: 'cal.com/audaces', configurable: true },
  // Redes Sociais
  { id: 'int-10', name: 'Instagram API', description: 'Publicação de posts e extração de métricas', category: 'redes_sociais', icon: '📸', connected: true, configurable: true },
  { id: 'int-11', name: 'Facebook / Meta API', description: 'Posts, ads e métricas de página', category: 'redes_sociais', icon: '👤', connected: true, configurable: true },
  { id: 'int-12', name: 'LinkedIn API', description: 'Publicação e networking profissional', category: 'redes_sociais', icon: '💼', connected: false, configurable: true },
  { id: 'int-13', name: 'X (Twitter) API', description: 'Posts e engagement tracking', category: 'redes_sociais', icon: '🐦', connected: false, configurable: true },
  { id: 'int-14', name: 'Google Business Profile', description: 'Reviews, SEO local e Google Maps', category: 'redes_sociais', icon: '📍', connected: true, configurable: true },
  // Site & SEO
  { id: 'int-15', name: 'Aura Build', description: 'Criação e publicação de sites', category: 'site_seo', icon: '🌐', connected: true, url: 'aura.build', configurable: true },
  { id: 'int-16', name: 'Cloudflare', description: 'Hosting, CDN, DNS e segurança', category: 'site_seo', icon: '☁️', connected: true, url: 'cloudflare.com', configurable: true },
  { id: 'int-17', name: 'Hostinger', description: 'Registo e gestão de domínios', category: 'site_seo', icon: '🌍', connected: true, configurable: true },
  { id: 'int-18', name: 'Google Search Console', description: 'SEO tracking e indexação', category: 'site_seo', icon: '🔍', connected: true, configurable: true },
  { id: 'int-19', name: 'Plausible Analytics', description: 'Analytics privacy-first', category: 'site_seo', icon: '📊', connected: true, url: 'plausible.io', configurable: true },
  // Produtividade
  { id: 'int-20', name: 'Google Drive / Docs', description: 'Documentos e armazenamento', category: 'produtividade', icon: '📁', connected: true, configurable: true },
  { id: 'int-21', name: 'Notion API', description: 'Knowledge base e documentação', category: 'produtividade', icon: '📝', connected: false, configurable: true },
  { id: 'int-22', name: 'Slack / Discord', description: 'Notificações e comunicação de equipa', category: 'produtividade', icon: '💬', connected: false, configurable: true },
  { id: 'int-23', name: 'Zapier / Make', description: 'Automações custom entre plataformas', category: 'produtividade', icon: '🔗', connected: true, configurable: true },
  // Financeiro
  { id: 'int-24', name: 'Wise / Revolut', description: 'Pagamentos multi-moeda', category: 'financeiro', icon: '💶', connected: false, configurable: true },
];

// ── New Agents for expanded areas ──
export const expandedAgents: Partial<Agent>[] = [
  {
    id: 'ag-009', name: 'Orion', role: 'Gestor de Orçamentos',
    department: 'marketing' as const, status: 'online' as const, avatar: '📐',
    skills: ['Estimativas', 'Tabelas de Preço', 'Templates de Orçamento', 'PDF Generation'],
    currentTask: 'Atualizando preços base materiais',
    desk: { x: 2, y: 2 },
    soul: 'Meticuloso com números, erra para o lado conservador. Domina custos de construção.',
  },
  {
    id: 'ag-010', name: 'Atlas', role: 'Agente de Sites (Aura Build)',
    department: 'marketing' as const, status: 'online' as const, avatar: '🌐',
    skills: ['Aura Build', 'Cloudflare DNS', 'Hostinger Domains', 'SEO', 'Google Search Console'],
    currentTask: 'Publicando site Doce Pão',
    desk: { x: 4, y: 2 },
    soul: 'Focado em performance e SEO. Cria sites limpos e rápidos.',
  },
  {
    id: 'ag-011', name: 'Iris', role: 'Social Media Manager',
    department: 'marketing' as const, status: 'busy' as const, avatar: '🎨',
    skills: ['Instagram', 'Facebook', 'LinkedIn', 'Content Calendar', 'Analytics'],
    currentTask: 'Gerando relatório métricas Instagram',
    desk: { x: 4, y: 3 },
    soul: 'Criativa, entende trends, faz copy que converte. Voz adaptável a cada marca.',
  },
  {
    id: 'ag-012', name: 'Ledger', role: 'Controller Financeiro',
    department: 'direção' as const, status: 'online' as const, avatar: '💰',
    skills: ['Stripe API', 'Invoicing', 'Token Tracking', 'Cost Analysis', 'Billing'],
    currentTask: 'Calculando custos de tokens do mês',
    desk: { x: 2, y: 3 },
    soul: 'Conservador, transparente. Cada euro é rastreado e justificado.',
  },
];

// ── Onboarding Steps ──
export const onboardingSteps = [
  { step: 1, label: 'Dados da empresa', description: 'Nome, tipo de negócio, contacto principal' },
  { step: 2, label: 'Configurar workspace', description: 'Logo, cores, personalização básica' },
  { step: 3, label: 'Ativar agentes', description: 'Selecionar e configurar agentes para o cliente' },
  { step: 4, label: 'Integrações', description: 'Conectar OpenClaw, email, CRM, redes sociais' },
  { step: 5, label: 'Go Live', description: 'Revisão final e ativação do workspace' },
];

// ── Operational Projects ──
export interface OperationalProject {
  id: string;
  name: string;
  client: string;
  clientId?: string;
  type: 'desenvolvimento' | 'consultoria' | 'aceleracao' | 'imobiliario';
  status: 'planeamento' | 'em_andamento' | 'review' | 'concluido';
  progress: number;
  agentId: string;
  milestones: { label: string; done: boolean }[];
  startDate: string;
  dueDate?: string;
}

export const operationalProjects: OperationalProject[] = [
  {
    id: 'op-001', name: 'Mission Control v2', client: 'Interno', type: 'desenvolvimento',
    status: 'em_andamento', progress: 65, agentId: 'ag-007', startDate: '2026-01-15', dueDate: '2026-03-30',
    milestones: [
      { label: 'Setup projeto + UI base', done: true },
      { label: 'Dashboard + Escritório', done: true },
      { label: 'Multi-tenant + Hub', done: false },
      { label: 'Financeiro + Integrações', done: false },
      { label: 'Testes + Deploy', done: false },
    ],
  },
  {
    id: 'op-002', name: 'Aceleração Digital Doce Pão', client: 'Padaria Doce Pão',
    clientId: 'ws-003', type: 'aceleracao', status: 'em_andamento', progress: 40,
    agentId: 'ag-003', startDate: '2026-01-10', dueDate: '2026-04-10',
    milestones: [
      { label: 'Diagnóstico digital', done: true },
      { label: 'Site + Google Business', done: true },
      { label: 'Redes sociais setup', done: false },
      { label: 'Sistema delivery', done: false },
      { label: 'Métricas e ajustes', done: false },
    ],
  },
  {
    id: 'op-003', name: 'Consultoria CRM Imobiliária Costa', client: 'Imobiliária Costa & Filhos',
    clientId: 'ws-002', type: 'consultoria', status: 'em_andamento', progress: 70,
    agentId: 'ag-004', startDate: '2025-12-01',
    milestones: [
      { label: 'Audit CRM atual', done: true },
      { label: 'Migração para GoHighLevel', done: true },
      { label: 'Automações de follow-up', done: true },
      { label: 'Training equipa', done: false },
      { label: 'Go-live + suporte 30 dias', done: false },
    ],
  },
  {
    id: 'op-004', name: 'Empreendimento Foz Riverside', client: 'Audaces Capital',
    type: 'imobiliario', status: 'em_andamento', progress: 30,
    agentId: 'ag-002', startDate: '2026-02-01', dueDate: '2026-08-01',
    milestones: [
      { label: 'Estudo de mercado zona', done: true },
      { label: 'Due diligence terreno', done: false },
      { label: 'Projeto e licenciamento', done: false },
      { label: 'Orçamentação obra', done: false },
      { label: 'Comercialização', done: false },
    ],
  },
];
