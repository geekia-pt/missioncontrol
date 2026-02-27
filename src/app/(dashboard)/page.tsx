'use client'

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Megaphone,
  Bot,
  Plus,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  CircleDot,
  Wifi,
  WifiOff,
  Cpu,
  HardDrive,
  Activity,
} from 'lucide-react';
import {
  tasks, activities, alerts, schedules, leads, campaigns, agents,
  getAgentName, getAgentAvatar, getActivityIcon, getDepartmentColor, getPriorityColor,
} from '@/data/mockData';
import { useGatewayHealth, useVitals, useCapacity, useSessions } from '@/hooks/useGateway';
import { useAgents } from '@/hooks/useAgents';

const stagger = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06, duration: 0.4 } });

const Dashboard: React.FC = () => {
  const { gatewayUp } = useGatewayHealth();
  const { vitals } = useVitals();
  const { capacity } = useCapacity();
  const { sessions, statusCounts } = useSessions();
  const { agents: liveAgents } = useAgents();

  // Use live agent count if available, otherwise mock
  const totalAgents = liveAgents.length > 0 ? liveAgents.length : agents.length;
  const onlineAgents = liveAgents.length > 0
    ? liveAgents.filter(a => a.status === 'online' || a.status === 'busy').length
    : agents.filter(a => a.status === 'online' || a.status === 'busy').length;

  const activeProjects = 4;
  const activeLeads = leads.filter(l => l.stage !== 'fechado').length;
  const runningCampaigns = campaigns.filter(c => c.status === 'running').length;
  const liveSessions = statusCounts.live || 0;

  const kpis = [
    { label: 'Projetos ativos', sublabel: 'Marketing & Gestão', value: activeProjects, icon: TrendingUp, color: 'var(--marketing-color)', bg: 'var(--marketing-dim)' },
    { label: 'Leads ativos', sublabel: 'Comercial', value: activeLeads, icon: Users, color: 'var(--comercial-color)', bg: 'var(--comercial-dim)' },
    { label: 'Campanhas ativas', sublabel: 'Em execução', value: runningCampaigns, icon: Megaphone, color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' },
    { label: 'Agentes online', sublabel: `${onlineAgents} de ${totalAgents}`, value: `${onlineAgents}/${totalAgents}`, icon: Bot, color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)' },
  ];

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doingTasks = tasks.filter(t => t.status === 'doing');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div style={styles.page}>
      {/* ── Gateway Status Bar ── */}
      <motion.div style={styles.gatewayBar} {...stagger(0)}>
        <div style={styles.gatewayLeft}>
          {gatewayUp ? (
            <Wifi size={12} color="var(--status-online)" />
          ) : (
            <WifiOff size={12} color="var(--text-tertiary)" />
          )}
          <span style={{
            ...styles.gatewayStatus,
            color: gatewayUp ? 'var(--status-online)' : 'var(--text-tertiary)',
          }}>
            Gateway {gatewayUp ? 'ONLINE' : 'OFFLINE'}
          </span>
          {gatewayUp && liveSessions > 0 && (
            <span style={styles.gatewayPill}>
              <Activity size={9} /> {liveSessions} sessão{liveSessions > 1 ? 'ões' : ''} ativa{liveSessions > 1 ? 's' : ''}
            </span>
          )}
          {gatewayUp && capacity && (
            <span style={styles.gatewayPill}>
              <Bot size={9} /> {capacity.main.active}/{capacity.main.max} slots
            </span>
          )}
        </div>
        {gatewayUp && vitals && (
          <div style={styles.gatewayRight}>
            <span style={styles.vitalChip}>
              <Cpu size={9} /> CPU {vitals.cpu.usage}%
            </span>
            <span style={styles.vitalChip}>
              <HardDrive size={9} /> RAM {vitals.memory.percent}%
            </span>
            {vitals.cpu.chip && (
              <span style={styles.vitalChipMuted}>{vitals.cpu.chip}</span>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Header ── */}
      <motion.div style={styles.header} {...stagger(0.5)}>
        <div>
          <h2 style={styles.pageTitle}>Mission Control</h2>
          <p style={styles.pageSubtitle}>Overview de Marketing, Comercial e agentes</p>
        </div>
        <div style={styles.headerActions}>
          {['Nova Campanha', 'Novo Projeto', 'Novo Lead'].map((label, i) => (
            <button key={i} style={i === 0 ? styles.btnPrimary : styles.btnSecondary}>
              <Plus size={14} />
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={styles.kpiGrid}>
        {kpis.map((kpi, i) => (
          <motion.div key={i} style={styles.kpiCard} {...stagger(i + 1)}>
            <div style={styles.kpiTop}>
              <div style={{ ...styles.kpiIconBox, background: kpi.bg }}>
                <kpi.icon size={18} color={kpi.color} />
              </div>
              <ArrowUpRight size={14} color="var(--text-tertiary)" />
            </div>
            <div style={styles.kpiValue}>{kpi.value}</div>
            <div style={styles.kpiLabel}>{kpi.label}</div>
            <div style={styles.kpiSublabel}>{kpi.sublabel}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Main Content Grid ── */}
      <div style={styles.mainGrid}>
        {/* ── Activities Feed ── */}
        <motion.div style={styles.card} {...stagger(5)}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Atividades recentes</h3>
            <div style={styles.liveIndicator}>
              <div style={{
                ...styles.liveDot,
                background: gatewayUp ? 'var(--status-online)' : 'var(--status-error)',
              }} />
              <span style={{
                ...styles.liveText,
                color: gatewayUp ? 'var(--status-online)' : 'var(--status-error)',
              }}>{gatewayUp ? 'LIVE' : 'MOCK'}</span>
            </div>
          </div>
          <div style={styles.activityList}>
            {activities.map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityIcon}>{getActivityIcon(activity.type)}</div>
                <div style={styles.activityContent}>
                  <div style={styles.activityDesc}>{activity.description}</div>
                  <div style={styles.activityMeta}>
                    <span style={styles.activityAgent}>
                      {getAgentAvatar(activity.agentId)} {getAgentName(activity.agentId)}
                    </span>
                    <span style={styles.activityTime}>{activity.timestamp.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Mini Kanban ── */}
        <motion.div style={styles.card} {...stagger(6)}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Tarefas por frente</h3>
            <span style={styles.taskCount}>{tasks.length} tarefas</span>
          </div>
          <div style={styles.kanbanGrid}>
            {/* To Do */}
            <div style={styles.kanbanColumn}>
              <div style={styles.kanbanHeader}>
                <CircleDot size={12} color="var(--text-tertiary)" />
                <span style={styles.kanbanTitle}>To Do</span>
                <span style={styles.kanbanCount}>{todoTasks.length}</span>
              </div>
              {todoTasks.slice(0, 4).map(task => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </div>
            {/* Doing */}
            <div style={styles.kanbanColumn}>
              <div style={styles.kanbanHeader}>
                <CircleDot size={12} color="var(--accent-cyan)" />
                <span style={styles.kanbanTitle}>Doing</span>
                <span style={styles.kanbanCount}>{doingTasks.length}</span>
              </div>
              {doingTasks.slice(0, 4).map(task => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </div>
            {/* Done */}
            <div style={styles.kanbanColumn}>
              <div style={styles.kanbanHeader}>
                <CircleDot size={12} color="var(--status-online)" />
                <span style={styles.kanbanTitle}>Done</span>
                <span style={styles.kanbanCount}>{doneTasks.length}</span>
              </div>
              {doneTasks.slice(0, 4).map(task => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Strip ── */}
      <div style={styles.bottomGrid}>
        {/* Alerts */}
        <motion.div style={styles.card} {...stagger(7)}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <AlertTriangle size={14} color="var(--accent-amber)" />
              Alertas e bloqueios
            </h3>
          </div>
          <div style={styles.alertList}>
            {alerts.map(alert => (
              <div key={alert.id} style={{
                ...styles.alertItem,
                borderLeftColor: alert.type === 'error' ? 'var(--status-error)' : alert.type === 'warning' ? 'var(--accent-amber)' : 'var(--accent-cyan)',
              }}>
                <div style={styles.alertMsg}>{alert.message}</div>
                <div style={styles.alertTime}>{alert.timestamp}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Schedules */}
        <motion.div style={styles.card} {...stagger(8)}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <Clock size={14} color="var(--accent-cyan)" />
              Próximos agendamentos
            </h3>
          </div>
          <div style={styles.scheduleTable}>
            <div style={styles.scheduleHeaderRow}>
              <span>Data/Hora</span><span>Agente</span><span>Tipo</span><span>Frente</span>
            </div>
            {schedules.map(s => (
              <div key={s.id} style={styles.scheduleRow}>
                <span style={styles.scheduleDate}>{s.date.slice(5)} {s.time}</span>
                <span style={styles.scheduleAgent}>{getAgentAvatar(s.agentId)} {getAgentName(s.agentId)}</span>
                <span>{s.type}</span>
                <span style={{
                  ...styles.deptBadge,
                  color: getDepartmentColor(s.department),
                  background: s.department === 'marketing' ? 'var(--marketing-dim)' : s.department === 'comercial' ? 'var(--comercial-dim)' : 'var(--accent-cyan-dim)',
                }}>
                  {s.department}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ── Kanban Card Sub-component ──
const KanbanCard: React.FC<{ task: typeof tasks[0] }> = ({ task }) => (
  <div style={styles.kanbanCard}>
    <div style={styles.kanbanCardTitle}>{task.title}</div>
    <div style={styles.kanbanCardMeta}>
      <span style={{
        ...styles.deptBadge,
        color: getDepartmentColor(task.department),
        background: task.department === 'marketing' ? 'var(--marketing-dim)' : task.department === 'comercial' ? 'var(--comercial-dim)' : 'var(--accent-cyan-dim)',
        fontSize: '9px',
      }}>
        {task.department}
      </span>
      <span style={{
        ...styles.priorityDot,
        background: getPriorityColor(task.priority),
      }} />
      <span style={styles.kanbanAgent}>{getAgentAvatar(task.agentId)}</span>
    </div>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '24px',
    overflow: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  // ── Gateway Status Bar ──
  gatewayBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
  },
  gatewayLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  gatewayStatus: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  gatewayPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    padding: '2px 8px',
    borderRadius: '12px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-subtle)',
  },
  gatewayRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  vitalChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    padding: '2px 8px',
    borderRadius: '12px',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-subtle)',
  },
  vitalChipMuted: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  // ── Header ──
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  pageSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
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
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  kpiCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  kpiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  kpiLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  kpiSublabel: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
    marginTop: '2px',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '16px',
  },
  card: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--status-error)',
    animation: 'pulse-glow 1.5s infinite',
  },
  liveText: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--status-error)',
    letterSpacing: '1px',
  },
  taskCount: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background 0.15s',
  },
  activityIcon: {
    fontSize: '16px',
    lineHeight: 1,
    marginTop: '2px',
  },
  activityContent: {
    flex: 1,
    minWidth: 0,
  },
  activityDesc: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.4,
  },
  activityMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '4px',
  },
  activityAgent: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
  activityTime: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  kanbanGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  kanbanColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  kanbanHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-subtle)',
    marginBottom: '4px',
  },
  kanbanTitle: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  kanbanCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    marginLeft: 'auto',
  },
  kanbanCard: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
    padding: '10px',
  },
  kanbanCardTitle: {
    fontSize: '11px',
    color: 'var(--text-primary)',
    lineHeight: 1.4,
    marginBottom: '6px',
  },
  kanbanCardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  deptBadge: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },
  kanbanAgent: {
    marginLeft: 'auto',
    fontSize: '12px',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  alertItem: {
    padding: '10px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)',
    borderLeft: '3px solid',
  },
  alertMsg: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.4,
  },
  alertTime: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    marginTop: '4px',
  },
  scheduleTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  scheduleHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 0.8fr',
    gap: '8px',
    padding: '6px 10px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  scheduleRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 0.8fr',
    gap: '8px',
    padding: '8px 10px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-sm)',
    alignItems: 'center',
  },
  scheduleDate: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  scheduleAgent: {
    fontSize: '12px',
  },
};

export default Dashboard;
