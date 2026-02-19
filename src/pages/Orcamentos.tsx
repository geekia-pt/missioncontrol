import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Hash,
  Euro,
  Package,
  Layers,
} from 'lucide-react';
import { orcamentos, Orcamento } from '../data/mockDataExpanded';

// ── Status Config ──
type OrcamentoStatus = Orcamento['status'];

const STATUS_CONFIG: Record<OrcamentoStatus, { label: string; color: string; bg: string }> = {
  rascunho: {
    label: 'Rascunho',
    color: 'var(--text-tertiary)',
    bg: 'rgba(255,255,255,0.05)',
  },
  enviado: {
    label: 'Enviado',
    color: 'var(--accent-amber)',
    bg: 'var(--accent-amber-dim)',
  },
  aprovado: {
    label: 'Aprovado',
    color: 'var(--status-online)',
    bg: 'rgba(0,255,136,0.08)',
  },
  recusado: {
    label: 'Recusado',
    color: 'var(--status-error)',
    bg: 'rgba(255,68,68,0.08)',
  },
  em_execucao: {
    label: 'Em Execucao',
    color: 'var(--accent-cyan)',
    bg: 'var(--accent-cyan-dim)',
  },
};

const FILTER_OPTIONS: { key: OrcamentoStatus | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'rascunho', label: 'Rascunho' },
  { key: 'enviado', label: 'Enviado' },
  { key: 'aprovado', label: 'Aprovado' },
  { key: 'recusado', label: 'Recusado' },
  { key: 'em_execucao', label: 'Em Execucao' },
];

const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ── Component ──
const Orcamentos: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<OrcamentoStatus | 'todos'>('todos');
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const filteredOrcamentos =
    activeFilter === 'todos'
      ? orcamentos
      : orcamentos.filter((o) => o.status === activeFilter);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleSelect = (orc: Orcamento) => {
    if (selectedOrcamento?.id === orc.id) {
      setSelectedOrcamento(null);
      setExpandedCategories({});
    } else {
      setSelectedOrcamento(orc);
      setExpandedCategories({});
    }
  };

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.titleGroup}>
            <FileText size={20} color="var(--accent-cyan)" />
            <h1 style={styles.title}>Orcamentos</h1>
            <span style={styles.countBadge}>{orcamentos.length}</span>
          </div>
          <button style={styles.btnPrimary}>
            <Plus size={14} />
            Novo Orcamento
          </button>
        </div>

        {/* ── Filter Pills ── */}
        <div style={styles.filterRow}>
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.key;
            const count =
              opt.key === 'todos'
                ? orcamentos.length
                : orcamentos.filter((o) => o.status === opt.key).length;
            return (
              <button
                key={opt.key}
                style={{
                  ...styles.filterPill,
                  ...(isActive ? styles.filterPillActive : {}),
                }}
                onClick={() => {
                  setActiveFilter(opt.key);
                  setSelectedOrcamento(null);
                  setExpandedCategories({});
                }}
              >
                {opt.key !== 'todos' && (
                  <span
                    style={{
                      ...styles.filterDot,
                      background: STATUS_CONFIG[opt.key as OrcamentoStatus].color,
                    }}
                  />
                )}
                {opt.label}
                <span style={styles.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={styles.content}>
        {/* ── Table Header ── */}
        <div style={styles.tableHeader}>
          <span style={{ ...styles.tableHeaderCell, flex: 2 }}>Projeto</span>
          <span style={{ ...styles.tableHeaderCell, flex: 1.5 }}>Cliente</span>
          <span style={{ ...styles.tableHeaderCell, flex: 1, textAlign: 'center' as const }}>
            Estado
          </span>
          <span style={{ ...styles.tableHeaderCell, flex: 1, textAlign: 'right' as const }}>
            Valor Total
          </span>
          <span style={{ ...styles.tableHeaderCell, flex: 0.8, textAlign: 'right' as const }}>
            Data
          </span>
        </div>

        {/* ── List ── */}
        <div style={styles.listContainer}>
          <AnimatePresence mode="wait">
            {filteredOrcamentos.length === 0 ? (
              <motion.div
                key="empty"
                style={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Layers size={32} color="var(--text-tertiary)" />
                <span style={styles.emptyText}>Sem orcamentos neste estado</span>
              </motion.div>
            ) : (
              filteredOrcamentos.map((orc, i) => {
                const statusCfg = STATUS_CONFIG[orc.status];
                const isSelected = selectedOrcamento?.id === orc.id;

                return (
                  <React.Fragment key={orc.id}>
                    <motion.div
                      style={{
                        ...styles.row,
                        ...(isSelected ? styles.rowSelected : {}),
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.05, duration: 0.25 }}
                      whileHover={{
                        background: isSelected
                          ? 'var(--accent-cyan-dim)'
                          : 'var(--bg-hover)',
                      }}
                      onClick={() => handleSelect(orc)}
                    >
                      {/* Project Name */}
                      <div style={{ ...styles.rowCell, flex: 2 }}>
                        <div style={styles.projectInfo}>
                          <motion.div
                            animate={{ rotate: isSelected ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={styles.expandIcon}
                          >
                            <ChevronRight
                              size={14}
                              color={isSelected ? 'var(--accent-cyan)' : 'var(--text-tertiary)'}
                            />
                          </motion.div>
                          <div>
                            <div style={styles.projectName}>{orc.projectName}</div>
                            <div style={styles.projectId}>
                              <Hash size={9} />
                              {orc.id}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Client */}
                      <div style={{ ...styles.rowCell, flex: 1.5 }}>
                        <div style={styles.clientInfo}>
                          <User size={12} color="var(--text-tertiary)" />
                          <span style={styles.clientName}>{orc.clientName}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        style={{
                          ...styles.rowCell,
                          flex: 1,
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            ...styles.statusBadge,
                            color: statusCfg.color,
                            background: statusCfg.bg,
                            borderColor: statusCfg.color,
                          }}
                        >
                          <span
                            style={{
                              ...styles.statusDot,
                              background: statusCfg.color,
                            }}
                          />
                          {statusCfg.label}
                        </span>
                      </div>

                      {/* Value */}
                      <div
                        style={{
                          ...styles.rowCell,
                          flex: 1,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <span style={styles.valueText}>
                          <Euro size={12} color="var(--text-tertiary)" />
                          {formatCurrency(orc.totalValue)}
                        </span>
                      </div>

                      {/* Date */}
                      <div
                        style={{
                          ...styles.rowCell,
                          flex: 0.8,
                          justifyContent: 'flex-end',
                        }}
                      >
                        <span style={styles.dateText}>
                          <Calendar size={11} color="var(--text-tertiary)" />
                          {formatDate(orc.createdAt)}
                        </span>
                      </div>
                    </motion.div>

                    {/* ── Expandable Detail ── */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          key={`detail-${orc.id}`}
                          style={styles.detailPanel}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div style={styles.detailInner}>
                            {/* Detail Header */}
                            <div style={styles.detailHeader}>
                              <div style={styles.detailHeaderLeft}>
                                <Package size={16} color="var(--accent-cyan)" />
                                <span style={styles.detailTitle}>
                                  Categorias de Orcamento
                                </span>
                              </div>
                              <div style={styles.detailHeaderRight}>
                                <span style={styles.categoriesCount}>
                                  {orc.categories.length} categorias
                                </span>
                              </div>
                            </div>

                            {orc.categories.length === 0 ? (
                              <div style={styles.noCategories}>
                                <Layers size={20} color="var(--text-tertiary)" />
                                <span style={styles.noCategoriesText}>
                                  Sem categorias definidas para este orcamento.
                                  <br />
                                  Adicione itens ao rascunho para ver o detalhe.
                                </span>
                              </div>
                            ) : (
                              <>
                                {/* Category Sections */}
                                {orc.categories.map((cat, catIdx) => {
                                  const catKey = `${orc.id}-${cat.name}`;
                                  const isExpanded = expandedCategories[catKey] !== false;

                                  return (
                                    <motion.div
                                      key={catKey}
                                      style={styles.categorySection}
                                      initial={{ opacity: 0, x: -8 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: catIdx * 0.08 }}
                                    >
                                      {/* Category Header */}
                                      <div
                                        style={styles.categoryHeader}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleCategory(catKey);
                                        }}
                                      >
                                        <div style={styles.categoryLeft}>
                                          <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                          >
                                            <ChevronDown
                                              size={14}
                                              color="var(--text-tertiary)"
                                            />
                                          </motion.div>
                                          <span style={styles.categoryName}>{cat.name}</span>
                                          <span style={styles.categoryItemCount}>
                                            {cat.items.length} itens
                                          </span>
                                        </div>
                                        <span style={styles.categorySubtotal}>
                                          {formatCurrency(cat.subtotal)}
                                        </span>
                                      </div>

                                      {/* Category Items Table */}
                                      <AnimatePresence>
                                        {isExpanded && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={styles.categoryBody}
                                          >
                                            {/* Items Table Header */}
                                            <div style={styles.itemsTableHeader}>
                                              <span
                                                style={{
                                                  ...styles.itemsHeaderCell,
                                                  flex: 3,
                                                }}
                                              >
                                                Descricao
                                              </span>
                                              <span
                                                style={{
                                                  ...styles.itemsHeaderCell,
                                                  flex: 1,
                                                  textAlign: 'center' as const,
                                                }}
                                              >
                                                Qtd.
                                              </span>
                                              <span
                                                style={{
                                                  ...styles.itemsHeaderCell,
                                                  flex: 1,
                                                  textAlign: 'right' as const,
                                                }}
                                              >
                                                P. Unit.
                                              </span>
                                              <span
                                                style={{
                                                  ...styles.itemsHeaderCell,
                                                  flex: 1,
                                                  textAlign: 'right' as const,
                                                }}
                                              >
                                                Total
                                              </span>
                                            </div>

                                            {/* Items Rows */}
                                            {cat.items.map((item, itemIdx) => (
                                              <motion.div
                                                key={`${catKey}-${itemIdx}`}
                                                style={styles.itemRow}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                  delay: itemIdx * 0.04,
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    ...styles.itemCell,
                                                    flex: 3,
                                                  }}
                                                >
                                                  {item.description}
                                                </span>
                                                <span
                                                  style={{
                                                    ...styles.itemCell,
                                                    ...styles.itemCellMono,
                                                    flex: 1,
                                                    textAlign: 'center' as const,
                                                  }}
                                                >
                                                  {item.quantity}
                                                </span>
                                                <span
                                                  style={{
                                                    ...styles.itemCell,
                                                    ...styles.itemCellMono,
                                                    flex: 1,
                                                    textAlign: 'right' as const,
                                                  }}
                                                >
                                                  {formatCurrency(item.unitPrice)}
                                                </span>
                                                <span
                                                  style={{
                                                    ...styles.itemCell,
                                                    ...styles.itemCellMono,
                                                    ...styles.itemCellTotal,
                                                    flex: 1,
                                                    textAlign: 'right' as const,
                                                  }}
                                                >
                                                  {formatCurrency(item.total)}
                                                </span>
                                              </motion.div>
                                            ))}

                                            {/* Category Subtotal */}
                                            <div style={styles.subtotalRow}>
                                              <span style={styles.subtotalLabel}>
                                                Subtotal {cat.name}
                                              </span>
                                              <span style={styles.subtotalValue}>
                                                {formatCurrency(cat.subtotal)}
                                              </span>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </motion.div>
                                  );
                                })}

                                {/* ── Grand Total ── */}
                                <motion.div
                                  style={styles.grandTotalRow}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: orc.categories.length * 0.08 + 0.1 }}
                                >
                                  <div style={styles.grandTotalLeft}>
                                    <Euro size={16} color="var(--accent-cyan)" />
                                    <span style={styles.grandTotalLabel}>Total do Orcamento</span>
                                  </div>
                                  <span style={styles.grandTotalValue}>
                                    {formatCurrency(orc.totalValue)}
                                  </span>
                                </motion.div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Summary Bar ── */}
      <div style={styles.summaryBar}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Orcamentos</span>
          <span style={styles.summaryValue}>{orcamentos.length}</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Valor Total</span>
          <span style={styles.summaryValueHighlight}>
            {formatCurrency(orcamentos.reduce((sum, o) => sum + o.totalValue, 0))}
          </span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Aprovados</span>
          <span style={{ ...styles.summaryValue, color: 'var(--status-online)' }}>
            {formatCurrency(
              orcamentos
                .filter((o) => o.status === 'aprovado')
                .reduce((sum, o) => sum + o.totalValue, 0)
            )}
          </span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Pendentes</span>
          <span style={{ ...styles.summaryValue, color: 'var(--accent-amber)' }}>
            {formatCurrency(
              orcamentos
                .filter((o) => o.status === 'enviado' || o.status === 'rascunho')
                .reduce((sum, o) => sum + o.totalValue, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Styles ──
const styles: Record<string, React.CSSProperties> = {
  // Page
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Header
  header: {
    padding: '20px 24px 0 24px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  countBadge: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--accent-cyan)',
    background: 'var(--accent-cyan-dim)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 18px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-glow-cyan)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },

  // Filters
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingBottom: '14px',
    overflowX: 'auto',
  },
  filterPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid var(--border-default)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
  },
  filterPillActive: {
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
    borderColor: 'var(--accent-cyan)',
  },
  filterDot: {
    display: 'inline-block',
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
  },
  filterCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    background: 'var(--bg-hover)',
    padding: '1px 5px',
    borderRadius: '8px',
    marginLeft: '2px',
  },

  // Content
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '0 24px',
  },

  // Table Header
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    position: 'sticky' as const,
    top: 0,
    background: 'var(--bg-primary)',
    zIndex: 5,
  },
  tableHeaderCell: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
  },

  // List
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '60px 20px',
  },
  emptyText: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-body)',
  },

  // Row
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  rowSelected: {
    background: 'var(--accent-cyan-dim)',
    borderColor: 'var(--accent-cyan)',
  },
  rowCell: {
    display: 'flex',
    alignItems: 'center',
  },

  // Project
  projectInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  expandIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  projectName: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
  },
  projectId: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },

  // Client
  clientInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  clientName: {
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)',
  },

  // Status Badge
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    border: '1px solid',
    borderWidth: '1px',
    lineHeight: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    flexShrink: 0,
  },

  // Value
  valueText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },

  // Date
  dateText: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },

  // ── Detail Panel ──
  detailPanel: {
    overflow: 'hidden',
    borderBottom: '1px solid var(--border-default)',
  },
  detailInner: {
    padding: '16px 20px 20px 44px',
    background: 'var(--bg-secondary)',
    borderLeft: '3px solid var(--accent-cyan)',
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  detailHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  detailTitle: {
    fontSize: '13px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  detailHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoriesCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    background: 'var(--bg-hover)',
    padding: '3px 8px',
    borderRadius: '8px',
  },

  // No Categories
  noCategories: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '32px 20px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-tertiary)',
    border: '1px dashed var(--border-default)',
  },
  noCategoriesText: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-body)',
    textAlign: 'center' as const,
    lineHeight: 1.6,
  },

  // Category
  categorySection: {
    marginBottom: '8px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-card)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryName: {
    fontSize: '13px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  categoryItemCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    background: 'var(--bg-hover)',
    padding: '1px 6px',
    borderRadius: '8px',
  },
  categorySubtotal: {
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--accent-cyan)',
  },

  // Items Table
  categoryBody: {
    overflow: 'hidden',
  },
  itemsTableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderTop: '1px solid var(--border-subtle)',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--bg-tertiary)',
  },
  itemsHeaderCell: {
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background 0.1s',
  },
  itemCell: {
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)',
  },
  itemCellMono: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  itemCellTotal: {
    fontWeight: 600,
    color: 'var(--text-primary)',
  },

  // Subtotal
  subtotalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'var(--bg-tertiary)',
    borderTop: '1px solid var(--border-default)',
  },
  subtotalLabel: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  subtotalValue: {
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--accent-cyan)',
  },

  // Grand Total
  grandTotalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px',
    marginTop: '12px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-void)',
    border: '1px solid var(--accent-cyan)',
    boxShadow: 'var(--shadow-glow-cyan)',
  },
  grandTotalLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  grandTotalLabel: {
    fontSize: '14px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  grandTotalValue: {
    fontSize: '20px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--accent-cyan)',
  },

  // ── Summary Bar ──
  summaryBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
    borderTop: '1px solid var(--border-subtle)',
    background: 'var(--bg-primary)',
    gap: '20px',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  summaryLabel: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  summaryValue: {
    fontSize: '14px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  summaryValueHighlight: {
    fontSize: '14px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--accent-cyan)',
  },
  summaryDivider: {
    width: 1,
    height: 20,
    background: 'var(--border-default)',
  },
};

export default Orcamentos;
