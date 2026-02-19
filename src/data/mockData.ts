// ═══════════════════════════════════════════════
// OPENCLAW MISSION CONTROL — Mock Data Layer
// v2.1 — Enriched with Audit Trail, 7-state Tasks,
//         Deliverables, Expanded Agent Config
// ═══════════════════════════════════════════════

// ── Agent (expanded) ──
export interface Agent {
  id: string;
  name: string;
  role: string;
  department: 'marketing' | 'comercial' | 'direção';
  status: 'online' | 'busy' | 'idle' | 'error';
  avatar: string;
  skills: string[];
  currentTask?: string;
  desk: { x: number; y: number };
  soul?: string;
  cronJobs?: string[];
  // ── v2.1 Expanded fields ──
  model?: string;                     // AI model used (claude-sonnet-4, gpt-4o, local-llama)
  source?: 'local' | 'gateway';      // Created locally or imported from OpenClaw
  gatewayAgentId?: string;            // Link to OpenClaw agent ID
  agentsMd?: string;                  // Knowledge about other agents
  totalTasksCompleted?: number;
  avgResponseTime?: string;           // e.g. '2.3s'
  lastActive?: string;                // ISO timestamp
}

// ── Task (7-state machine) ──
export type TaskStatus = 'inbox' | 'assigned' | 'in_progress' | 'testing' | 'review' | 'done' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  previousStatus?: TaskStatus;        // For audit trail / rework loops
  department: 'marketing' | 'comercial';
  agentId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  // ── Deliverables ──
  deliverables?: Deliverable[];
}

// ── Deliverable (output tracking) ──
export interface Deliverable {
  id: string;
  taskId: string;
  type: 'file' | 'url' | 'artifact';
  name: string;
  description?: string;
  fileType?: string;     // pdf, png, xlsx, etc
  size?: string;
  url?: string;
  status: 'pending' | 'delivered' | 'approved' | 'rejected';
  agentId: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  origin: string;
  stage: 'novo' | 'contato' | 'proposta' | 'fechado';
  value: number;
  agentId: string;
  pipeline: string;
  interactions: Interaction[];
}

export interface Interaction {
  id: string;
  type: 'email' | 'whatsapp' | 'call' | 'note';
  content: string;
  date: string;
  agentId: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'email' | 'social' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  leadsGenerated: number;
  openRate: number;
  department: 'marketing' | 'comercial';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'planeamento' | 'em_andamento' | 'concluido';
  agentId: string;
  nextAction: string;
}

// ── Activity (enriched audit trail) ──
export type ActivityType =
  | 'email_sent' | 'lead_contacted' | 'proposal_created'
  | 'task_completed' | 'campaign_started' | 'agent_error'
  // ── v2.1 new types ──
  | 'task_created' | 'task_assigned' | 'task_status_changed'
  | 'deliverable_added' | 'deliverable_approved' | 'deliverable_rejected'
  | 'agent_spawned' | 'agent_completed' | 'agent_config_changed'
  | 'system_alert' | 'cron_executed' | 'memory_created';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  agentId: string;
  timestamp: string;
  // ── v2.1 enriched fields ──
  taskId?: string;            // Link to task
  deliverableId?: string;     // Link to deliverable
  metadata?: Record<string, string | number | boolean>;  // Extra context
  category?: 'task' | 'agent' | 'system' | 'crm' | 'marketing';
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export interface Schedule {
  id: string;
  date: string;
  time: string;
  agentId: string;
  type: string;
  department: 'marketing' | 'comercial';
}

// ── Agents (expanded config) ──
export const agents: Agent[] = [
  {
    id: 'ag-001',
    name: 'Aurora',
    role: 'Secretária Executiva',
    department: 'direção',
    status: 'online',
    avatar: '🌅',
    skills: ['Email Management', 'Calendar', 'Meeting Notes', 'Reports'],
    currentTask: 'Processando emails matinais',
    desk: { x: 2, y: 1 },
    soul: 'Organizada, proativa, comunica com clareza. Foco em manter o CEO informado e a agenda em dia.',
    cronJobs: ['Relatório diário 08:00', 'Digest semanal seg 09:00'],
    model: 'claude-sonnet-4',
    source: 'gateway',
    agentsMd: 'Coordena com Maven para reports, delega a Sentinel verificações de projeto.',
    totalTasksCompleted: 234,
    avgResponseTime: '1.8s',
    lastActive: '2026-02-19T10:30:00Z',
  },
  {
    id: 'ag-002',
    name: 'Maven',
    role: 'Analista de Mercado',
    department: 'marketing',
    status: 'busy',
    avatar: '📊',
    skills: ['Market Research', 'Competitor Analysis', 'Trend Reports'],
    currentTask: 'Análise de concorrência Q1 2026',
    desk: { x: 1, y: 2 },
    soul: 'Curioso, analítico, sempre à procura de padrões e oportunidades de mercado.',
    cronJobs: ['Report semanal qui 17:00'],
    model: 'claude-opus-4',
    source: 'gateway',
    agentsMd: 'Fornece dados a Pulse para campanhas e a Orion para orçamentos baseados em mercado.',
    totalTasksCompleted: 89,
    avgResponseTime: '12.4s',
    lastActive: '2026-02-19T09:45:00Z',
  },
  {
    id: 'ag-003',
    name: 'Pulse',
    role: 'Gestor de Campanhas',
    department: 'marketing',
    status: 'online',
    avatar: '🚀',
    skills: ['Campaign Management', 'A/B Testing', 'Analytics', 'Social Media'],
    currentTask: 'Monitorando campanha "Spring Launch"',
    desk: { x: 1, y: 3 },
    soul: 'Criativo, orientado a dados, sabe equilibrar criatividade com performance.',
    cronJobs: ['KPI report diário 18:00'],
    model: 'claude-sonnet-4',
    source: 'gateway',
    agentsMd: 'Trabalha com Echo em email sequences e Iris em social media.',
    totalTasksCompleted: 156,
    avgResponseTime: '3.1s',
    lastActive: '2026-02-19T10:15:00Z',
  },
  {
    id: 'ag-004',
    name: 'Vega',
    role: 'Closer Comercial',
    department: 'comercial',
    status: 'online',
    avatar: '💎',
    skills: ['CRM', 'Negotiation', 'Proposal Generation', 'WhatsApp'],
    currentTask: 'Follow-up com 3 leads quentes',
    desk: { x: 3, y: 2 },
    soul: 'Persuasivo mas honesto, focado em criar valor real para o cliente.',
    cronJobs: ['Follow-up automático 10:00', 'Pipeline review sex 16:00'],
    model: 'claude-sonnet-4',
    source: 'gateway',
    agentsMd: 'Recebe leads qualificados de Nexus, usa proposals geradas por si. Coordena com Onyx para WhatsApp.',
    totalTasksCompleted: 312,
    avgResponseTime: '2.5s',
    lastActive: '2026-02-19T10:20:00Z',
  },
  {
    id: 'ag-005',
    name: 'Nexus',
    role: 'SDR / Qualificação',
    department: 'comercial',
    status: 'busy',
    avatar: '🔗',
    skills: ['Lead Qualification', 'Email Outreach', 'CRM', 'Research'],
    currentTask: 'Qualificando 12 novos leads',
    desk: { x: 3, y: 3 },
    soul: 'Persistente, metódico, excelente em identificar fit e urgência.',
    cronJobs: ['New leads scan 09:00', 'Follow-up 14:00'],
    model: 'claude-haiku-4',
    source: 'gateway',
    agentsMd: 'Pipeline: Nexus qualifica → Vega fecha. Usa Maven para enriquecer leads com dados de mercado.',
    totalTasksCompleted: 478,
    avgResponseTime: '1.2s',
    lastActive: '2026-02-19T09:30:00Z',
  },
  {
    id: 'ag-006',
    name: 'Echo',
    role: 'Email Sequencer',
    department: 'marketing',
    status: 'idle',
    avatar: '📨',
    skills: ['Email Sequences', 'Copywriting', 'A/B Testing', 'Deliverability'],
    desk: { x: 1, y: 4 },
    soul: 'Preciso, testa incansavelmente, foco em open rates e conversão.',
    cronJobs: ['Sequence check 08:00', 'Bounce report 20:00'],
    model: 'claude-haiku-4',
    source: 'local',
    totalTasksCompleted: 89,
    avgResponseTime: '0.8s',
    lastActive: '2026-02-18T20:00:00Z',
  },
  {
    id: 'ag-007',
    name: 'Sentinel',
    role: 'Monitor de Projetos',
    department: 'marketing',
    status: 'online',
    avatar: '🛡️',
    skills: ['Project Tracking', 'Risk Assessment', 'Deadline Management'],
    currentTask: 'Verificando milestones de 4 projetos',
    desk: { x: 2, y: 4 },
    soul: 'Vigilante, avisa cedo sobre riscos, nunca deixa um deadline escapar.',
    cronJobs: ['Status check 3x/dia'],
    model: 'claude-sonnet-4',
    source: 'gateway',
    agentsMd: 'Monitora todos os projetos, escala bloqueios para Aurora que comunica ao CEO.',
    totalTasksCompleted: 67,
    avgResponseTime: '4.2s',
    lastActive: '2026-02-19T10:00:00Z',
  },
  {
    id: 'ag-008',
    name: 'Onyx',
    role: 'Atendimento WhatsApp',
    department: 'comercial',
    status: 'error',
    avatar: '⚡',
    skills: ['WhatsApp Business API', 'Quick Replies', 'Customer Service'],
    desk: { x: 3, y: 4 },
    soul: 'Rápido, empático, resolve questões em poucas mensagens.',
    cronJobs: ['Queue check a cada 5min'],
    model: 'claude-haiku-4',
    source: 'gateway',
    agentsMd: 'Primeiro ponto de contacto WhatsApp, escala para Vega ou Nexus conforme qualificação.',
    totalTasksCompleted: 523,
    avgResponseTime: '0.5s',
    lastActive: '2026-02-19T06:12:00Z',
  },
];

// ── Tasks (7-state machine) ──
export const tasks: Task[] = [
  { id: 't-001', title: 'Criar landing page Spring Campaign', description: 'Landing page responsiva com form de captura e tracking pixels', status: 'in_progress', department: 'marketing', agentId: 'ag-003', priority: 'high', createdAt: '2026-02-17', updatedAt: '2026-02-19',
    deliverables: [
      { id: 'del-001', taskId: 't-001', type: 'url', name: 'Landing Page Preview', url: 'https://preview.audaces.pt/spring', status: 'pending', agentId: 'ag-003', createdAt: '2026-02-19 09:00' },
    ],
  },
  { id: 't-002', title: 'Relatório de mercado imobiliário PT', status: 'review', department: 'marketing', agentId: 'ag-002', priority: 'medium', createdAt: '2026-02-15', updatedAt: '2026-02-19',
    deliverables: [
      { id: 'del-002', taskId: 't-002', type: 'file', name: 'Relatório Q1 2026', fileType: 'pdf', size: '4.2 MB', status: 'delivered', agentId: 'ag-002', createdAt: '2026-02-19 08:30' },
      { id: 'del-003', taskId: 't-002', type: 'file', name: 'Dados Raw', fileType: 'xlsx', size: '1.1 MB', status: 'delivered', agentId: 'ag-002', createdAt: '2026-02-19 08:30' },
    ],
  },
  { id: 't-003', title: 'Follow-up leads semana passada', status: 'inbox', department: 'comercial', agentId: 'ag-004', priority: 'urgent', createdAt: '2026-02-19' },
  { id: 't-004', title: 'Preparar proposta cliente TechVista', status: 'in_progress', department: 'comercial', agentId: 'ag-004', priority: 'high', createdAt: '2026-02-18', updatedAt: '2026-02-19',
    deliverables: [
      { id: 'del-004', taskId: 't-004', type: 'file', name: 'Proposta TechVista v2', fileType: 'pdf', size: '3.8 MB', status: 'pending', agentId: 'ag-004', createdAt: '2026-02-19 09:30' },
    ],
  },
  { id: 't-005', title: 'Setup email sequence onboarding', status: 'assigned', department: 'marketing', agentId: 'ag-006', priority: 'medium', createdAt: '2026-02-18' },
  { id: 't-006', title: 'Qualificar leads do webinar', status: 'in_progress', department: 'comercial', agentId: 'ag-005', priority: 'high', createdAt: '2026-02-17', updatedAt: '2026-02-19' },
  { id: 't-007', title: 'Revisão copy newsletters', status: 'done', department: 'marketing', agentId: 'ag-003', priority: 'low', createdAt: '2026-02-14', updatedAt: '2026-02-18',
    deliverables: [
      { id: 'del-005', taskId: 't-007', type: 'file', name: 'Newsletter Copy Final', fileType: 'doc', size: '120 KB', status: 'approved', agentId: 'ag-003', createdAt: '2026-02-18 14:00' },
    ],
  },
  { id: 't-008', title: 'Benchmark pricing concorrência', status: 'assigned', department: 'marketing', agentId: 'ag-002', priority: 'medium', createdAt: '2026-02-19' },
  { id: 't-009', title: 'Atualizar pipeline CRM', status: 'done', department: 'comercial', agentId: 'ag-005', priority: 'medium', createdAt: '2026-02-15', updatedAt: '2026-02-18' },
  { id: 't-010', title: 'Enviar proposta GreenTech', status: 'inbox', department: 'comercial', agentId: 'ag-004', priority: 'urgent', createdAt: '2026-02-19' },
  { id: 't-011', title: 'Agendar reuniões da semana', status: 'archived', previousStatus: 'done', department: 'marketing', agentId: 'ag-001', priority: 'medium', createdAt: '2026-02-12', updatedAt: '2026-02-17' },
  { id: 't-012', title: 'Verificar deliverability emails', status: 'testing', department: 'marketing', agentId: 'ag-006', priority: 'low', createdAt: '2026-02-18', updatedAt: '2026-02-19',
    deliverables: [
      { id: 'del-006', taskId: 't-012', type: 'artifact', name: 'Deliverability Report', description: 'Bounce rate analysis + domain reputation check', status: 'pending', agentId: 'ag-006', createdAt: '2026-02-19 07:00' },
    ],
  },
];

// ── Leads ──
export const leads: Lead[] = [
  {
    id: 'l-001', name: 'Ricardo Mendes', email: 'ricardo@techvista.pt', whatsapp: '+351912345678',
    origin: 'Website', stage: 'proposta', value: 15000, agentId: 'ag-004', pipeline: 'Serviços',
    interactions: [
      { id: 'i-1', type: 'email', content: 'Enviada proposta comercial v2', date: '2026-02-19 09:30', agentId: 'ag-004' },
      { id: 'i-2', type: 'whatsapp', content: 'Confirmou interesse, pede reunião', date: '2026-02-18 16:00', agentId: 'ag-004' },
      { id: 'i-3', type: 'call', content: 'Chamada de qualificação - 15min', date: '2026-02-17 11:00', agentId: 'ag-005' },
    ],
  },
  {
    id: 'l-002', name: 'Ana Ferreira', email: 'ana@greentech.com', whatsapp: '+351923456789',
    origin: 'LinkedIn', stage: 'contato', value: 8500, agentId: 'ag-005', pipeline: 'Serviços',
    interactions: [
      { id: 'i-4', type: 'email', content: 'Email de introdução enviado', date: '2026-02-18 14:00', agentId: 'ag-005' },
    ],
  },
  {
    id: 'l-003', name: 'João Costa', email: 'jcosta@imobiliaria.pt', whatsapp: '+351934567890',
    origin: 'Referral', stage: 'novo', value: 25000, agentId: 'ag-005', pipeline: 'Imóveis',
    interactions: [],
  },
  {
    id: 'l-004', name: 'Marta Silva', email: 'marta@startup.io', whatsapp: '+351945678901',
    origin: 'Webinar', stage: 'contato', value: 12000, agentId: 'ag-004', pipeline: 'Serviços',
    interactions: [
      { id: 'i-5', type: 'whatsapp', content: 'Respondeu ao follow-up, quer demo', date: '2026-02-19 10:15', agentId: 'ag-004' },
      { id: 'i-6', type: 'email', content: 'Sequência automática - step 2', date: '2026-02-17 09:00', agentId: 'ag-006' },
    ],
  },
  {
    id: 'l-005', name: 'Pedro Almeida', email: 'pedro@construtora.pt', whatsapp: '+351956789012',
    origin: 'Website', stage: 'fechado', value: 32000, agentId: 'ag-004', pipeline: 'Imóveis',
    interactions: [
      { id: 'i-7', type: 'email', content: 'Contrato assinado!', date: '2026-02-16 15:00', agentId: 'ag-004' },
    ],
  },
  {
    id: 'l-006', name: 'Sofia Rodrigues', email: 'sofia@design.pt', whatsapp: '+351967890123',
    origin: 'Social Media', stage: 'novo', value: 5000, agentId: 'ag-005', pipeline: 'Serviços',
    interactions: [],
  },
];

// ── Campaigns ──
export const campaigns: Campaign[] = [
  { id: 'c-001', name: 'Spring Launch 2026', channel: 'email', status: 'running', leadsGenerated: 47, openRate: 34.2, department: 'marketing' },
  { id: 'c-002', name: 'LinkedIn Awareness', channel: 'social', status: 'running', leadsGenerated: 23, openRate: 0, department: 'marketing' },
  { id: 'c-003', name: 'Re-engagement Q1', channel: 'email', status: 'scheduled', leadsGenerated: 0, openRate: 0, department: 'comercial' },
  { id: 'c-004', name: 'WhatsApp Promos', channel: 'whatsapp', status: 'draft', leadsGenerated: 0, openRate: 0, department: 'comercial' },
  { id: 'c-005', name: 'Webinar Follow-up', channel: 'email', status: 'completed', leadsGenerated: 89, openRate: 41.7, department: 'marketing' },
];

// ── Projects ──
export const projects: Project[] = [
  { id: 'p-001', name: 'Website Redesign Audaces', client: 'Interno', status: 'em_andamento', agentId: 'ag-007', nextAction: 'Review mockups com equipa' },
  { id: 'p-002', name: 'Estudo Mercado Imobiliário', client: 'Portfólio', status: 'em_andamento', agentId: 'ag-002', nextAction: 'Completar análise zona norte' },
  { id: 'p-003', name: 'Content Strategy Q2', client: 'Interno', status: 'planeamento', agentId: 'ag-003', nextAction: 'Definir calendário editorial' },
  { id: 'p-004', name: 'CRM Migration', client: 'Interno', status: 'em_andamento', agentId: 'ag-001', nextAction: 'Migrar dados legacy' },
  { id: 'p-005', name: 'Brand Guidelines v2', client: 'Audaces Capital', status: 'concluido', agentId: 'ag-003', nextAction: 'Entregue' },
];

// ── Activities (enriched audit trail) ──
export const activities: Activity[] = [
  // ── Task lifecycle events ──
  { id: 'a-001', type: 'task_status_changed', description: 'Task "Relatório imobiliário" movida para Review', agentId: 'ag-002', timestamp: '2026-02-19 10:30', taskId: 't-002', category: 'task', severity: 'info', metadata: { from: 'in_progress', to: 'review' } },
  { id: 'a-002', type: 'deliverable_added', description: 'Relatório Q1 2026 (PDF) entregue para revisão', agentId: 'ag-002', timestamp: '2026-02-19 10:28', taskId: 't-002', deliverableId: 'del-002', category: 'task', severity: 'success' },
  // ── CRM events ──
  { id: 'a-003', type: 'email_sent', description: 'Proposta enviada para Ricardo Mendes', agentId: 'ag-004', timestamp: '2026-02-19 09:30', category: 'crm', severity: 'success' },
  { id: 'a-004', type: 'lead_contacted', description: 'Primeiro contacto com Sofia Rodrigues', agentId: 'ag-005', timestamp: '2026-02-19 09:15', category: 'crm', severity: 'info' },
  // ── Campaign events ──
  { id: 'a-005', type: 'campaign_started', description: 'Campanha "Spring Launch" ativada', agentId: 'ag-003', timestamp: '2026-02-19 08:00', category: 'marketing', severity: 'success' },
  // ── Agent lifecycle ──
  { id: 'a-006', type: 'cron_executed', description: 'Aurora executou digest matinal — 12 emails processados', agentId: 'ag-001', timestamp: '2026-02-19 08:00', category: 'agent', severity: 'info', metadata: { emailsProcessed: 12 } },
  { id: 'a-007', type: 'task_completed', description: 'Reuniões da semana agendadas e confirmadas', agentId: 'ag-001', timestamp: '2026-02-19 07:45', taskId: 't-011', category: 'task', severity: 'success' },
  // ── System events ──
  { id: 'a-008', type: 'agent_error', description: 'WhatsApp API timeout — Onyx offline há 3h', agentId: 'ag-008', timestamp: '2026-02-19 06:12', category: 'system', severity: 'error', metadata: { errorCode: 'TIMEOUT', service: 'whatsapp_api' } },
  { id: 'a-009', type: 'memory_created', description: 'Nova memória: preferências de comunicação Ricardo Mendes', agentId: 'ag-004', timestamp: '2026-02-19 09:35', category: 'agent', severity: 'info' },
  // ── More CRM ──
  { id: 'a-010', type: 'proposal_created', description: 'Proposta GreenTech gerada — €8.500', agentId: 'ag-004', timestamp: '2026-02-18 17:30', category: 'crm', severity: 'success', metadata: { value: 8500 } },
  { id: 'a-011', type: 'lead_contacted', description: 'Follow-up Marta Silva via WhatsApp — quer demo', agentId: 'ag-004', timestamp: '2026-02-19 10:15', category: 'crm', severity: 'info' },
  { id: 'a-012', type: 'email_sent', description: 'Newsletter semanal enviada (2.4k recipients)', agentId: 'ag-006', timestamp: '2026-02-18 10:00', category: 'marketing', severity: 'success', metadata: { recipients: 2400 } },
  // ── Task assignment ──
  { id: 'a-013', type: 'task_assigned', description: 'Task "Setup email sequence" atribuída a Echo', agentId: 'ag-006', timestamp: '2026-02-18 15:00', taskId: 't-005', category: 'task', severity: 'info' },
  { id: 'a-014', type: 'task_created', description: 'Nova task: "Benchmark pricing concorrência"', agentId: 'ag-002', timestamp: '2026-02-19 09:00', taskId: 't-008', category: 'task', severity: 'info' },
  // ── Agent config ──
  { id: 'a-015', type: 'agent_config_changed', description: 'Nexus: modelo alterado de Haiku para Sonnet (complexidade alta)', agentId: 'ag-005', timestamp: '2026-02-18 11:00', category: 'agent', severity: 'warning', metadata: { oldModel: 'claude-haiku-4', newModel: 'claude-sonnet-4' } },
];

// ── Alerts ──
export const alerts: Alert[] = [
  { id: 'al-001', type: 'error', message: 'Onyx (WhatsApp) offline há 3h — API timeout', timestamp: '2026-02-19 06:12' },
  { id: 'al-002', type: 'warning', message: '3 leads sem resposta há mais de 48h', timestamp: '2026-02-19 08:00' },
  { id: 'al-003', type: 'warning', message: 'Email bounce rate subiu para 4.2%', timestamp: '2026-02-18 20:00' },
  { id: 'al-004', type: 'info', message: 'Pipeline review agendada para sexta 16h', timestamp: '2026-02-19 09:00' },
];

// ── Schedules ──
export const schedules: Schedule[] = [
  { id: 's-001', date: '2026-02-19', time: '14:00', agentId: 'ag-002', type: 'Relatório Semanal', department: 'marketing' },
  { id: 's-002', date: '2026-02-19', time: '16:00', agentId: 'ag-004', type: 'Follow-up Batch', department: 'comercial' },
  { id: 's-003', date: '2026-02-20', time: '09:00', agentId: 'ag-001', type: 'Digest Executivo', department: 'marketing' },
  { id: 's-004', date: '2026-02-20', time: '10:00', agentId: 'ag-005', type: 'New Leads Scan', department: 'comercial' },
  { id: 's-005', date: '2026-02-21', time: '16:00', agentId: 'ag-004', type: 'Pipeline Review', department: 'comercial' },
];

// ── Helper Functions ──
export const getAgent = (id: string): Agent | undefined => agents.find(a => a.id === id);
export const getAgentName = (id: string): string => getAgent(id)?.name ?? 'Unknown';
export const getAgentAvatar = (id: string): string => getAgent(id)?.avatar ?? '🤖';

export const getStatusColor = (status: Agent['status']): string => {
  switch (status) {
    case 'online': return 'var(--status-online)';
    case 'busy': return 'var(--status-busy)';
    case 'error': return 'var(--status-error)';
    case 'idle': return 'var(--status-idle)';
  }
};

export const getDepartmentColor = (dept: string): string => {
  switch (dept) {
    case 'marketing': return 'var(--marketing-color)';
    case 'comercial': return 'var(--comercial-color)';
    default: return 'var(--accent-cyan)';
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'urgent': return 'var(--status-error)';
    case 'high': return 'var(--accent-amber)';
    case 'medium': return 'var(--accent-cyan)';
    case 'low': return 'var(--text-tertiary)';
  }
};

export const getTaskStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'inbox': return 'var(--text-tertiary)';
    case 'assigned': return 'var(--accent-amber)';
    case 'in_progress': return 'var(--accent-cyan)';
    case 'testing': return 'var(--status-busy)';
    case 'review': return 'var(--marketing-color)';
    case 'done': return 'var(--status-online)';
    case 'archived': return 'var(--text-disabled)';
  }
};

export const getTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'inbox': return 'Inbox';
    case 'assigned': return 'Assigned';
    case 'in_progress': return 'In Progress';
    case 'testing': return 'Testing';
    case 'review': return 'Review';
    case 'done': return 'Done';
    case 'archived': return 'Archived';
  }
};

export const getActivityIcon = (type: Activity['type']): string => {
  switch (type) {
    case 'email_sent': return '📧';
    case 'lead_contacted': return '🤝';
    case 'proposal_created': return '📄';
    case 'task_completed': return '✅';
    case 'campaign_started': return '🚀';
    case 'agent_error': return '⚠️';
    case 'task_created': return '📋';
    case 'task_assigned': return '👤';
    case 'task_status_changed': return '🔄';
    case 'deliverable_added': return '📦';
    case 'deliverable_approved': return '✅';
    case 'deliverable_rejected': return '❌';
    case 'agent_spawned': return '🤖';
    case 'agent_completed': return '🏁';
    case 'agent_config_changed': return '⚙️';
    case 'system_alert': return '🔔';
    case 'cron_executed': return '⏰';
    case 'memory_created': return '🧠';
  }
};

export const getSeverityColor = (severity: Activity['severity']): string => {
  switch (severity) {
    case 'success': return 'var(--status-online)';
    case 'warning': return 'var(--accent-amber)';
    case 'error': return 'var(--status-error)';
    case 'info': default: return 'var(--text-tertiary)';
  }
};
