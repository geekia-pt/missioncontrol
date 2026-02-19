import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  ChevronRight,
  Briefcase,
  Code2,
  Lightbulb,
  Building2,
  LayoutGrid,
} from 'lucide-react';
import { operationalProjects, OperationalProject } from '../data/mockDataExpanded';
import { getAgentName, getAgentAvatar } from '../data/mockData';

// ── Type Tabs ──
type TypeFilter = 'todos' | 'desenvolvimento' | 'consultoria' | 'aceleracao' | 'imobiliario';
type StatusFilter = 'todos' | 'planeamento' | 'em_andamento' | 'review' | 'concluido';

const TYPE_TABS: { key: TypeFilter; label: string; icon: React.ElementType }[] = [
  { key: 'todos', label: 'Todos', icon: LayoutGrid },
  { key: 'desenvolvimento', label: 'Desenvolvimento', icon: Code2 },
  { key: 'consultoria', label: 'Consultoria', icon: Briefcase },
  { key: 'aceleracao', label: 'Aceleração', icon: Lightbulb },
  { key: 'imobiliario', label: 'Imobiliário', icon: Building2 },
];

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: 'todos', label: 'Todos os Status' },
  { key: 'planeamento', label: 'Planeamento' },
  { key: 'em_andamento', label: 'Em Andamento' },
  { key: 'review', label: 'Review' },
  { key: 'concluido', label: 'Concluído' },
];

// ── Color Helpers ──
const getTypeColor = (type: OperationalProject['type']): string => {
  switch (type) {
    case 'desenvolvimento': return 'var(--accent-cyan)';
    case 'consultoria': return 'var(--accent-amber)';
    case 'aceleracao': return '#22c55e';
    case 'imobiliario': return '#a855f7';
  }
};

const getTypeDimColor = (type: OperationalProject['type']): string => {
  switch (type) {
    case 'desenvolvimento': return 'var(--accent-cyan-dim)';
    case 'consultoria': return 'var(--accent-amber-dim)';
    case 'aceleracao': return 'rgba(34,197,94,0.1)';
    case 'imobiliario': return 'rgba(168,85,247,0.1)';
  }
};

const getTypeLabel = (type: OperationalProject['type']): string => {
  switch (type) {
    case 'desenvolvimento': return 'Dev';
    case 'consultoria': return 'Consultoria';
    case 'aceleracao': return 'Aceleração';
    case 'imobiliario': return 'Imobiliário';
  }
};

const getStatusColor = (status: OperationalProject['status']): string => {
  switch (status) {
    case 'planeamento': return 'var(--text-tertiary)';
    case 'em_andamento': return 'var(--accent-cyan)';
    case 'review': return 'var(--accent-amber)';
    case 'concluido': return 'var(--status-online)';
  }
};

const getStatusLabel = (status: OperationalProject['status']): string => {
  switch (status) {
    case 'planeamento': return 'Planeamento';
    case 'em_andamento': return 'Em Andamento';
    case 'review': return 'Review';
    case 'concluido': return 'Concluído';
  }
};

const formatDate = (dateStr: string): string => {
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// ═══════════════════════════════════════════════
// OPERATIONAL PAGE
// ═══════════════════════════════════════════════
const Operational: React.FC = () => {
  const [activeType, setActiveType] = useState<TypeFilter>('todos');
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('todos');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const filteredProjects = useMemo(() => {
    let result = operationalProjects;
    if (activeType !== 'todos') {
      result = result.filter(p => p.type === activeType);
    }
    if (activeStatus !== 'todos') {
      result = result.filter(p => p.status === activeStatus);
    }
    return result;
  }, [activeType, activeStatus]);

  const totalProjects = operationalProjects.length;
  const avgProgress = Math.round(
    operationalProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects
  );

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerLeft}>
            <h2 style={styles.pageTitle}>Operacional</h2>
            <span style={styles.projectCount}>
              {filteredProjects.length} projeto{filteredProjects.length !== 1 ? 's' : ''}
            </span>
            <div style={styles.avgBadge}>
              <div style={styles.avgBarTrack}>
                <div style={{ ...styles.avgBarFill, width: `${avgProgress}%` }} />
              </div>
              <span style={styles.avgText}>{avgProgress}% avg</span>
            </div>
          </div>
          <button style={styles.btnPrimary}>
            <Plus size={14} /> Novo Projeto
          </button>
        </div>

        {/* ── Filter Bar ── */}
        <div style={styles.filterBar}>
          <div style={styles.typeSelector}>
            {TYPE_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeType === tab.key;
              return (
                <button
                  key={tab.key}
                  style={{
                    ...styles.typeBtn,
                    ...(isActive ? styles.typeBtnActive : {}),
                  }}
                  onClick={() => setActiveType(tab.key)}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ position: 'relative' as const }}>
            <button
              style={{
                ...styles.filterBtn,
                ...(activeStatus !== 'todos' ? styles.filterBtnActive : {}),
              }}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Filter size={13} />
              {activeStatus === 'todos' ? 'Status' : getStatusLabel(activeStatus as OperationalProject['status'])}
            </button>
            <AnimatePresence>
              {showStatusDropdown && (
                <motion.div
                  style={styles.dropdown}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      style={{
                        ...styles.dropdownItem,
                        ...(activeStatus === opt.key ? styles.dropdownItemActive : {}),
                      }}
                      onClick={() => {
                        setActiveStatus(opt.key);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {opt.key !== 'todos' && (
                        <div style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: getStatusColor(opt.key as OperationalProject['status']),
                        }} />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Card Grid ── */}
      <div style={styles.content}>
        <div style={styles.cardGrid}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <div style={styles.emptyState}>
              <LayoutGrid size={32} color="var(--text-tertiary)" />
              <div style={styles.emptyTitle}>Nenhum projeto encontrado</div>
              <div style={styles.emptySubtitle}>
                Ajusta os filtros ou cria um novo projeto.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// PROJECT CARD COMPONENT
// ═══════════════════════════════════════════════
const ProjectCard: React.FC<{ project: OperationalProject; index: number }> = ({ project, index }) => {
  const doneMilestones = project.milestones.filter(m => m.done).length;
  const totalMilestones = project.milestones.length;

  return (
    <motion.div
      style={styles.card}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      layout
    >
      {/* Card Top Row: Name + Type Badge */}
      <div style={styles.cardTopRow}>
        <div style={styles.cardTitleGroup}>
          <div style={styles.cardName}>{project.name}</div>
          <div style={styles.cardClient}>{project.client}</div>
        </div>
        <span style={{
          ...styles.typeBadge,
          color: getTypeColor(project.type),
          background: getTypeDimColor(project.type),
        }}>
          {getTypeLabel(project.type)}
        </span>
      </div>

      {/* Status Badge */}
      <div style={styles.statusRow}>
        <span style={{
          ...styles.statusBadge,
          color: getStatusColor(project.status),
          background: `${getStatusColor(project.status)}12`,
          borderColor: `${getStatusColor(project.status)}30`,
        }}>
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: getStatusColor(project.status),
          }} />
          {getStatusLabel(project.status)}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Progresso</span>
          <span style={{
            ...styles.progressValue,
            color: project.progress >= 70 ? 'var(--status-online)' : project.progress >= 40 ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          }}>
            {project.progress}%
          </span>
        </div>
        <div style={styles.progressTrack}>
          <motion.div
            style={{
              ...styles.progressFill,
              background: project.progress >= 70
                ? 'var(--status-online)'
                : project.progress >= 40
                ? 'var(--accent-cyan)'
                : 'var(--text-tertiary)',
              boxShadow: project.progress >= 40
                ? `0 0 8px ${project.progress >= 70 ? 'var(--status-online)' : 'var(--accent-cyan)'}40`
                : 'none',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.05 + 0.2 }}
          />
        </div>
      </div>

      {/* Agent Responsible */}
      <div style={styles.agentRow}>
        <div style={styles.agentAvatarSmall}>
          {getAgentAvatar(project.agentId)}
        </div>
        <div style={styles.agentInfo}>
          <span style={styles.agentName}>{getAgentName(project.agentId)}</span>
          <span style={styles.agentLabel}>Responsável</span>
        </div>
      </div>

      {/* Milestones Checklist */}
      <div style={styles.milestonesSection}>
        <div style={styles.milestonesHeader}>
          <span style={styles.milestonesLabel}>MILESTONES</span>
          <span style={styles.milestonesCount}>{doneMilestones}/{totalMilestones}</span>
        </div>
        <div style={styles.milestonesList}>
          {project.milestones.map((milestone, i) => (
            <div key={i} style={styles.milestoneItem}>
              {milestone.done ? (
                <CheckCircle2 size={14} color="var(--status-online)" />
              ) : (
                <Circle size={14} color="var(--text-tertiary)" />
              )}
              <span style={{
                ...styles.milestoneText,
                color: milestone.done ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                textDecoration: milestone.done ? 'line-through' : 'none',
              }}>
                {milestone.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dates Footer */}
      <div style={styles.datesRow}>
        <div style={styles.dateItem}>
          <Calendar size={11} color="var(--text-tertiary)" />
          <span style={styles.dateLabel}>Início</span>
          <span style={styles.dateValue}>{formatDate(project.startDate)}</span>
        </div>
        {project.dueDate && (
          <div style={styles.dateItem}>
            <Clock size={11} color="var(--accent-amber)" />
            <span style={styles.dateLabel}>Prazo</span>
            <span style={styles.dateValue}>{formatDate(project.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Hover Action */}
      <div style={styles.cardAction}>
        <ChevronRight size={12} color="var(--accent-cyan)" />
        <span>Ver detalhes</span>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════
const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // ── Header ──
  header: {
    padding: '20px 24px 0 24px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
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
    margin: 0,
  },
  projectCount: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  avgBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 10px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
  },
  avgBarTrack: {
    width: '48px',
    height: '4px',
    borderRadius: '2px',
    background: 'var(--bg-tertiary)',
    overflow: 'hidden',
  },
  avgBarFill: {
    height: '100%',
    borderRadius: '2px',
    background: 'var(--accent-cyan)',
  },
  avgText: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
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

  // ── Filter Bar ──
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
  },
  typeSelector: {
    display: 'flex',
    gap: '2px',
    background: 'var(--bg-secondary)',
    padding: '3px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  typeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
    whiteSpace: 'nowrap' as const,
  },
  typeBtnActive: {
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
    whiteSpace: 'nowrap' as const,
  },
  filterBtnActive: {
    borderColor: 'var(--accent-cyan)',
    color: 'var(--accent-cyan)',
    background: 'var(--accent-cyan-dim)',
  },

  // ── Dropdown ──
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '6px',
    background: 'var(--surface-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    padding: '4px',
    zIndex: 50,
    minWidth: '180px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'background 0.1s',
  },
  dropdownItemActive: {
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
  },

  // ── Content ──
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 24px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '14px',
    alignContent: 'start',
  },

  // ── Project Card ──
  card: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '18px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  cardTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '3px',
  },
  cardClient: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
  },
  typeBadge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },

  // ── Status ──
  statusRow: {
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    border: '1px solid',
  },

  // ── Progress ──
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  progressValue: {
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  },
  progressTrack: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: 'var(--bg-secondary)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
  },

  // ── Agent ──
  agentRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
  },
  agentAvatarSmall: {
    fontSize: '18px',
    lineHeight: 1,
  },
  agentInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  agentName: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  agentLabel: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },

  // ── Milestones ──
  milestonesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  milestonesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestonesLabel: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
  },
  milestonesCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    background: 'var(--bg-hover)',
    padding: '1px 7px',
    borderRadius: '10px',
  },
  milestonesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
  },
  milestoneText: {
    fontSize: '11px',
    lineHeight: 1.3,
  },

  // ── Dates ──
  datesRow: {
    display: 'flex',
    gap: '16px',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-subtle)',
  },
  dateItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  dateLabel: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  dateValue: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },

  // ── Card Action ──
  cardAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-cyan)',
    opacity: 0.6,
    transition: 'opacity 0.15s',
  },

  // ── Empty State ──
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px 20px',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  emptySubtitle: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
};

export default Operational;
