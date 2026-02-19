import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Filter,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  ChevronRight,
  DollarSign,
  Globe,
  User,
} from 'lucide-react';
import {
  leads, campaigns, Lead,
  getAgentName, getAgentAvatar,
} from '../data/mockData';

const STAGES: { key: Lead['stage']; label: string; color: string }[] = [
  { key: 'novo', label: 'Novo', color: 'var(--text-tertiary)' },
  { key: 'contato', label: 'Contato Feito', color: 'var(--accent-amber)' },
  { key: 'proposta', label: 'Proposta', color: 'var(--accent-cyan)' },
  { key: 'fechado', label: 'Fechado', color: 'var(--status-online)' },
];

const PIPELINES = ['Todos', 'Serviços', 'Imóveis'];

const CRM: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activePipeline, setActivePipeline] = useState('Todos');

  const filteredLeads = activePipeline === 'Todos'
    ? leads
    : leads.filter(l => l.pipeline === activePipeline);

  const interactionIcons: Record<string, React.ReactNode> = {
    email: <Mail size={12} color="var(--accent-cyan)" />,
    whatsapp: <MessageCircle size={12} color="var(--status-online)" />,
    call: <Phone size={12} color="var(--accent-amber)" />,
    note: <FileText size={12} color="var(--text-secondary)" />,
  };

  const commercialCampaigns = campaigns.filter(c => c.department === 'comercial' || c.status === 'running');

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.filterRow}>
          <div style={styles.pipelineSelector}>
            {PIPELINES.map(p => (
              <button
                key={p}
                style={{
                  ...styles.pipelineBtn,
                  ...(activePipeline === p ? styles.pipelineBtnActive : {}),
                }}
                onClick={() => setActivePipeline(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <button style={styles.filterBtn}>
            <Filter size={13} /> Etapa
          </button>
          <div style={{ flex: 1 }} />
          <button style={styles.btnPrimary}>
            <Plus size={14} /> Novo Lead
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={styles.mainContent}>
        {/* ── Pipeline Board ── */}
        <div style={styles.pipelineBoard}>
          <div style={styles.kanban}>
            {STAGES.map(stage => {
              const stageLeads = filteredLeads.filter(l => l.stage === stage.key);
              const stageValue = stageLeads.reduce((sum, l) => sum + l.value, 0);
              return (
                <div key={stage.key} style={styles.kanbanCol}>
                  <div style={styles.kanbanHeader}>
                    <div style={{ ...styles.stageDot, background: stage.color }} />
                    <span style={styles.kanbanTitle}>{stage.label}</span>
                    <span style={styles.kanbanCount}>{stageLeads.length}</span>
                  </div>
                  <div style={styles.stageValue}>
                    €{stageValue.toLocaleString()}
                  </div>
                  <div style={styles.kanbanCards}>
                    {stageLeads.map((lead, i) => (
                      <motion.div
                        key={lead.id}
                        style={{
                          ...styles.leadCard,
                          ...(selectedLead?.id === lead.id ? styles.leadCardSelected : {}),
                        }}
                        onClick={() => setSelectedLead(lead)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ y: -2 }}
                      >
                        <div style={styles.leadName}>{lead.name}</div>
                        <div style={styles.leadOrigin}>
                          <Globe size={10} /> {lead.origin}
                        </div>
                        <div style={styles.leadBottom}>
                          <span style={styles.leadValue}>
                            <DollarSign size={10} />
                            €{lead.value.toLocaleString()}
                          </span>
                          <span style={styles.leadAgent}>
                            {getAgentAvatar(lead.agentId)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Lead Detail Panel ── */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              style={styles.detailPanel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Contact Info */}
              <div style={styles.detailHeader}>
                <div style={styles.detailAvatar}>
                  <User size={20} color="var(--text-secondary)" />
                </div>
                <div>
                  <div style={styles.detailName}>{selectedLead.name}</div>
                  <div style={styles.detailPipeline}>{selectedLead.pipeline}</div>
                </div>
              </div>

              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>CONTACTO</div>
                <div style={styles.contactRow}>
                  <Mail size={12} color="var(--text-tertiary)" />
                  <span>{selectedLead.email}</span>
                </div>
                <div style={styles.contactRow}>
                  <MessageCircle size={12} color="var(--text-tertiary)" />
                  <span>{selectedLead.whatsapp}</span>
                </div>
                <div style={styles.contactRow}>
                  <Globe size={12} color="var(--text-tertiary)" />
                  <span>Origem: {selectedLead.origin}</span>
                </div>
              </div>

              {/* Timeline */}
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>TIMELINE</div>
                <div style={styles.timeline}>
                  {selectedLead.interactions.length === 0 ? (
                    <div style={styles.noInteractions}>Sem interações ainda</div>
                  ) : (
                    selectedLead.interactions.map(int => (
                      <div key={int.id} style={styles.timelineItem}>
                        <div style={styles.timelineIcon}>
                          {interactionIcons[int.type]}
                        </div>
                        <div style={styles.timelineContent}>
                          <div style={styles.timelineText}>{int.content}</div>
                          <div style={styles.timelineMeta}>
                            {getAgentAvatar(int.agentId)} {getAgentName(int.agentId)} · {int.date}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Next Action */}
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>PRÓXIMA AÇÃO SUGERIDA</div>
                <div style={styles.suggestedAction}>
                  <ChevronRight size={12} color="var(--accent-cyan)" />
                  {selectedLead.stage === 'novo' && 'Enviar email de introdução'}
                  {selectedLead.stage === 'contato' && 'Agendar demo / chamada'}
                  {selectedLead.stage === 'proposta' && 'Follow-up sobre proposta'}
                  {selectedLead.stage === 'fechado' && 'Iniciar onboarding'}
                </div>
              </div>

              {/* Actions */}
              <div style={styles.detailActions}>
                <button style={styles.actionBtn}>
                  <MessageCircle size={13} /> Chat WhatsApp
                </button>
                <button style={styles.actionBtn}>
                  <Mail size={13} /> Enviar e-mail
                </button>
                <button style={styles.actionBtnHighlight}>
                  <FileText size={13} /> Gerar proposta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom: Commercial Campaigns ── */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomTitle}>Campanhas Comerciais em execução</div>
        <div style={styles.campaignChips}>
          {commercialCampaigns.slice(0, 4).map(c => (
            <div key={c.id} style={styles.campaignChip}>
              <div style={{
                ...styles.chipStatus,
                background: c.status === 'running' ? 'var(--status-online)' : 'var(--accent-amber)',
              }} />
              <span style={styles.chipName}>{c.name}</span>
              <span style={styles.chipMeta}>{c.leadsGenerated} leads</span>
            </div>
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
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  pipelineSelector: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg-secondary)',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  pipelineBtn: {
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
  },
  pipelineBtnActive: {
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
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
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  pipelineBoard: {
    flex: 1,
    overflow: 'auto',
    padding: '16px 24px',
  },
  kanban: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    height: '100%',
  },
  kanbanCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  kanbanHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '8px',
    borderBottom: '2px solid var(--border-subtle)',
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
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
    marginLeft: 'auto',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    background: 'var(--bg-hover)',
    padding: '1px 6px',
    borderRadius: '10px',
  },
  stageValue: {
    fontSize: '14px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  kanbanCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  leadCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  leadCardSelected: {
    borderColor: 'var(--accent-cyan)',
    background: 'var(--accent-cyan-dim)',
  },
  leadName: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  leadOrigin: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
    marginBottom: '8px',
  },
  leadBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadValue: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--status-online)',
  },
  leadAgent: {
    fontSize: '14px',
  },
  // ── Detail Panel ──
  detailPanel: {
    width: '340px',
    minWidth: '340px',
    borderLeft: '1px solid var(--border-subtle)',
    overflow: 'auto',
    background: 'var(--bg-primary)',
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  detailAvatar: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailName: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  detailPipeline: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
    marginTop: '2px',
  },
  detailSection: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  detailLabel: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: '10px',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    padding: '4px 0',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  noInteractions: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    padding: '16px',
  },
  timelineItem: {
    display: 'flex',
    gap: '10px',
  },
  timelineIcon: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  timelineContent: {
    flex: 1,
  },
  timelineText: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.4,
  },
  timelineMeta: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    marginTop: '3px',
  },
  suggestedAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 12px',
    background: 'var(--accent-cyan-dim)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(0,212,255,0.1)',
    fontSize: '12px',
    color: 'var(--accent-cyan)',
  },
  detailActions: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
  actionBtnHighlight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--accent-cyan)',
    border: 'none',
    color: '#000',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-glow-cyan)',
  },
  // ── Bottom Bar ──
  bottomBar: {
    padding: '12px 24px',
    borderTop: '1px solid var(--border-subtle)',
    background: 'var(--bg-primary)',
  },
  bottomTitle: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  campaignChips: {
    display: 'flex',
    gap: '8px',
  },
  campaignChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  chipStatus: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },
  chipName: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    fontWeight: 500,
  },
  chipMeta: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
};

export default CRM;
