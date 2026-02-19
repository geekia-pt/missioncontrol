import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  MapPin,
  Tag,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  X,
  BarChart3,
  Briefcase,
} from 'lucide-react';
import { estudosMercado, EstudoMercado, clientWorkspaces } from '../data/mockDataExpanded';
import { getAgentName, getAgentAvatar } from '../data/mockData';

// ── Types ──
type StatusFilter = 'todos' | EstudoMercado['status'];

// ── Helpers ──
const statusConfig: Record<EstudoMercado['status'], { label: string; color: string; bg: string; icon: React.ElementType }> = {
  em_pesquisa: { label: 'Em Pesquisa', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)', icon: Search },
  rascunho: { label: 'Rascunho', color: 'var(--text-tertiary)', bg: 'var(--bg-hover)', icon: FileText },
  completo: { label: 'Completo', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)', icon: CheckCircle2 },
  entregue: { label: 'Entregue', color: 'var(--status-online)', bg: 'rgba(0,255,136,0.08)', icon: Send },
};

const filterOptions: { key: StatusFilter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'em_pesquisa', label: 'Em Pesquisa' },
  { key: 'rascunho', label: 'Rascunho' },
  { key: 'completo', label: 'Completo' },
  { key: 'entregue', label: 'Entregue' },
];

const getClientName = (clientId?: string): string | undefined => {
  if (!clientId) return undefined;
  return clientWorkspaces.find(c => c.id === clientId)?.name;
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4 },
});

// ── Study Card ──
const StudyCard: React.FC<{ estudo: EstudoMercado; index: number; isExpanded: boolean; onToggle: () => void }> = ({
  estudo,
  index,
  isExpanded,
  onToggle,
}) => {
  const status = statusConfig[estudo.status];
  const StatusIcon = status.icon;
  const clientName = getClientName(estudo.clientId);
  const hasFindings = estudo.keyFindings && estudo.keyFindings.length > 0;

  return (
    <motion.div
      style={{
        ...styles.studyCard,
        borderColor: isExpanded ? 'var(--accent-cyan)' : 'var(--border-subtle)',
      }}
      {...stagger(index + 2)}
      layout
      onClick={onToggle}
      whileHover={{ borderColor: 'var(--border-default)' }}
    >
      {/* Card Top */}
      <div style={styles.cardTop}>
        <div style={styles.cardTitleRow}>
          <h3 style={styles.studyTitle}>{estudo.title}</h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={styles.expandIcon}
          >
            <ChevronDown size={16} color="var(--text-tertiary)" />
          </motion.div>
        </div>

        {/* Badges Row */}
        <div style={styles.badgesRow}>
          <div style={styles.badgeZone}>
            <MapPin size={10} />
            {estudo.zone}
          </div>
          <div style={styles.badgeSegment}>
            <Tag size={10} />
            {estudo.segment}
          </div>
          <div style={{ ...styles.badgeStatus, color: status.color, background: status.bg }}>
            <StatusIcon size={10} />
            {status.label}
          </div>
        </div>
      </div>

      {/* Card Meta */}
      <div style={styles.cardMeta}>
        <div style={styles.metaItem}>
          <User size={12} color="var(--text-tertiary)" />
          <span style={styles.metaAgent}>
            {getAgentAvatar(estudo.agentId)} {getAgentName(estudo.agentId)}
          </span>
        </div>
        <div style={styles.metaItem}>
          <Calendar size={12} color="var(--text-tertiary)" />
          <span style={styles.metaDate}>{estudo.createdAt}</span>
        </div>
        {clientName && (
          <div style={styles.metaItem}>
            <Briefcase size={12} color="var(--text-tertiary)" />
            <span style={styles.metaClient}>{clientName}</span>
          </div>
        )}
      </div>

      {/* Key Findings (always visible if present, compact) */}
      {hasFindings && !isExpanded && (
        <div style={styles.findingsPreview}>
          <TrendingUp size={11} color="var(--accent-cyan)" />
          <span style={styles.findingsPreviewText}>
            {estudo.keyFindings!.length} insight{estudo.keyFindings!.length !== 1 ? 's' : ''} disponivel
          </span>
        </div>
      )}

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={styles.expandedSection}
          >
            <div style={styles.expandedDivider} />

            {/* Key Findings */}
            {hasFindings && (
              <div style={styles.findingsSection}>
                <div style={styles.findingsSectionTitle}>
                  <BarChart3 size={13} color="var(--accent-cyan)" />
                  Key Findings
                </div>
                <ul style={styles.findingsList}>
                  {estudo.keyFindings!.map((finding, i) => (
                    <li key={i} style={styles.findingItem}>
                      <div style={styles.findingBullet} />
                      <span style={styles.findingText}>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Details Grid */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>ID</span>
                <span style={styles.detailValue}>{estudo.id}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Zona</span>
                <span style={styles.detailValue}>{estudo.zone}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Segmento</span>
                <span style={styles.detailValue}>{estudo.segment}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Agente</span>
                <span style={styles.detailValue}>
                  {getAgentAvatar(estudo.agentId)} {getAgentName(estudo.agentId)}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Data</span>
                <span style={styles.detailValue}>{estudo.createdAt}</span>
              </div>
              {clientName && (
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Cliente</span>
                  <span style={styles.detailValue}>{clientName}</span>
                </div>
              )}
            </div>

            {/* No findings message */}
            {!hasFindings && (
              <div style={styles.noFindings}>
                <Clock size={14} color="var(--text-tertiary)" />
                <span>Insights ainda em recolha. O estudo esta em andamento.</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main Page ──
const EstudosMercado: React.FC = () => {
  const [filter, setFilter] = useState<StatusFilter>('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'todos'
    ? estudosMercado
    : estudosMercado.filter(e => e.status === filter);

  const countByStatus = (status: EstudoMercado['status']) =>
    estudosMercado.filter(e => e.status === status).length;

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <motion.div style={styles.header} {...stagger(0)}>
        <div>
          <h2 style={styles.pageTitle}>Estudos de Mercado</h2>
          <p style={styles.pageSubtitle}>
            {estudosMercado.length} estudos | {countByStatus('em_pesquisa')} em pesquisa | {countByStatus('completo') + countByStatus('entregue')} concluidos
          </p>
        </div>
        <button style={styles.btnPrimary}>
          <Plus size={14} />
          Novo Estudo
        </button>
      </motion.div>

      {/* ── Status Filter Tabs ── */}
      <motion.div style={styles.filterBar} {...stagger(1)}>
        {filterOptions.map(opt => {
          const isActive = filter === opt.key;
          const count = opt.key === 'todos'
            ? estudosMercado.length
            : countByStatus(opt.key as EstudoMercado['status']);

          return (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              style={{
                ...styles.filterTab,
                ...(isActive ? styles.filterTabActive : {}),
              }}
            >
              {opt.key !== 'todos' && (
                <div
                  style={{
                    ...styles.filterDot,
                    background: statusConfig[opt.key as EstudoMercado['status']].color,
                  }}
                />
              )}
              {opt.label}
              <span style={{
                ...styles.filterCount,
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ── Study Cards Grid ── */}
      <div style={styles.studyGrid}>
        {filtered.length > 0 ? (
          filtered.map((estudo, i) => (
            <StudyCard
              key={estudo.id}
              estudo={estudo}
              index={i}
              isExpanded={expandedId === estudo.id}
              onToggle={() => setExpandedId(expandedId === estudo.id ? null : estudo.id)}
            />
          ))
        ) : (
          <motion.div
            style={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search size={36} color="var(--text-tertiary)" />
            <div style={styles.emptyTitle}>Nenhum estudo encontrado</div>
            <div style={styles.emptyDesc}>
              Nao existem estudos com o filtro selecionado.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ── Styles ──
const styles: Record<string, React.CSSProperties> = {
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
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    fontFamily: 'var(--font-mono)',
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
    whiteSpace: 'nowrap' as const,
  },

  // ── Filters ──
  filterBar: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    overflow: 'auto',
  },
  filterTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  },
  filterTabActive: {
    background: 'var(--accent-cyan-dim)',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
  },
  filterCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },

  // ── Study Grid ──
  studyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '16px',
  },

  // ── Study Card ──
  studyCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  cardTop: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  studyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.3,
  },
  expandIcon: {
    flexShrink: 0,
    width: 24,
    height: 24,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Badges ──
  badgesRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  badgeZone: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--accent-cyan)',
    background: 'var(--accent-cyan-dim)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  badgeSegment: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    background: 'var(--bg-hover)',
    letterSpacing: '0.3px',
  },
  badgeStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },

  // ── Card Meta ──
  cardMeta: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '12px',
    alignItems: 'center',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  metaAgent: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  metaDate: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  metaClient: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },

  // ── Findings Preview ──
  findingsPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-cyan-dim)',
    marginTop: '2px',
  },
  findingsPreviewText: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-cyan)',
    fontWeight: 500,
  },

  // ── Expanded Section ──
  expandedSection: {
    overflow: 'hidden',
  },
  expandedDivider: {
    height: 1,
    background: 'var(--border-subtle)',
    margin: '4px 0 16px',
  },

  // ── Key Findings ──
  findingsSection: {
    marginBottom: '16px',
  },
  findingsSectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-display)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  findingsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  findingItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)',
    borderLeft: '2px solid var(--accent-cyan)',
  },
  findingBullet: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: 'var(--accent-cyan)',
    flexShrink: 0,
    marginTop: '5px',
  },
  findingText: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    lineHeight: 1.5,
  },

  // ── Details Grid ──
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '3px',
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)',
  },
  detailLabel: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '12px',
    color: 'var(--text-primary)',
    fontWeight: 500,
  },

  // ── No Findings ──
  noFindings: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    borderLeft: '3px solid var(--accent-amber)',
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic' as const,
  },

  // ── Empty State ──
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '60px 40px',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    gap: '12px',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  emptyDesc: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    maxWidth: '300px',
  },
};

export default EstudosMercado;
