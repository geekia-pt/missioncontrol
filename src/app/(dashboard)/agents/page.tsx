'use client'

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
  Loader2,
} from 'lucide-react';
import { useAgents, AgentData } from '@/hooks/useAgents';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'var(--status-online)';
    case 'busy': return 'var(--status-busy)';
    case 'idle': return 'var(--status-idle)';
    case 'error': return 'var(--status-error)';
    default: return 'var(--status-idle)';
  }
};

const Agents: React.FC = () => {
  const { agents, loading, gatewayUp, refresh } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi size={12} />;
      case 'busy': return <Clock size={12} />;
      case 'idle': return <WifiOff size={12} />;
      case 'error': return <AlertTriangle size={12} />;
      default: return <WifiOff size={12} />;
    }
  };

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.pageTitle}>Agents</h2>
          <span style={styles.agentCount}>
            {loading ? '...' : `${agents.length} agentes`}
          </span>
          {/* Gateway status indicator */}
          <div style={{
            ...styles.gatewayChip,
            color: gatewayUp ? 'var(--status-online)' : 'var(--text-tertiary)',
            background: gatewayUp ? 'var(--status-online-dim)' : 'var(--bg-secondary)',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: gatewayUp ? 'var(--status-online)' : 'var(--text-tertiary)',
            }} />
            Gateway {gatewayUp ? 'online' : 'offline'}
          </div>
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
          <button style={styles.refreshBtn} onClick={() => refresh()}>
            <RefreshCw size={13} />
          </button>
          <button style={styles.btnPrimary} onClick={() => setShowBuilder(true)}>
            <Plus size={14} /> Novo agente
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingState}>
            <Loader2 size={24} color="var(--text-tertiary)" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>A carregar agentes...</span>
          </div>
        ) : (
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
                  <div style={styles.agentAvatar}>{agent.emoji}</div>
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

                {/* Tags */}
                <div style={styles.tagRow}>
                  <span style={styles.typeTag}>OpenClaw</span>
                  {agent.hasMemory && (
                    <span style={{ ...styles.typeTag, color: 'var(--accent-cyan)', background: 'var(--accent-cyan-dim)' }}>
                      memory
                    </span>
                  )}
                  {agent.hasSkills && (
                    <span style={{ ...styles.typeTag, color: 'var(--accent-amber)', background: 'var(--accent-amber-dim)' }}>
                      skills
                    </span>
                  )}
                </div>

                {/* Active sessions indicator */}
                {agent.activeSessions > 0 && (
                  <div style={styles.currentTaskBar}>
                    <RefreshCw size={10} color="var(--accent-cyan)" style={{ animation: 'spin 2s linear infinite' }} />
                    <span>{agent.activeSessions} sessão ativa</span>
                  </div>
                )}

                {/* ID tag */}
                <div style={styles.deskLocation}>
                  id: {agent.id}
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
                  <div style={styles.panelAvatarLarge}>{selectedAgent.emoji}</div>
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
                    {selectedAgent.activeSessions > 0 && (
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-tertiary)' }}>
                        {selectedAgent.activeSessions} sessão
                      </span>
                    )}
                  </div>
                </div>

                {/* Mission */}
                {selectedAgent.mission && (
                  <div style={styles.panelSection}>
                    <div style={styles.sectionLabel}>MISSÃO</div>
                    <div style={styles.soulText}>{selectedAgent.mission}</div>
                  </div>
                )}

                {/* Workspace Info */}
                <div style={styles.panelSection}>
                  <div style={styles.sectionLabel}>WORKSPACE</div>
                  <div style={styles.skillGrid}>
                    <div style={styles.skillItem}>
                      <div style={{ ...styles.skillDot, background: selectedAgent.hasMemory ? 'var(--status-online)' : 'var(--text-tertiary)' }} />
                      Memory ({selectedAgent.hasMemory ? 'configurado' : 'vazio'})
                    </div>
                    <div style={styles.skillItem}>
                      <div style={{ ...styles.skillDot, background: selectedAgent.hasSkills ? 'var(--accent-cyan)' : 'var(--text-tertiary)' }} />
                      Skills ({selectedAgent.hasSkills ? 'instaladas' : 'nenhuma'})
                    </div>
                    <div style={styles.skillItem}>
                      <div style={{ ...styles.skillDot, background: selectedAgent.gatewayConnected ? 'var(--status-online)' : 'var(--status-error)' }} />
                      Gateway ({selectedAgent.gatewayConnected ? 'online' : 'offline'})
                    </div>
                  </div>
                </div>

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

      {/* ── Agent Builder Modal ── */}
      <AnimatePresence>
        {showBuilder && (
          <AgentBuilderModal
            onClose={() => setShowBuilder(false)}
            onCreated={() => { refresh(); setShowBuilder(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Agent Builder Modal ──
function AgentBuilderModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: '', emoji: '🤖', role: '', mission: '',
    soulDescription: '', responsibilities: '',
    tools: '', heartbeatItems: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.name || !form.role) { setError('Nome e Role são obrigatórios'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/agents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.name.toLowerCase().replace(/\s+/g, '-'),
          name: form.name,
          emoji: form.emoji,
          role: form.role,
          mission: form.mission,
          soulDescription: form.soulDescription,
          responsibilities: form.responsibilities.split('\n').filter(Boolean),
          tools: form.tools.split('\n').filter(Boolean),
          heartbeatItems: form.heartbeatItems.split('\n').filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Erro ao criar agente'); return }
      onCreated()
    } catch { setError('Erro de rede') }
    finally { setSubmitting(false) }
  }

  return (
    <motion.div
      style={builderStyles.overlay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        style={builderStyles.modal}
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
      >
        <div style={builderStyles.header}>
          <span style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Criar Agente
          </span>
          <button style={builderStyles.closeBtn} onClick={onClose}><X size={14} /></button>
        </div>

        <div style={builderStyles.body}>
          {[
            { label: 'NOME', key: 'name', placeholder: 'Ex: Gestor de Obras', type: 'input' },
            { label: 'EMOJI', key: 'emoji', placeholder: '🏗️', type: 'input' },
            { label: 'ROLE', key: 'role', placeholder: 'Ex: Construction Manager', type: 'input' },
            { label: 'MISSÃO', key: 'mission', placeholder: 'Uma frase descrevendo o propósito', type: 'input' },
            { label: 'PERSONALIDADE (SOUL.md)', key: 'soulDescription', placeholder: 'Descreve a personalidade, expertise e abordagem...', type: 'textarea' },
            { label: 'RESPONSABILIDADES (uma por linha)', key: 'responsibilities', placeholder: 'Acompanhar obras em curso\nGerir subcontratados\n...', type: 'textarea' },
            { label: 'FERRAMENTAS (uma por linha)', key: 'tools', placeholder: 'Google Maps API\nWhatsApp Business API\n...', type: 'textarea' },
            { label: 'HEARTBEAT (checklist startup, uma por linha)', key: 'heartbeatItems', placeholder: 'Verificar obras ativas\nRever prazos críticos', type: 'textarea' },
          ].map(field => (
            <div key={field.key} style={builderStyles.field}>
              <label style={builderStyles.fieldLabel}>{field.label}</label>
              {field.type === 'input' ? (
                <input
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={builderStyles.fieldInput}
                />
              ) : (
                <textarea
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={3}
                  style={{ ...builderStyles.fieldInput, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                />
              )}
            </div>
          ))}
          {error && <div style={{ color: 'var(--status-error)', fontSize: 12, padding: '8px 0' }}>{error}</div>}
        </div>

        <div style={builderStyles.footer}>
          <button style={builderStyles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...builderStyles.btnPrimary, opacity: submitting ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'A criar...' : '✨ Gerar workspace OpenClaw'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const builderStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(8,9,12,0.8)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 200, padding: 24,
  },
  modal: {
    background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-default)', width: '100%', maxWidth: 560,
    maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
  },
  body: {
    flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
  },
  footer: {
    padding: '16px 24px', borderTop: '1px solid var(--border-subtle)',
    display: 'flex', gap: 10, justifyContent: 'flex-end',
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  fieldLabel: {
    fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 700,
    color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1.5px',
  },
  fieldInput: {
    padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
    background: 'var(--surface-input)', color: 'var(--text-primary)',
    fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', width: '100%',
    boxSizing: 'border-box',
  },
  closeBtn: {
    width: 30, height: 30, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
  },
  btnSecondary: {
    padding: '9px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'pointer',
    fontSize: 12, fontFamily: 'var(--font-body)',
  },
  btnPrimary: {
    padding: '9px 18px', borderRadius: 'var(--radius-md)', border: 'none',
    background: 'var(--accent-cyan)', color: '#000', cursor: 'pointer',
    fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)',
    boxShadow: 'var(--shadow-glow-cyan)',
  },
}

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
    alignItems: 'center',
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
  gatewayChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    border: '1px solid var(--border-subtle)',
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
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
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
  loadingState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
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
    flexWrap: 'wrap' as const,
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
  },
  deskLocation: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
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
    flexShrink: 0,
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
