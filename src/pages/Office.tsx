import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Pause,
  ExternalLink,
  MessageSquare,
  Eye,
  Layers,
  List,
} from 'lucide-react';
import { agents, getStatusColor, Agent } from '../data/mockData';

const ROOMS = [
  { id: 'all', label: 'Todos' },
  { id: 'direção', label: 'Direção' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'comercial', label: 'Comercial' },
];

// Office layout grid — 4x5 grid representing desks
const GRID_COLS = 4;
const GRID_ROWS = 5;

const Office: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeRoom, setActiveRoom] = useState('all');
  const [viewMode, setViewMode] = useState<'3d' | 'list'>('3d');

  const filteredAgents = activeRoom === 'all'
    ? agents
    : agents.filter(a => a.department === activeRoom);

  return (
    <div style={styles.page}>
      {/* ── Overlay Controls ── */}
      <div style={styles.overlayTop}>
        <div style={styles.roomSelector}>
          {ROOMS.map(room => (
            <button
              key={room.id}
              style={{
                ...styles.roomBtn,
                ...(activeRoom === room.id ? styles.roomBtnActive : {}),
              }}
              onClick={() => setActiveRoom(room.id)}
            >
              {room.label}
            </button>
          ))}
        </div>
        <div style={styles.viewToggle}>
          <button
            style={{ ...styles.toggleBtn, ...(viewMode === '3d' ? styles.toggleBtnActive : {}) }}
            onClick={() => setViewMode('3d')}
          >
            <Layers size={14} /> Vista 3D
          </button>
          <button
            style={{ ...styles.toggleBtn, ...(viewMode === 'list' ? styles.toggleBtnActive : {}) }}
            onClick={() => setViewMode('list')}
          >
            <List size={14} /> Lista
          </button>
        </div>
      </div>

      {/* ── Main Office View ── */}
      <div style={styles.officeContainer}>
        {viewMode === '3d' ? (
          <div style={styles.officeGrid}>
            {/* Background Grid */}
            <div style={styles.gridBackground}>
              {Array.from({ length: GRID_ROWS }).map((_, row) => (
                <div key={row} style={styles.gridRow}>
                  {Array.from({ length: GRID_COLS }).map((_, col) => {
                    const agent = filteredAgents.find(a => a.desk.x === col + 1 && a.desk.y === row + 1);
                    return (
                      <div key={col} style={styles.gridCell}>
                        {agent ? (
                          <motion.div
                            style={styles.deskUnit}
                            whileHover={{ scale: 1.05, y: -4 }}
                            onClick={() => setSelectedAgent(agent)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (row * GRID_COLS + col) * 0.05 }}
                          >
                            {/* Desk Surface */}
                            <div style={styles.deskSurface}>
                              <div style={styles.deskScreen}>
                                <div style={{
                                  ...styles.screenContent,
                                  borderColor: getStatusColor(agent.status),
                                }}>
                                  <span style={styles.deskAvatar}>{agent.avatar}</span>
                                </div>
                              </div>
                              {/* Status light */}
                              <div style={{
                                ...styles.statusLight,
                                background: getStatusColor(agent.status),
                                boxShadow: `0 0 12px ${getStatusColor(agent.status)}`,
                              }} />
                            </div>
                            {/* Desk Label */}
                            <div style={styles.deskLabel}>
                              <div style={styles.deskName}>{agent.name}</div>
                              <div style={styles.deskRole}>{agent.role}</div>
                            </div>
                            {/* Current Task Indicator */}
                            {agent.currentTask && (
                              <div style={styles.taskBubble}>
                                <div style={styles.taskBubbleText}>{agent.currentTask}</div>
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <div style={styles.emptyDesk}>
                            <div style={styles.emptyDeskIcon}>+</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── Mini Map ── */}
            <div style={styles.miniMap}>
              <div style={styles.miniMapTitle}>
                <Eye size={10} /> PLANTA
              </div>
              <div style={styles.miniMapGrid}>
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    style={{
                      ...styles.miniMapDot,
                      background: getStatusColor(agent.status),
                      left: `${((agent.desk.x - 1) / (GRID_COLS - 1)) * 80 + 10}%`,
                      top: `${((agent.desk.y - 1) / (GRID_ROWS - 1)) * 80 + 10}%`,
                    }}
                    title={agent.name}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── List View ── */
          <div style={styles.listView}>
            {filteredAgents.map((agent, i) => (
              <motion.div
                key={agent.id}
                style={styles.listItem}
                onClick={() => setSelectedAgent(agent)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ x: 4 }}
              >
                <div style={styles.listAvatar}>{agent.avatar}</div>
                <div style={styles.listInfo}>
                  <div style={styles.listName}>{agent.name}</div>
                  <div style={styles.listRole}>{agent.role}</div>
                </div>
                <div style={{
                  ...styles.listStatus,
                  color: getStatusColor(agent.status),
                  background: `${getStatusColor(agent.status)}15`,
                }}>
                  {agent.status}
                </div>
                <div style={styles.listTask}>
                  {agent.currentTask || '—'}
                </div>
                <div style={styles.listDept}>{agent.department}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Agent Detail Drawer ── */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            style={styles.drawer}
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div style={styles.drawerHeader}>
              <div style={styles.drawerAvatar}>{selectedAgent.avatar}</div>
              <div>
                <div style={styles.drawerName}>{selectedAgent.name}</div>
                <div style={styles.drawerRole}>{selectedAgent.role}</div>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelectedAgent(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Status */}
            <div style={styles.drawerSection}>
              <div style={styles.drawerLabel}>STATUS</div>
              <div style={{
                ...styles.drawerStatusBadge,
                color: getStatusColor(selectedAgent.status),
                background: `${getStatusColor(selectedAgent.status)}15`,
                borderColor: `${getStatusColor(selectedAgent.status)}30`,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: getStatusColor(selectedAgent.status),
                  boxShadow: `0 0 8px ${getStatusColor(selectedAgent.status)}`,
                }} />
                {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                {selectedAgent.currentTask && (
                  <span style={styles.drawerCurrentTask}>— {selectedAgent.currentTask}</span>
                )}
              </div>
            </div>

            {/* Soul */}
            {selectedAgent.soul && (
              <div style={styles.drawerSection}>
                <div style={styles.drawerLabel}>SOUL / PERSONA</div>
                <div style={styles.drawerSoul}>{selectedAgent.soul}</div>
              </div>
            )}

            {/* Skills */}
            <div style={styles.drawerSection}>
              <div style={styles.drawerLabel}>SKILLS</div>
              <div style={styles.skillTags}>
                {selectedAgent.skills.map(skill => (
                  <span key={skill} style={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Cron Jobs */}
            {selectedAgent.cronJobs && (
              <div style={styles.drawerSection}>
                <div style={styles.drawerLabel}>CRON JOBS</div>
                <div style={styles.cronList}>
                  {selectedAgent.cronJobs.map((job, i) => (
                    <div key={i} style={styles.cronItem}>{job}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={styles.drawerActions}>
              <button style={styles.actionBtn}>
                <ExternalLink size={14} /> Abrir detalhes
              </button>
              <button style={styles.actionBtn}>
                <MessageSquare size={14} /> Enviar instrução
              </button>
              <button style={styles.actionBtnDanger}>
                <Pause size={14} /> Pausar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  overlayTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    zIndex: 10,
  },
  roomSelector: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg-secondary)',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  roomBtn: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  roomBtnActive: {
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
  },
  viewToggle: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg-secondary)',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
  toggleBtnActive: {
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
  },
  officeContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'auto',
  },
  officeGrid: {
    height: '100%',
    position: 'relative',
    padding: '0 24px 24px',
  },
  gridBackground: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    height: '100%',
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
    gap: '12px',
    flex: 1,
  },
  gridCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    minHeight: '100px',
    position: 'relative',
  },
  deskUnit: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '12px',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  deskSurface: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  deskScreen: {
    width: 56,
    height: 42,
    borderRadius: '6px',
    background: 'var(--bg-void)',
    border: '2px solid var(--border-strong)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  screenContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: '2px solid',
    background: 'linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 100%)',
  },
  deskAvatar: {
    fontSize: '20px',
  },
  statusLight: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginTop: '6px',
  },
  deskLabel: {
    textAlign: 'center' as const,
  },
  deskName: {
    fontFamily: 'var(--font-display)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  deskRole: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  taskBubble: {
    position: 'absolute' as const,
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--accent-cyan-dim)',
    border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: '12px',
    padding: '3px 8px',
    maxWidth: '90%',
  },
  taskBubbleText: {
    fontSize: '8px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-cyan)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  emptyDesk: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  emptyDeskIcon: {
    fontSize: '20px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
  },
  miniMap: {
    position: 'absolute' as const,
    bottom: '24px',
    right: '24px',
    width: '160px',
    height: '120px',
    background: 'var(--surface-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    padding: '8px',
    zIndex: 5,
  },
  miniMapTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '8px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  miniMapGrid: {
    position: 'relative' as const,
    width: '100%',
    height: 'calc(100% - 20px)',
    background: 'var(--bg-void)',
    borderRadius: '4px',
    border: '1px solid var(--border-subtle)',
  },
  miniMapDot: {
    position: 'absolute' as const,
    width: 6,
    height: 6,
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  },
  listView: {
    padding: '0 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: '40px 1.2fr 0.6fr 1.5fr 0.6fr',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 16px',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    cursor: 'pointer',
  },
  listAvatar: {
    fontSize: '24px',
    textAlign: 'center' as const,
  },
  listInfo: {},
  listName: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  listRole: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  listStatus: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    textAlign: 'center' as const,
  },
  listTask: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  listDept: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
  },
  drawer: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    width: '360px',
    height: '100%',
    background: 'var(--bg-primary)',
    borderLeft: '1px solid var(--border-default)',
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  drawerAvatar: {
    fontSize: '32px',
  },
  drawerName: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  drawerRole: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  closeBtn: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
  },
  drawerSection: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  drawerLabel: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: '8px',
  },
  drawerStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: 600,
  },
  drawerCurrentTask: {
    fontWeight: 400,
    color: 'var(--text-secondary)',
    fontSize: '11px',
  },
  drawerSoul: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },
  skillTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  skillTag: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    padding: '4px 10px',
    borderRadius: '20px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
  },
  cronList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cronItem: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    padding: '6px 10px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    borderLeft: '2px solid var(--accent-cyan)',
  },
  drawerActions: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: 'auto',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
  actionBtnDanger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--status-error-dim)',
    border: '1px solid rgba(255,59,92,0.2)',
    color: 'var(--status-error)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
};

export default Office;
