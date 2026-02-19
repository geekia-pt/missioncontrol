import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Upload,
  Mic,
  FileText,
  Image,
  Music,
  FileSpreadsheet,
  File,
  Download,
  Check,
  X,
  RotateCcw,
  ChevronDown,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
  Paperclip,
  Tag,
  Zap,
} from 'lucide-react';
import { hubTasks, hubDeliveries, HubTask, HubDelivery } from '../data/mockDataExpanded';
import { getAgentName, getAgentAvatar, agents } from '../data/mockData';

// ── Animation helpers ──
const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4 },
});

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.97 },
};

// ── File type icon helper ──
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText size={14} color="var(--status-error)" />;
    case 'image': return <Image size={14} color="var(--accent-cyan)" />;
    case 'audio': return <Music size={14} color="var(--accent-amber)" />;
    case 'spreadsheet': return <FileSpreadsheet size={14} color="var(--status-online)" />;
    case 'doc': return <FileText size={14} color="var(--accent-cyan)" />;
    default: return <File size={14} color="var(--text-tertiary)" />;
  }
};

// ── Delivery status config ──
const getDeliveryStatusConfig = (status: HubDelivery['status']) => {
  switch (status) {
    case 'para_revisao': return { label: 'Para revisao', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' };
    case 'aprovado': return { label: 'Aprovado', color: 'var(--status-online)', bg: 'rgba(0,200,120,0.08)' };
    case 'rejeitado': return { label: 'Rejeitado', color: 'var(--status-error)', bg: 'rgba(255,60,60,0.08)' };
    case 'entregue_cliente': return { label: 'Entregue ao cliente', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)' };
  }
};

// ── Task status config ──
const getTaskStatusConfig = (status: HubTask['status']) => {
  switch (status) {
    case 'pending': return { label: 'Pendente', color: 'var(--text-tertiary)', bg: 'var(--bg-hover)', icon: Clock };
    case 'in_progress': return { label: 'Em progresso', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)', icon: Loader2 };
    case 'completed': return { label: 'Concluida', color: 'var(--status-online)', bg: 'rgba(0,200,120,0.08)', icon: CheckCircle2 };
  }
};

const Hub: React.FC = () => {
  // ── Form state ──
  const [instruction, setInstruction] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgente'>('normal');
  const [clientTag, setClientTag] = useState('');
  const [projectTag, setProjectTag] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string }[]>([]);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, type: f.type }))]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <motion.div style={styles.header} {...stagger(0)}>
        <div>
          <h2 style={styles.pageTitle}>Hub</h2>
          <p style={styles.pageSubtitle}>Centro de comando -- envia tarefas e recebe entregas</p>
        </div>
        <div style={styles.headerStats}>
          <div style={styles.statChip}>
            <div style={{ ...styles.statDot, background: 'var(--accent-amber)' }} />
            <span>{hubDeliveries.filter(d => d.status === 'para_revisao').length} para revisao</span>
          </div>
          <div style={styles.statChip}>
            <div style={{ ...styles.statDot, background: 'var(--accent-cyan)' }} />
            <span>{hubTasks.filter(t => t.status === 'in_progress').length} em progresso</span>
          </div>
        </div>
      </motion.div>

      {/* ── Main 2-Column Layout ── */}
      <div style={styles.mainGrid}>

        {/* ════════ LEFT SIDE: Enviar Tarefa ════════ */}
        <motion.div style={styles.leftColumn} {...stagger(1)}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <Send size={14} color="var(--accent-cyan)" />
                Enviar Tarefa
              </h3>
            </div>

            {/* Instruction textarea */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>INSTRUCAO</label>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Descreve o que precisas que o agente faca..."
                style={styles.textarea}
                rows={4}
              />
            </div>

            {/* Agent Selector */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>AGENTE</label>
              <div
                style={styles.selectBox}
                onClick={() => setShowAgentDropdown(!showAgentDropdown)}
              >
                {selectedAgent ? (
                  <span style={styles.selectedAgentDisplay}>
                    <span style={{ fontSize: '16px' }}>{selectedAgent.avatar}</span>
                    <span>{selectedAgent.name}</span>
                    <span style={styles.selectedAgentRole}>{selectedAgent.role}</span>
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Selecionar agente...</span>
                )}
                <ChevronDown size={14} color="var(--text-tertiary)" />
              </div>
              <AnimatePresence>
                {showAgentDropdown && (
                  <motion.div
                    style={styles.dropdown}
                    initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    {agents.map(agent => (
                      <div
                        key={agent.id}
                        style={{
                          ...styles.dropdownItem,
                          ...(agent.id === selectedAgentId ? { background: 'var(--accent-cyan-dim)' } : {}),
                        }}
                        onClick={() => { setSelectedAgentId(agent.id); setShowAgentDropdown(false); }}
                      >
                        <span style={{ fontSize: '16px' }}>{agent.avatar}</span>
                        <div style={{ flex: 1 }}>
                          <div style={styles.dropdownName}>{agent.name}</div>
                          <div style={styles.dropdownRole}>{agent.role}</div>
                        </div>
                        <div style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: agent.status === 'online' ? 'var(--status-online)' :
                                     agent.status === 'busy' ? 'var(--status-busy)' :
                                     agent.status === 'error' ? 'var(--status-error)' : 'var(--text-tertiary)',
                        }} />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Priority Toggle */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>PRIORIDADE</label>
              <div style={styles.toggleRow}>
                <button
                  style={{
                    ...styles.toggleBtn,
                    ...(priority === 'normal' ? styles.toggleBtnActive : {}),
                  }}
                  onClick={() => setPriority('normal')}
                >
                  Normal
                </button>
                <button
                  style={{
                    ...styles.toggleBtn,
                    ...(priority === 'urgente' ? styles.toggleBtnUrgent : {}),
                  }}
                  onClick={() => setPriority('urgente')}
                >
                  <Zap size={11} />
                  Urgente
                </button>
              </div>
            </div>

            {/* Client / Project Tags */}
            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.formLabel}>CLIENTE</label>
                <div style={styles.tagInputBox}>
                  <Tag size={12} color="var(--text-tertiary)" />
                  <input
                    type="text"
                    value={clientTag}
                    onChange={(e) => setClientTag(e.target.value)}
                    placeholder="Nome do cliente..."
                    style={styles.tagInput}
                  />
                </div>
              </div>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.formLabel}>PROJETO</label>
                <div style={styles.tagInputBox}>
                  <Tag size={12} color="var(--text-tertiary)" />
                  <input
                    type="text"
                    value={projectTag}
                    onChange={(e) => setProjectTag(e.target.value)}
                    placeholder="Tag do projeto..."
                    style={styles.tagInput}
                  />
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>ANEXOS</label>
              <div
                style={{
                  ...styles.dropZone,
                  ...(isDragOver ? styles.dropZoneActive : {}),
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload size={20} color={isDragOver ? 'var(--accent-cyan)' : 'var(--text-tertiary)'} />
                <div style={styles.dropZoneText}>
                  Arrasta ficheiros ou <span style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }}>clica para escolher</span>
                </div>
                <div style={styles.dropZoneFormats}>
                  <span style={styles.formatTag}><FileText size={10} /> PDF</span>
                  <span style={styles.formatTag}><Image size={10} /> Imagem</span>
                  <span style={styles.formatTag}><Music size={10} /> Audio</span>
                  <span style={styles.formatTag}><FileSpreadsheet size={10} /> Excel</span>
                  <span style={styles.formatTag}><File size={10} /> Doc</span>
                </div>
              </div>
              {/* Attached files list */}
              {attachedFiles.length > 0 && (
                <div style={styles.attachedList}>
                  {attachedFiles.map((file, i) => (
                    <div key={i} style={styles.attachedItem}>
                      <Paperclip size={10} color="var(--text-tertiary)" />
                      <span style={styles.attachedName}>{file.name}</span>
                      <button style={styles.attachedRemove} onClick={() => removeFile(i)}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio button + Submit */}
            <div style={styles.submitRow}>
              <button style={styles.audioBtn}>
                <Mic size={16} />
              </button>
              <button
                style={{
                  ...styles.submitBtn,
                  ...(instruction.trim() && selectedAgentId ? {} : styles.submitBtnDisabled),
                }}
              >
                <Send size={14} />
                Enviar Tarefa
              </button>
            </div>
          </div>

          {/* ── Sent Tasks List ── */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <Clock size={14} color="var(--text-tertiary)" />
                Tarefas enviadas
              </h3>
              <span style={styles.taskCountLabel}>{hubTasks.length} tarefas</span>
            </div>
            <div style={styles.sentTasksList}>
              {hubTasks.map((task, i) => {
                const statusConfig = getTaskStatusConfig(task.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <motion.div
                    key={task.id}
                    style={styles.sentTaskItem}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <div style={styles.sentTaskTop}>
                      <div style={{
                        ...styles.taskStatusBadge,
                        color: statusConfig.color,
                        background: statusConfig.bg,
                      }}>
                        <StatusIcon size={10} style={task.status === 'in_progress' ? { animation: 'spin 1.5s linear infinite' } : {}} />
                        {statusConfig.label}
                      </div>
                      {task.priority === 'urgente' && (
                        <div style={styles.urgentBadge}>
                          <Zap size={9} />
                          URGENTE
                        </div>
                      )}
                      <span style={styles.sentTaskTime}>{task.createdAt}</span>
                    </div>
                    <div style={styles.sentTaskContent}>{task.content}</div>
                    <div style={styles.sentTaskMeta}>
                      <span style={styles.sentTaskAgent}>
                        {getAgentAvatar(task.agentId)} {getAgentName(task.agentId)}
                      </span>
                      {task.attachments.length > 0 && (
                        <span style={styles.sentTaskFiles}>
                          <Paperclip size={10} /> {task.attachments.length} ficheiro{task.attachments.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {task.projectTag && (
                        <span style={styles.sentTaskTag}>{task.projectTag}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ════════ RIGHT SIDE: Entregas ════════ */}
        <motion.div style={styles.rightColumn} {...stagger(2)}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <CheckCircle2 size={14} color="var(--status-online)" />
                Entregas
              </h3>
              <div style={styles.deliveryStats}>
                <span style={styles.deliveryStatItem}>
                  {hubDeliveries.length} total
                </span>
              </div>
            </div>

            <div style={styles.deliveryFeed}>
              {hubDeliveries.map((delivery, i) => {
                const statusConfig = getDeliveryStatusConfig(delivery.status);
                return (
                  <motion.div
                    key={delivery.id}
                    style={styles.deliveryCard}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: i * 0.1, duration: 0.4, type: 'spring', damping: 20 }}
                    whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  >
                    {/* Delivery Header */}
                    <div style={styles.deliveryHeader}>
                      <div style={styles.deliveryAgentInfo}>
                        <div style={styles.deliveryAvatar}>{getAgentAvatar(delivery.agentId)}</div>
                        <div>
                          <div style={styles.deliveryAgentName}>{getAgentName(delivery.agentId)}</div>
                          <div style={styles.deliveryTimestamp}>{delivery.createdAt}</div>
                        </div>
                      </div>
                      <div style={{
                        ...styles.deliveryStatusBadge,
                        color: statusConfig.color,
                        background: statusConfig.bg,
                        borderColor: `${statusConfig.color}30`,
                      }}>
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Delivery Content */}
                    <div style={styles.deliveryTitle}>{delivery.title}</div>
                    <div style={styles.deliveryDesc}>{delivery.description}</div>

                    {/* Attached Files */}
                    {delivery.files.length > 0 && (
                      <div style={styles.deliveryFiles}>
                        {delivery.files.map((file, fi) => (
                          <div key={fi} style={styles.deliveryFileItem}>
                            {getFileIcon(file.type)}
                            <span style={styles.deliveryFileName}>{file.name}</span>
                            <span style={styles.deliveryFileSize}>{file.size}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={styles.deliveryActions}>
                      <button style={styles.actionBtnDownload}>
                        <Download size={12} />
                        Download
                      </button>
                      {delivery.status === 'para_revisao' && (
                        <>
                          <button style={styles.actionBtnApprove}>
                            <Check size={12} />
                            Aprovar
                          </button>
                          <button style={styles.actionBtnReject}>
                            <X size={12} />
                            Rejeitar
                          </button>
                          <button style={styles.actionBtnRevision}>
                            <RotateCcw size={12} />
                            Pedir revisao
                          </button>
                        </>
                      )}
                      {delivery.status === 'aprovado' && (
                        <button style={styles.actionBtnSendClient}>
                          <Send size={12} />
                          Enviar ao cliente
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  // ── Page Layout ──
  page: {
    padding: '24px',
    overflow: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
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
  headerStats: {
    display: 'flex',
    gap: '10px',
  },
  statChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-card)',
    border: '1px solid var(--border-subtle)',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },

  // ── Main Grid ──
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    flex: 1,
    minHeight: 0,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflow: 'auto',
    minHeight: 0,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    minHeight: 0,
  },

  // ── Card Base ──
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

  // ── Form Styles ──
  formGroup: {
    marginBottom: '14px',
    position: 'relative' as const,
  },
  formLabel: {
    display: 'block',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
    marginBottom: '6px',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-input)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    lineHeight: 1.6,
    resize: 'vertical' as const,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  selectBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '9px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-input)',
    border: '1px solid var(--border-default)',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  selectedAgentDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
  },
  selectedAgentRole: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
  },
  dropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 50,
    maxHeight: '240px',
    overflow: 'auto',
    transformOrigin: 'top',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    cursor: 'pointer',
    transition: 'background 0.1s',
    borderBottom: '1px solid var(--border-subtle)',
  },
  dropdownName: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
  },
  dropdownRole: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
  },

  // ── Priority Toggle ──
  toggleRow: {
    display: 'flex',
    gap: '4px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    padding: '3px',
    border: '1px solid var(--border-subtle)',
  },
  toggleBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    padding: '7px 14px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    background: 'transparent',
    color: 'var(--text-tertiary)',
    transition: 'all 0.15s',
  },
  toggleBtnActive: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-sm)',
  },
  toggleBtnUrgent: {
    background: 'rgba(255,60,60,0.12)',
    color: 'var(--status-error)',
    boxShadow: '0 0 12px rgba(255,60,60,0.15)',
  },

  // ── Tag inputs ──
  formRow: {
    display: 'flex',
    gap: '10px',
  },
  tagInputBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-input)',
    border: '1px solid var(--border-default)',
  },
  tagInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
  },

  // ── Drop Zone ──
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    border: '2px dashed var(--border-default)',
    background: 'var(--bg-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dropZoneActive: {
    borderColor: 'var(--accent-cyan)',
    background: 'var(--accent-cyan-dim)',
  },
  dropZoneText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    textAlign: 'center' as const,
  },
  dropZoneFormats: {
    display: 'flex',
    gap: '6px',
    marginTop: '4px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  formatTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    padding: '3px 7px',
    borderRadius: '4px',
    background: 'var(--bg-hover)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  attachedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '8px',
  },
  attachedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
  },
  attachedName: {
    flex: 1,
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  attachedRemove: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: 'none',
    background: 'var(--bg-hover)',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    padding: 0,
  },

  // ── Submit Row ──
  submitRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: '4px',
  },
  audioBtn: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  submitBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-glow-cyan)',
    letterSpacing: '0.3px',
    transition: 'all 0.15s',
  },
  submitBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },

  // ── Sent Tasks ──
  taskCountLabel: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  sentTasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sentTaskItem: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    transition: 'border-color 0.15s',
  },
  sentTaskTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  taskStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  urgentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    padding: '2px 7px',
    borderRadius: '4px',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--status-error)',
    background: 'rgba(255,60,60,0.1)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  sentTaskTime: {
    marginLeft: 'auto',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  sentTaskContent: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
    marginBottom: '8px',
  },
  sentTaskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sentTaskAgent: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
  sentTaskFiles: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  sentTaskTag: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },

  // ── Deliveries ──
  deliveryStats: {
    display: 'flex',
    gap: '8px',
  },
  deliveryStatItem: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  deliveryFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  deliveryCard: {
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    transition: 'all 0.15s',
    cursor: 'default',
  },
  deliveryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  deliveryAgentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  deliveryAvatar: {
    fontSize: '24px',
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryAgentName: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
  },
  deliveryTimestamp: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    marginTop: '1px',
  },
  deliveryStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    border: '1px solid',
    textTransform: 'capitalize' as const,
    letterSpacing: '0.2px',
  },
  deliveryTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    marginBottom: '4px',
  },
  deliveryDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: '12px',
  },
  deliveryFiles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '12px',
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-subtle)',
  },
  deliveryFileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
  },
  deliveryFileName: {
    flex: 1,
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  deliveryFileSize: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },

  // ── Action Buttons ──
  deliveryActions: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  actionBtnDownload: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-hover)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  actionBtnApprove: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(0,200,120,0.1)',
    border: '1px solid rgba(0,200,120,0.2)',
    color: 'var(--status-online)',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  actionBtnReject: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(255,60,60,0.08)',
    border: '1px solid rgba(255,60,60,0.15)',
    color: 'var(--status-error)',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  actionBtnRevision: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-amber-dim)',
    border: '1px solid rgba(255,180,50,0.15)',
    color: 'var(--accent-amber)',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  actionBtnSendClient: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-cyan-dim)',
    border: '1px solid rgba(0,212,255,0.15)',
    color: 'var(--accent-cyan)',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
};

export default Hub;
