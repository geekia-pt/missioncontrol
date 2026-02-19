import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Coins,
  Euro,
  Zap,
  Users,
  Cog,
  Heart,
  BookOpen,
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  Database,
  Eye,
  Calendar,
  Tag,
  ChevronDown,
  X,
} from 'lucide-react';
import { memoryEntries, memoryStats, MemoryEntry } from '../data/mockDataExpanded';
import { getAgentName, getAgentAvatar } from '../data/mockData';

// ── Animation helpers ──
const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4 },
});

const listStagger = (i: number) => ({
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { delay: 0.3 + i * 0.05, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

// ── Category config ──
type CategoryKey = 'client' | 'process' | 'preference' | 'knowledge';

const categoryConfig: Record<CategoryKey, { label: string; icon: React.FC<any>; color: string; dim: string }> = {
  client: {
    label: 'Client',
    icon: Users,
    color: 'var(--accent-cyan)',
    dim: 'var(--accent-cyan-dim)',
  },
  process: {
    label: 'Process',
    icon: Cog,
    color: 'var(--accent-amber)',
    dim: 'var(--accent-amber-dim)',
  },
  preference: {
    label: 'Preference',
    icon: Heart,
    color: 'var(--comercial-color)',
    dim: 'var(--comercial-dim)',
  },
  knowledge: {
    label: 'Knowledge',
    icon: BookOpen,
    color: 'var(--marketing-color)',
    dim: 'var(--marketing-dim)',
  },
};

// ── Token formatter ──
const formatTokens = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

// ── Tab type ──
type TabKey = 'all' | CategoryKey;

const Memory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  // Gather unique agent IDs from memory entries
  const uniqueAgentIds = useMemo(() => {
    const ids = new Set(memoryEntries.map(m => m.agentId));
    return Array.from(ids);
  }, []);

  // Filter logic
  const filteredEntries = useMemo(() => {
    let entries = [...memoryEntries];
    if (activeTab !== 'all') {
      entries = entries.filter(e => e.category === activeTab);
    }
    if (agentFilter) {
      entries = entries.filter(e => e.agentId === agentFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(
        e =>
          e.content.toLowerCase().includes(q) ||
          e.source.toLowerCase().includes(q)
      );
    }
    return entries;
  }, [activeTab, agentFilter, searchQuery]);

  // Max access count for proportional bars
  const maxAccess = useMemo(
    () => Math.max(...memoryEntries.map(m => m.accessCount), 1),
    []
  );

  // Category total for proportion bars
  const categoryTotal = memoryStats.categoryCounts.client
    + memoryStats.categoryCounts.process
    + memoryStats.categoryCounts.preference
    + memoryStats.categoryCounts.knowledge;

  // ── Tab definitions ──
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'client', label: 'Client' },
    { key: 'process', label: 'Process' },
    { key: 'preference', label: 'Preference' },
    { key: 'knowledge', label: 'Knowledge' },
  ];

  // ── KPI cards data ──
  const kpis = [
    {
      label: 'Total Memories',
      sublabel: 'SuperMemory entries',
      value: memoryStats.totalMemories.toLocaleString(),
      icon: Brain,
      color: 'var(--accent-cyan)',
      bg: 'var(--accent-cyan-dim)',
    },
    {
      label: 'Tokens Saved',
      sublabel: 'Context reuse',
      value: formatTokens(memoryStats.tokensSaved),
      icon: Coins,
      color: 'var(--accent-amber)',
      bg: 'var(--accent-amber-dim)',
    },
    {
      label: 'Estimated Savings',
      sublabel: 'Per month',
      value: `\u20AC${memoryStats.estimatedSavings.toFixed(2)}/month`,
      icon: Euro,
      color: 'var(--comercial-color)',
      bg: 'var(--comercial-dim)',
    },
    {
      label: 'Avg Retrieval',
      sublabel: 'Response time',
      value: memoryStats.avgRetrievalTime,
      icon: Zap,
      color: 'var(--marketing-color)',
      bg: 'var(--marketing-dim)',
    },
  ];

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <motion.div style={styles.header} {...stagger(0)}>
        <div>
          <div style={styles.titleRow}>
            <Database size={20} color="var(--accent-cyan)" />
            <h2 style={styles.pageTitle}>SuperMemory</h2>
          </div>
          <p style={styles.pageSubtitle}>
            Monitoring and management of persistent context memory
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.btnPrimary}>
            <Plus size={14} />
            Adicionar memoria
          </button>
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

      {/* ── Category Breakdown ── */}
      <motion.div style={styles.categorySection} {...stagger(5)}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>
            <Tag size={14} color="var(--accent-cyan)" />
            Category Breakdown
          </h3>
          <span style={styles.sectionMeta}>{categoryTotal} total entries</span>
        </div>
        <div style={styles.categoryGrid}>
          {(Object.keys(categoryConfig) as CategoryKey[]).map((cat, i) => {
            const cfg = categoryConfig[cat];
            const count = memoryStats.categoryCounts[cat];
            const pct = ((count / categoryTotal) * 100).toFixed(1);
            const CatIcon = cfg.icon;
            return (
              <motion.div
                key={cat}
                style={styles.categoryCard}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
              >
                <div style={styles.categoryCardTop}>
                  <div style={{ ...styles.categoryIconBox, background: cfg.dim }}>
                    <CatIcon size={16} color={cfg.color} />
                  </div>
                  <span style={{ ...styles.categoryPct, color: cfg.color }}>
                    {pct}%
                  </span>
                </div>
                <div style={styles.categoryCount}>{count}</div>
                <div style={styles.categoryLabel}>{cfg.label}</div>
                {/* Proportion bar */}
                <div style={styles.barTrack}>
                  <motion.div
                    style={{
                      ...styles.barFill,
                      background: cfg.color,
                      boxShadow: `0 0 8px ${cfg.color}40`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Memory Entries ── */}
      <motion.div style={styles.entriesSection} {...stagger(6)}>
        {/* Entries Header */}
        <div style={styles.entriesHeader}>
          <div style={styles.entriesHeaderLeft}>
            <h3 style={styles.sectionTitle}>
              <Brain size={14} color="var(--accent-cyan)" />
              Memory Entries
            </h3>
            <span style={styles.sectionMeta}>
              {filteredEntries.length} results
            </span>
          </div>
          <div style={styles.entriesHeaderRight}>
            {/* Search */}
            <div style={styles.searchBox}>
              <Search size={14} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              {searchQuery && (
                <button
                  style={styles.clearSearchBtn}
                  onClick={() => setSearchQuery('')}
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {/* Agent filter dropdown */}
            <div style={styles.dropdownContainer}>
              <button
                style={styles.filterBtn}
                onClick={() => setShowAgentDropdown(!showAgentDropdown)}
              >
                <Filter size={13} />
                {agentFilter
                  ? `${getAgentAvatar(agentFilter)} ${getAgentName(agentFilter)}`
                  : 'Agent'}
                <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {showAgentDropdown && (
                  <motion.div
                    style={styles.dropdown}
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div
                      style={{
                        ...styles.dropdownItem,
                        ...(agentFilter === null ? styles.dropdownItemActive : {}),
                      }}
                      onClick={() => {
                        setAgentFilter(null);
                        setShowAgentDropdown(false);
                      }}
                    >
                      Todos os agentes
                    </div>
                    {uniqueAgentIds.map(id => (
                      <div
                        key={id}
                        style={{
                          ...styles.dropdownItem,
                          ...(agentFilter === id ? styles.dropdownItemActive : {}),
                        }}
                        onClick={() => {
                          setAgentFilter(id);
                          setShowAgentDropdown(false);
                        }}
                      >
                        <span style={{ marginRight: '6px' }}>{getAgentAvatar(id)}</span>
                        {getAgentName(id)}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabBar}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                style={{
                  ...styles.tab,
                  ...(isActive ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.key !== 'all' && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: categoryConfig[tab.key as CategoryKey]?.color ?? 'var(--text-tertiary)',
                      flexShrink: 0,
                    }}
                  />
                )}
                {tab.label}
                {tab.key === 'all' && (
                  <span style={styles.tabCount}>{memoryStats.totalMemories}</span>
                )}
                {tab.key !== 'all' && (
                  <span style={styles.tabCount}>
                    {memoryStats.categoryCounts[tab.key as CategoryKey]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Entries List */}
        <div style={styles.entriesList}>
          <AnimatePresence mode="popLayout">
            {filteredEntries.length === 0 ? (
              <motion.div
                style={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Brain size={40} color="var(--text-tertiary)" style={{ opacity: 0.3 }} />
                <div style={styles.emptyTitle}>No memories found</div>
                <div style={styles.emptyDesc}>
                  Try adjusting your filters or search query
                </div>
              </motion.div>
            ) : (
              filteredEntries.map((entry, i) => (
                <MemoryCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  maxAccess={maxAccess}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// ── Memory Card Sub-component ──
const MemoryCard: React.FC<{
  entry: MemoryEntry;
  index: number;
  maxAccess: number;
}> = ({ entry, index, maxAccess }) => {
  const cfg = categoryConfig[entry.category];
  const CatIcon = cfg.icon;
  const accessPct = Math.max((entry.accessCount / maxAccess) * 100, 4);

  return (
    <motion.div
      style={styles.entryCard}
      {...listStagger(index)}
      layout
      whileHover={{
        borderColor: 'var(--border-default)',
        transition: { duration: 0.15 },
      }}
    >
      {/* Left accent stripe */}
      <div
        style={{
          ...styles.entryAccent,
          background: cfg.color,
          boxShadow: `0 0 10px ${cfg.color}30`,
        }}
      />

      <div style={styles.entryBody}>
        {/* Top Row: badge + source + date */}
        <div style={styles.entryTopRow}>
          <div
            style={{
              ...styles.categoryBadge,
              color: cfg.color,
              background: cfg.dim,
            }}
          >
            <CatIcon size={10} />
            {cfg.label}
          </div>
          <div style={styles.entryMeta}>
            <span style={styles.entrySource}>{entry.source}</span>
            <span style={styles.entrySep}>|</span>
            <span style={styles.entryDate}>
              <Calendar size={10} />
              {entry.createdAt}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={styles.entryContent}>{entry.content}</div>

        {/* Bottom row: agent + access count */}
        <div style={styles.entryBottomRow}>
          <div style={styles.entryAgent}>
            <span style={styles.entryAgentAvatar}>{getAgentAvatar(entry.agentId)}</span>
            <span style={styles.entryAgentName}>{getAgentName(entry.agentId)}</span>
          </div>

          <div style={styles.accessContainer}>
            <Eye size={11} color="var(--text-tertiary)" />
            <span style={styles.accessCount}>{entry.accessCount}</span>
            <div style={styles.accessBarTrack}>
              <motion.div
                style={{
                  ...styles.accessBarFill,
                  background: cfg.color,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${accessPct}%` }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  // ── Page ──
  page: {
    padding: '24px',
    overflow: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  // ── Header ──
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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

  // ── KPI Grid ──
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

  // ── Category Breakdown ──
  categorySection: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
  },
  sectionMeta: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  categoryCard: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  categoryCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  categoryIconBox: {
    width: 34,
    height: 34,
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPct: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
  },
  categoryCount: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  categoryLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    marginBottom: '12px',
  },
  barTrack: {
    width: '100%',
    height: '4px',
    borderRadius: '2px',
    background: 'var(--bg-tertiary)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '2px',
  },

  // ── Entries Section ──
  entriesSection: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  entriesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  entriesHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  entriesHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  // ── Search ──
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-input)',
    border: '1px solid var(--border-default)',
    width: '260px',
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
  clearSearchBtn: {
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

  // ── Agent Filter Dropdown ──
  dropdownContainer: {
    position: 'relative' as const,
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  dropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 4px)',
    right: 0,
    minWidth: '200px',
    background: 'var(--surface-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    zIndex: 100,
    overflow: 'hidden',
    padding: '4px',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
    fontFamily: 'var(--font-body)',
  },
  dropdownItemActive: {
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
  },

  // ── Tabs ──
  tabBar: {
    display: 'flex',
    gap: '2px',
    padding: '3px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '14px',
    alignSelf: 'flex-start',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-tertiary)',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    cursor: 'pointer',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap' as const,
  },
  tabActive: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  tabCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    background: 'var(--bg-tertiary)',
    padding: '1px 6px',
    borderRadius: '8px',
    lineHeight: '16px',
  },

  // ── Entry List ──
  entriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'auto',
    flex: 1,
    minHeight: 0,
  },

  // ── Entry Card ──
  entryCard: {
    display: 'flex',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
    transition: 'border-color 0.15s ease',
    cursor: 'pointer',
  },
  entryAccent: {
    width: '3px',
    flexShrink: 0,
  },
  entryBody: {
    flex: 1,
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
  },
  entryTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    flexShrink: 0,
  },
  entryMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },
  entrySource: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  entrySep: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    opacity: 0.4,
  },
  entryDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  entryContent: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    lineHeight: 1.6,
    fontFamily: 'var(--font-body)',
  },
  entryBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginTop: '2px',
  },
  entryAgent: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  entryAgentAvatar: {
    fontSize: '14px',
    lineHeight: 1,
  },
  entryAgentName: {
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },

  // ── Access Count ──
  accessContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  accessCount: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    fontWeight: 600,
    minWidth: '18px',
    textAlign: 'right' as const,
  },
  accessBarTrack: {
    width: '60px',
    height: '3px',
    borderRadius: '2px',
    background: 'var(--bg-tertiary)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  accessBarFill: {
    height: '100%',
    borderRadius: '2px',
  },

  // ── Empty State ──
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 20px',
    gap: '8px',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  emptyDesc: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
};

export default Memory;
