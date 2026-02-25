// ═══════════════════════════════════════════════
// OPENCLAW MISSION CONTROL — Mock Data Layer
// ═══════════════════════════════════════════════

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
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  department: 'marketing' | 'comercial';
  agentId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
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

export interface Activity {
  id: string;
  type: 'email_sent' | 'lead_contacted' | 'proposal_created' | 'task_completed' | 'campaign_started' | 'agent_error';
  description: string;
  agentId: string;
  timestamp: string;
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

// ── Agents ──
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
  },
];

// ── Tasks ──
export const tasks: Task[] = [
  { id: 't-001', title: 'Criar landing page Spring Campaign', status: 'doing', department: 'marketing', agentId: 'ag-003', priority: 'high' },
  { id: 't-002', title: 'Relatório de mercado imobiliário PT', status: 'doing', department: 'marketing', agentId: 'ag-002', priority: 'medium' },
  { id: 't-003', title: 'Follow-up leads semana passada', status: 'todo', department: 'comercial', agentId: 'ag-004', priority: 'urgent' },
  { id: 't-004', title: 'Preparar proposta cliente TechVista', status: 'doing', department: 'comercial', agentId: 'ag-004', priority: 'high' },
  { id: 't-005', title: 'Setup email sequence onboarding', status: 'todo', department: 'marketing', agentId: 'ag-006', priority: 'medium' },
  { id: 't-006', title: 'Qualificar leads do webinar', status: 'doing', department: 'comercial', agentId: 'ag-005', priority: 'high' },
  { id: 't-007', title: 'Revisão copy newsletters', status: 'done', department: 'marketing', agentId: 'ag-003', priority: 'low' },
  { id: 't-008', title: 'Benchmark pricing concorrência', status: 'todo', department: 'marketing', agentId: 'ag-002', priority: 'medium' },
  { id: 't-009', title: 'Atualizar pipeline CRM', status: 'done', department: 'comercial', agentId: 'ag-005', priority: 'medium' },
  { id: 't-010', title: 'Enviar proposta GreenTech', status: 'todo', department: 'comercial', agentId: 'ag-004', priority: 'urgent' },
  { id: 't-011', title: 'Agendar reuniões da semana', status: 'done', department: 'marketing', agentId: 'ag-001', priority: 'medium' },
  { id: 't-012', title: 'Verificar deliverability emails', status: 'todo', department: 'marketing', agentId: 'ag-006', priority: 'low' },
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

// ── Activities ──
export const activities: Activity[] = [
  { id: 'a-001', type: 'email_sent', description: 'Proposta enviada para Ricardo Mendes', agentId: 'ag-004', timestamp: '2026-02-19 09:30' },
  { id: 'a-002', type: 'lead_contacted', description: 'Primeiro contacto com Sofia Rodrigues', agentId: 'ag-005', timestamp: '2026-02-19 09:15' },
  { id: 'a-003', type: 'campaign_started', description: 'Campanha "Spring Launch" ativada', agentId: 'ag-003', timestamp: '2026-02-19 08:00' },
  { id: 'a-004', type: 'task_completed', description: 'Reuniões da semana agendadas', agentId: 'ag-001', timestamp: '2026-02-19 07:45' },
  { id: 'a-005', type: 'proposal_created', description: 'Proposta GreenTech gerada', agentId: 'ag-004', timestamp: '2026-02-18 17:30' },
  { id: 'a-006', type: 'agent_error', description: 'WhatsApp API timeout - Onyx offline', agentId: 'ag-008', timestamp: '2026-02-19 06:12' },
  { id: 'a-007', type: 'lead_contacted', description: 'Follow-up Marta Silva via WhatsApp', agentId: 'ag-004', timestamp: '2026-02-19 10:15' },
  { id: 'a-008', type: 'email_sent', description: 'Newsletter semanal enviada (2.4k recipients)', agentId: 'ag-006', timestamp: '2026-02-18 10:00' },
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

export const getActivityIcon = (type: Activity['type']): string => {
  switch (type) {
    case 'email_sent': return '📧';
    case 'lead_contacted': return '🤝';
    case 'proposal_created': return '📄';
    case 'task_completed': return '✅';
    case 'campaign_started': return '🚀';
    case 'agent_error': return '⚠️';
  }
};
