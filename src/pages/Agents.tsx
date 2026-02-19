import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  X,
  Play,
  Terminal,
  Pencil,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  agents, Agent, getStatusColor, getDepartmentColor,
} from '../data/mockData';

const Agents: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'online': return <Wifi size={12} />;
      case 'busy': return <Clock size={12} />;
      case 'idle': return <WifiOff size={12} />;
      case 'error': return <AlertTriangle size={12} />;
    }
  };

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.pageTitle}>Agents</h2>
          <span style={styles.agentCount}>{agents.length} agentes</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.searchBox}>
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Pesquisar agentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button style={styles.btnPrimary}>
            <Plus size={14} /> Novo agente
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={styles.content}>
        <div style={styles.agentGrid}>
          {filteredAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              style={{
                ...styles.agentCard,
                ...(selectedAgent?.id === agent.id ? styles.agentCardSelected : {}),
              }}
              onClick={() => setSelectedAgent(agent)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
            >
              {/* Card Top */}
              <div style={styles.cardTop}>
                <div style={styles.agentAvatar}>{agent.avatar}</div>
                <div style={{
                  ...styles.statusChip,
                  color: getStatusColor(agent.status),
                  background: `${getStatusColor(agent.status)}15`,
                  borderColor: `${getStatusColor(agent.status)}30`,
                }}>
                  {statusIcon(agent.status)}
                  {agent.status}
                </div>
              </div>

              {/* Card Info */}
              <div style={styles.cardInfo}>
                <div style={styles.agentName}>{agent.name}</div>
                <div style={styles.agentRole}>{agent.role}</div>
              </div>

              {/* Department + Type Tags */}
              <div style={styles.tagRow}>
                <span style={{
                  ...styles.deptTag,
                  color: getDepartmentColor(agent.department),
                  background: agent.department === 'marketing'
                    ? 'var(--marketing-dim)'
                    : agent.department === 'comercial'
                    ? 'var(--comercial-dim)'
                    : 'var(--accent-cyan-dim)',
                }}>
                  {agent.department}
                </span>
                <span style={styles.typeTag}>OpenClaw</span>
              </div>

              {/* Current Task */}
              {agent.currentTask && (
                <div style={styles.currentTaskBar}>
                  <RefreshCw size={10} color="var(--accent-cyan)" style={{ animation: 'spin 2s linear infinite' }} />
                  <span>{agent.currentTask}</span>
                </div>
              )}

              {/* Desk Location */}
              <div style={styles.deskLocation}>
                Sala: {agent.department} · Mesa ({agent.desk.x},{agent.desk.y})
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Agent Detail Side Panel ── */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              style={styles.sidePanel}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 380 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div style={styles.panelInner}>
                {/* Panel Header */}
                <div style={styles.panelHeader}>
                  <div style={styles.panelAvatarLarge}>{selectedAgent.avatar}</div>
                  <div>
                    <div style={styles.panelName}>{selectedAgent.name}</div>
                    <div style={styles.panelRole}>{selectedAgent.role}</div>
                  </div>
                  <button style={styles.closeBtn} onClick={() => setSelectedAgent(null)}>
                    <X size={14} />
                  </button>
                </div>

                {/* Status */}
                <div style={styles.panelSection}>
                  <div style={styles.sectionLabel}>STATUS</div>
                  <div style={{
                    ...styles.statusBadgeLarge,
                    color: getStatusColor(selectedAgent.status),
                    background: `${getStatusColor(selectedAgent.status)}12`,
                    borderColor: `${getStatusColor(selectedAgent.status)}25`,
                  }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: getStatusColor(selectedAgent.status),
                      boxShadow: `0 0 10px ${getStatusColor(selectedAgent.status)}`,
                    }} />
                    {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                  </div>
                </div>

                {/* Soul */}
                {selectedAgent.soul && (
                  <div style={styles.panelSection}>
                    <div style={styles.sectionLabel}>SOUL / PERSONA</div>
                    <div style={styles.soulText}>{selectedAgent.soul}</div>
                  </div>
                )}

                {/* Skills */}
                <div style={styles.panelSection}>
                  <div style={styles.sectionLabel}>SKILLS CONECTADAS</div>
                  <div style={styles.skillGrid}>
                    {selectedAgent.skills.map(skill => (
                      <div key={skill} style={styles.skillItem}>
                        <div style={styles.skillDot} />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cron Jobs */}
                {selectedAgent.cronJobs && selectedAgent.cronJobs.length > 0 && (
                  <div style={styles.panelSection}>
                    <div style={styles.sectionLabel}>CRON JOBS</div>
                    <div style={styles.cronList}>
                      {selectedAgent.cronJobs.map((job, i) => (
                        <div key={i} style={styles.cronItem}>
                          <Clock size={10} color="var(--accent-amber)" />
                          {job}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={styles.panelActions}>
                  <button style={styles.panelActionBtn}>
                    <Play size={13} /> Testar
                  </button>
                  <button style={styles.panelActionBtn}>
                    <Terminal size={13} /> Ver logs
                  </button>
                  <button style={styles.panelActionBtn}>
                    <Pencil size={13} /> Editar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  agentCount: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  headerRight: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-input)',
    border: '1px solid var(--border-default)',
    width: '240px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
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
  content: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  agentGrid: {
    flex: 1,
    padding: '20px 24px',
    overflow: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '12px',
    alignContent: 'start',
  },
  agentCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  agentCardSelected: {
    borderColor: 'var(--accent-cyan)',
    boxShadow: 'var(--shadow-glow-cyan)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentAvatar: {
    fontSize: '28px',
  },
  statusChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    border: '1px solid',
  },
  cardInfo: {},
  agentName: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  agentRole: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  tagRow: {
    display: 'flex',
    gap: '6px',
  },
  deptTag: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  typeTag: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '4px',
    background: 'var(--bg-hover)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  currentTaskBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    background: 'var(--accent-cyan-dim)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(0,212,255,0.08)',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-cyan)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  deskLocation: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  // ── Side Panel ──
  sidePanel: {
    borderLeft: '1px solid var(--border-subtle)',
    background: 'var(--bg-primary)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  panelInner: {
    width: '380px',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  panelAvatarLarge: {
    fontSize: '36px',
  },
  panelName: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  panelRole: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  closeBtn: {
    marginLeft: 'auto',
    width: 30,
    height: 30,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
  },
  panelSection: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  sectionLabel: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: '10px',
  },
  statusBadgeLarge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 600,
  },
  soulText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    fontStyle: 'italic',
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    borderLeft: '3px solid var(--accent-cyan)',
  },
  skillGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  skillItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    padding: '6px 10px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
  },
  skillDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'var(--status-online)',
  },
  cronList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  cronItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    padding: '8px 10px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    borderLeft: '2px solid var(--accent-amber)',
  },
  panelActions: {
    padding: '16px 20px',
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  panelActionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
};

export default Agents;
