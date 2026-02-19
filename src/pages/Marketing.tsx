import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Megaphone,
  Mail,
  Plus,
  Filter,
  ChevronRight,
  Eye,
  Send,
} from 'lucide-react';
import {
  projects, campaigns,
  getAgentName, getAgentAvatar, getDepartmentColor,
} from '../data/mockData';

type Tab = 'projetos' | 'campanhas' | 'emails';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'projetos', label: 'Projetos', icon: FolderKanban },
  { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
  { id: 'emails', label: 'E-mails & Sequências', icon: Mail },
];

const Marketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('projetos');

  return (
    <div style={styles.page}>
      {/* ── Tab Navigation ── */}
      <div style={styles.tabBar}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(isActive ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              {tab.label}
              {isActive && <div style={styles.tabIndicator} />}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div style={styles.tabContent}>
        {activeTab === 'projetos' && <ProjectsTab />}
        {activeTab === 'campanhas' && <CampaignsTab />}
        {activeTab === 'emails' && <EmailsTab />}
      </div>
    </div>
  );
};

// ═══════════════════════════════════
// PROJETOS TAB — Kanban View
// ═══════════════════════════════════
const ProjectsTab: React.FC = () => {
  const columns = [
    { key: 'planeamento', label: 'Planeamento', color: 'var(--text-tertiary)' },
    { key: 'em_andamento', label: 'Em Andamento', color: 'var(--accent-cyan)' },
    { key: 'concluido', label: 'Concluído', color: 'var(--status-online)' },
  ];

  return (
    <div>
      <div style={styles.sectionHeader}>
        <button style={styles.filterBtn}>
          <Filter size={13} /> Filtrar por status
        </button>
        <button style={styles.filterBtn}>
          <Filter size={13} /> Filtrar por agente
        </button>
        <div style={{ flex: 1 }} />
        <button style={styles.btnPrimary}>
          <Plus size={14} /> Novo Projeto
        </button>
      </div>

      <div style={styles.kanbanBoard}>
        {columns.map(col => {
          const colProjects = projects.filter(p => p.status === col.key);
          return (
            <div key={col.key} style={styles.kanbanCol}>
              <div style={styles.kanbanColHeader}>
                <div style={{ ...styles.colDot, background: col.color }} />
                <span style={styles.kanbanColTitle}>{col.label}</span>
                <span style={styles.kanbanColCount}>{colProjects.length}</span>
              </div>
              <div style={styles.kanbanColCards}>
                {colProjects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    style={styles.projectCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <div style={styles.projectName}>{project.name}</div>
                    <div style={styles.projectClient}>{project.client}</div>
                    <div style={styles.projectMeta}>
                      <span style={styles.projectAgent}>
                        {getAgentAvatar(project.agentId)} {getAgentName(project.agentId)}
                      </span>
                    </div>
                    <div style={styles.projectAction}>
                      <ChevronRight size={10} color="var(--accent-cyan)" />
                      <span>{project.nextAction}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════
// CAMPANHAS TAB — Table View
// ═══════════════════════════════════
const CampaignsTab: React.FC = () => {
  const statusColors: Record<string, { bg: string; color: string }> = {
    draft: { bg: 'var(--status-idle-dim)', color: 'var(--status-idle)' },
    scheduled: { bg: 'var(--accent-amber-dim)', color: 'var(--accent-amber)' },
    running: { bg: 'var(--status-online-dim)', color: 'var(--status-online)' },
    completed: { bg: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' },
  };

  const channelIcons: Record<string, string> = {
    email: '📧',
    social: '📱',
    whatsapp: '💬',
  };

  return (
    <div>
      <div style={styles.sectionHeader}>
        <div style={{ flex: 1 }} />
        <button style={styles.btnPrimary}>
          <Plus size={14} /> Criar Campanha
        </button>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Nome</span>
          <span>Canal</span>
          <span>Status</span>
          <span>Leads Gerados</span>
          <span>Open Rate</span>
          <span>Frente</span>
        </div>
        {campaigns.map((campaign, i) => (
          <motion.div
            key={campaign.id}
            style={styles.tableRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <span style={styles.tableName}>{campaign.name}</span>
            <span style={styles.tableChannel}>
              {channelIcons[campaign.channel]} {campaign.channel}
            </span>
            <span>
              <span style={{
                ...styles.statusBadge,
                ...statusColors[campaign.status],
              }}>
                {campaign.status}
              </span>
            </span>
            <span style={styles.tableValue}>{campaign.leadsGenerated}</span>
            <span style={styles.tableValue}>
              {campaign.openRate > 0 ? `${campaign.openRate}%` : '—'}
            </span>
            <span style={{
              ...styles.deptBadge,
              color: getDepartmentColor(campaign.department),
            }}>
              {campaign.department}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════
// EMAILS TAB — Split View
// ═══════════════════════════════════

const emailSequences = [
  {
    id: 'seq-001',
    name: 'Onboarding Novos Clientes',
    objective: 'Welcome + educação produto',
    steps: 5,
    agentId: 'ag-006',
    active: true,
    stepsDetail: [
      { day: 1, subject: 'Bem-vindo à Audaces!', condition: 'Enviado automaticamente' },
      { day: 3, subject: 'Como começar: guia rápido', condition: 'Se abriu email 1' },
      { day: 5, subject: 'Case study: resultados em 30 dias', condition: 'Se abriu email 2' },
      { day: 7, subject: 'Agendar demo personalizada', condition: 'Se não respondeu' },
      { day: 14, subject: 'Última chance: oferta especial', condition: 'Se não agendou demo' },
    ],
  },
  {
    id: 'seq-002',
    name: 'Re-engagement Cold Leads',
    objective: 'Reativar leads inativos',
    steps: 3,
    agentId: 'ag-006',
    active: false,
    stepsDetail: [
      { day: 1, subject: 'Novidades que podem interessar', condition: 'Lead inativo >30 dias' },
      { day: 4, subject: 'Caso de uso relevante', condition: 'Se abriu email 1' },
      { day: 7, subject: 'Vamos conversar?', condition: 'Se não respondeu' },
    ],
  },
  {
    id: 'seq-003',
    name: 'Follow-up Pós-Webinar',
    objective: 'Converter attendees em leads',
    steps: 4,
    agentId: 'ag-006',
    active: true,
    stepsDetail: [
      { day: 0, subject: 'Obrigado por participar!', condition: 'Imediato pós-evento' },
      { day: 2, subject: 'Gravação + materiais', condition: 'Todos os participantes' },
      { day: 5, subject: 'Proposta personalizada', condition: 'Se engajou (>50% tempo)' },
      { day: 10, subject: 'Último follow-up', condition: 'Se não respondeu' },
    ],
  },
];

const EmailsTab: React.FC = () => {
  const [selectedSeq, setSelectedSeq] = useState(emailSequences[0]);

  return (
    <div style={styles.splitLayout}>
      {/* Left: Sequence List */}
      <div style={styles.splitLeft}>
        <div style={styles.splitLeftHeader}>
          <span style={styles.splitTitle}>Sequências</span>
          <button style={styles.btnSmall}><Plus size={12} /></button>
        </div>
        {emailSequences.map(seq => (
          <div
            key={seq.id}
            style={{
              ...styles.seqItem,
              ...(selectedSeq.id === seq.id ? styles.seqItemActive : {}),
            }}
            onClick={() => setSelectedSeq(seq)}
          >
            <div style={styles.seqName}>{seq.name}</div>
            <div style={styles.seqMeta}>
              <span>{seq.steps} passos</span>
              <span>{getAgentAvatar(seq.agentId)} {getAgentName(seq.agentId)}</span>
            </div>
            <div style={{
              ...styles.seqStatus,
              color: seq.active ? 'var(--status-online)' : 'var(--text-tertiary)',
            }}>
              {seq.active ? '● Ativa' : '○ Inativa'}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Sequence Detail */}
      <div style={styles.splitRight}>
        <div style={styles.splitRightHeader}>
          <div>
            <div style={styles.seqDetailName}>{selectedSeq.name}</div>
            <div style={styles.seqDetailObj}>{selectedSeq.objective}</div>
          </div>
          <div style={styles.seqActions}>
            <button style={styles.btnSecondary}>
              <Eye size={13} /> Simular envio
            </button>
            <button style={styles.btnPrimary}>
              <Send size={13} /> {selectedSeq.active ? 'Desativar' : 'Ativar'} Sequência
            </button>
          </div>
        </div>

        <div style={styles.stepsTimeline}>
          {selectedSeq.stepsDetail.map((step, i) => (
            <motion.div
              key={i}
              style={styles.stepItem}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div style={styles.stepDot}>
                <div style={styles.stepDotInner} />
                {i < selectedSeq.stepsDetail.length - 1 && <div style={styles.stepLine} />}
              </div>
              <div style={styles.stepContent}>
                <div style={styles.stepDay}>Dia {step.day}</div>
                <div style={styles.stepSubject}>{step.subject}</div>
                <div style={styles.stepCondition}>{step.condition}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabBar: {
    display: 'flex',
    gap: '0px',
    padding: '0 24px',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--bg-primary)',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 20px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'color 0.15s',
  },
  tabActive: {
    color: 'var(--accent-cyan)',
  },
  tabIndicator: {
    position: 'absolute' as const,
    bottom: -1,
    left: '20px',
    right: '20px',
    height: 2,
    background: 'var(--accent-cyan)',
    borderRadius: '2px 2px 0 0',
  },
  tabContent: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 24px',
  },
  sectionHeader: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    background: 'var(--surface-input)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-glow-cyan)',
  },
  btnSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
  btnSmall: {
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
  },
  kanbanBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  kanbanCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  kanbanColHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '10px',
    borderBottom: '2px solid var(--border-subtle)',
  },
  colDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  kanbanColTitle: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  kanbanColCount: {
    marginLeft: 'auto',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  kanbanColCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  projectCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    padding: '14px',
    cursor: 'pointer',
  },
  projectName: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  projectClient: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
    marginBottom: '10px',
  },
  projectMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  projectAgent: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  projectAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 8px',
    background: 'var(--accent-cyan-dim)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '10px',
    color: 'var(--accent-cyan)',
    fontFamily: 'var(--font-mono)',
  },
  // ── Table styles ──
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 0.7fr 0.7fr',
    gap: '12px',
    padding: '10px 16px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 0.7fr 0.7fr',
    gap: '12px',
    padding: '12px 16px',
    alignItems: 'center',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
    cursor: 'pointer',
  },
  tableName: {
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  tableChannel: {
    textTransform: 'capitalize' as const,
  },
  tableValue: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },
  statusBadge: {
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  deptBadge: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  // ── Split Layout ──
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '0',
    height: '100%',
    margin: '-20px -24px',
  },
  splitLeft: {
    borderRight: '1px solid var(--border-subtle)',
    overflow: 'auto',
    padding: '16px',
  },
  splitLeftHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    padding: '0 4px',
  },
  splitTitle: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  seqItem: {
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  seqItemActive: {
    background: 'var(--accent-cyan-dim)',
    borderColor: 'rgba(0,212,255,0.15)',
  },
  seqName: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  seqMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
    marginBottom: '4px',
  },
  seqStatus: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },
  splitRight: {
    overflow: 'auto',
    padding: '20px 24px',
  },
  splitRightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  seqDetailName: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  seqDetailObj: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  seqActions: {
    display: 'flex',
    gap: '8px',
  },
  stepsTimeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepItem: {
    display: 'flex',
    gap: '16px',
    position: 'relative' as const,
  },
  stepDot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '20px',
    flexShrink: 0,
    paddingTop: '4px',
  },
  stepDotInner: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--accent-cyan)',
    border: '2px solid var(--accent-cyan-dim)',
    zIndex: 1,
  },
  stepLine: {
    width: 2,
    flex: 1,
    background: 'var(--border-default)',
    marginTop: '4px',
  },
  stepContent: {
    paddingBottom: '24px',
    flex: 1,
  },
  stepDay: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--accent-cyan)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  stepSubject: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  stepCondition: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic',
  },
};

export default Marketing;
