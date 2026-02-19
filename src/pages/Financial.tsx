import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Coins,
  Server,
  CircleDollarSign,
  BarChart3,
  Cpu,
  LayoutGrid,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';
import {
  financialSummaries,
  platformCosts,
  agentTokenUsage,
  tokenPricing,
} from '../data/mockDataExpanded';
import { getAgentAvatar } from '../data/mockData';

// ── Helpers ──

const formatEUR = (value: number): string =>
  value.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatTokens = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
};

const monthLabel = (m: string): string => {
  const [year, month] = m.split('-');
  const names = [
    '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];
  return `${names[parseInt(month, 10)]} ${year}`;
};

type Tab = 'custos' | 'tokens' | 'plataformas';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'custos', label: 'Dashboard de Custos', icon: BarChart3 },
  { id: 'tokens', label: 'Token Tracking', icon: Cpu },
  { id: 'plataformas', label: 'Plataformas', icon: LayoutGrid },
];

// ── Stagger animation variants ──

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  },
  item: {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
};

// ══════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════

const Financial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('custos');

  const current = financialSummaries[0];
  const previous = financialSummaries[1];

  const profitMargin = current.totalRevenue > 0
    ? ((current.profit / current.totalRevenue) * 100).toFixed(1)
    : '0.0';

  const totalTokenCostAll = agentTokenUsage.reduce((s, a) => s + a.cost, 0);
  const maxAgentCost = Math.max(...agentTokenUsage.map(a => a.cost));

  const sortedAgents = [...agentTokenUsage].sort((a, b) => b.cost - a.cost);

  const totalPlatformCost = platformCosts.reduce((s, p) => s + p.monthlyCost, 0);
  const categories = Array.from(new Set(platformCosts.map(p => p.category)));

  const pctChange = (curr: number, prev: number): { value: string; positive: boolean } => {
    if (prev === 0) return { value: '+100%', positive: true };
    const pct = ((curr - prev) / prev) * 100;
    return {
      value: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
      positive: pct >= 0,
    };
  };

  // ── KPI data for costs tab ──
  const kpis = [
    {
      label: 'Receita Total',
      value: current.totalRevenue,
      icon: TrendingUp,
      color: 'var(--status-online)',
      colorDim: 'var(--status-online-dim)',
      change: pctChange(current.totalRevenue, previous.totalRevenue),
      changePositiveIsGood: true,
    },
    {
      label: 'Custo Tokens',
      value: current.totalTokenCost,
      icon: Cpu,
      color: 'var(--accent-amber)',
      colorDim: 'var(--accent-amber-dim)',
      change: pctChange(current.totalTokenCost, previous.totalTokenCost),
      changePositiveIsGood: false,
    },
    {
      label: 'Custo Plataformas',
      value: current.totalPlatformCost,
      icon: Server,
      color: 'var(--marketing-color)',
      colorDim: 'var(--marketing-dim)',
      change: pctChange(current.totalPlatformCost, previous.totalPlatformCost),
      changePositiveIsGood: false,
    },
    {
      label: 'Lucro',
      value: current.profit,
      icon: CircleDollarSign,
      color: 'var(--accent-cyan)',
      colorDim: 'var(--accent-cyan-dim)',
      change: pctChange(current.profit, previous.profit),
      changePositiveIsGood: true,
    },
  ];

  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Financeiro</h1>
          <p style={s.pageSubtitle}>
            Custos, tokens e plataformas &mdash; {monthLabel(current.month)}
          </p>
        </div>
        <div style={s.profitBadge}>
          <Coins size={14} />
          <span style={s.profitBadgeLabel}>Margem</span>
          <span style={s.profitBadgeValue}>{profitMargin}%</span>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={s.tabBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...s.tabBtn,
                ...(isActive ? s.tabBtnActive : {}),
              }}
            >
              <Icon size={14} style={{ opacity: isActive ? 1 : 0.5 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div style={s.body}>
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════ TAB 1: CUSTOS ═══════════════════════════════ */}
          {activeTab === 'custos' && (
            <motion.div
              key="custos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* KPI Row */}
              <motion.div
                style={s.kpiRow}
                variants={stagger.container}
                initial="hidden"
                animate="show"
              >
                {kpis.map((kpi) => {
                  const Icon = kpi.icon;
                  const changeGood = kpi.changePositiveIsGood
                    ? kpi.change.positive
                    : !kpi.change.positive;
                  return (
                    <motion.div
                      key={kpi.label}
                      style={s.kpiCard}
                      variants={stagger.item}
                    >
                      <div style={s.kpiTop}>
                        <div
                          style={{
                            ...s.kpiIcon,
                            color: kpi.color,
                            background: kpi.colorDim,
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div
                          style={{
                            ...s.kpiChange,
                            color: changeGood
                              ? 'var(--status-online)'
                              : 'var(--status-error)',
                          }}
                        >
                          {changeGood ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
                          {kpi.change.value}
                        </div>
                      </div>
                      <div style={s.kpiValue}>
                        {'\u20AC'}{formatEUR(kpi.value)}
                      </div>
                      <div style={s.kpiLabel}>{kpi.label}</div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Revenue vs Cost Visual */}
              <motion.div
                style={s.barSection}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div style={s.sectionTitle}>Receita vs Custos</div>
                <div style={s.barContainer}>
                  {/* Revenue bar */}
                  <div style={s.barRow}>
                    <div style={s.barLabel}>Receita</div>
                    <div style={s.barTrack}>
                      <motion.div
                        style={{
                          ...s.barFill,
                          background: 'var(--status-online)',
                          boxShadow: '0 0 12px rgba(0,255,136,0.2)',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                      />
                    </div>
                    <div style={s.barAmount}>
                      {'\u20AC'}{formatEUR(current.totalRevenue)}
                    </div>
                  </div>
                  {/* Token cost bar */}
                  <div style={s.barRow}>
                    <div style={s.barLabel}>Tokens</div>
                    <div style={s.barTrack}>
                      <motion.div
                        style={{
                          ...s.barFill,
                          background: 'var(--accent-amber)',
                          boxShadow: '0 0 12px rgba(255,170,0,0.15)',
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(current.totalTokenCost / current.totalRevenue) * 100}%`,
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                      />
                    </div>
                    <div style={s.barAmount}>
                      {'\u20AC'}{formatEUR(current.totalTokenCost)}
                    </div>
                  </div>
                  {/* Platform cost bar */}
                  <div style={s.barRow}>
                    <div style={s.barLabel}>Plataformas</div>
                    <div style={s.barTrack}>
                      <motion.div
                        style={{
                          ...s.barFill,
                          background: 'var(--marketing-color)',
                          boxShadow: '0 0 12px rgba(168,85,247,0.15)',
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(current.totalPlatformCost / current.totalRevenue) * 100}%`,
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                      />
                    </div>
                    <div style={s.barAmount}>
                      {'\u20AC'}{formatEUR(current.totalPlatformCost)}
                    </div>
                  </div>
                  {/* Profit bar */}
                  <div style={s.barRow}>
                    <div style={s.barLabel}>Lucro</div>
                    <div style={s.barTrack}>
                      <motion.div
                        style={{
                          ...s.barFill,
                          background: 'var(--accent-cyan)',
                          boxShadow: 'var(--shadow-glow-cyan)',
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(current.profit / current.totalRevenue) * 100}%`,
                        }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
                      />
                    </div>
                    <div style={s.barAmount}>
                      {'\u20AC'}{formatEUR(current.profit)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Monthly comparison table */}
              <motion.div
                style={s.tableSection}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div style={s.sectionTitle}>Comparacao Mensal</div>
                <div style={s.table}>
                  <div style={s.tableHeader}>
                    <span style={{ flex: 1 }}>Mes</span>
                    <span style={s.tableColNum}>Receita</span>
                    <span style={s.tableColNum}>Tokens</span>
                    <span style={s.tableColNum}>Plataformas</span>
                    <span style={s.tableColNum}>Lucro</span>
                    <span style={s.tableColNum}>Margem</span>
                    <span style={s.tableColSmall}>Clientes</span>
                    <span style={s.tableColSmall}>Tasks</span>
                  </div>
                  {financialSummaries.map((fs, i) => {
                    const margin = fs.totalRevenue > 0
                      ? ((fs.profit / fs.totalRevenue) * 100).toFixed(1)
                      : '0.0';
                    return (
                      <motion.div
                        key={fs.month}
                        style={{
                          ...s.tableRow,
                          background:
                            i === 0
                              ? 'var(--accent-cyan-dim)'
                              : 'var(--surface-card)',
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.07 }}
                      >
                        <span style={{ ...s.tableCell, flex: 1, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {monthLabel(fs.month)}
                          {i === 0 && (
                            <span style={s.currentBadge}>atual</span>
                          )}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum, color: 'var(--status-online)' }}>
                          {'\u20AC'}{formatEUR(fs.totalRevenue)}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum, color: 'var(--accent-amber)' }}>
                          {'\u20AC'}{formatEUR(fs.totalTokenCost)}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum, color: 'var(--marketing-color)' }}>
                          {'\u20AC'}{formatEUR(fs.totalPlatformCost)}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum, fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {'\u20AC'}{formatEUR(fs.profit)}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum }}>
                          {margin}%
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColSmall }}>
                          {fs.activeClients}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColSmall }}>
                          {fs.totalTasks}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════ TAB 2: TOKENS ═══════════════════════════════ */}
          {activeTab === 'tokens' && (
            <motion.div
              key="tokens"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Pricing header */}
              <motion.div
                style={s.pricingHeader}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div style={s.pricingCard}>
                  <Zap size={14} color="var(--accent-cyan)" />
                  <div>
                    <div style={s.pricingLabel}>Input Tokens</div>
                    <div style={s.pricingValue}>
                      {'\u20AC'}{tokenPricing.inputPerMillion.toFixed(2)}<span style={s.pricingUnit}>/M tokens</span>
                    </div>
                  </div>
                </div>
                <div style={s.pricingCard}>
                  <Zap size={14} color="var(--accent-amber)" />
                  <div>
                    <div style={s.pricingLabel}>Output Tokens</div>
                    <div style={s.pricingValue}>
                      {'\u20AC'}{tokenPricing.outputPerMillion.toFixed(2)}<span style={s.pricingUnit}>/M tokens</span>
                    </div>
                  </div>
                </div>
                <div style={s.pricingCard}>
                  <CircleDollarSign size={14} color="var(--status-online)" />
                  <div>
                    <div style={s.pricingLabel}>Custo Total Mes</div>
                    <div style={s.pricingValue}>
                      {'\u20AC'}{formatEUR(totalTokenCostAll)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Agent token table */}
              <motion.div
                style={s.tableSection}
                variants={stagger.container}
                initial="hidden"
                animate="show"
              >
                <div style={s.sectionTitle}>Consumo por Agente</div>
                <div style={s.table}>
                  <div style={s.tableHeader}>
                    <span style={{ flex: 1.5 }}>Agente</span>
                    <span style={s.tableColNum}>Input</span>
                    <span style={s.tableColNum}>Output</span>
                    <span style={s.tableColSmall}>Tasks</span>
                    <span style={s.tableColNum}>Custo</span>
                    <span style={{ flex: 2, textAlign: 'right' as const }}>Proporcao</span>
                  </div>
                  {sortedAgents.map((agent) => {
                    const costPct = maxAgentCost > 0 ? (agent.cost / maxAgentCost) * 100 : 0;
                    return (
                      <motion.div
                        key={agent.agentId}
                        style={s.tableRow}
                        variants={stagger.item}
                      >
                        <span style={{ ...s.tableCell, flex: 1.5, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={s.agentAvatar}>
                            {getAgentAvatar(agent.agentId)}
                          </span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {agent.name}
                          </span>
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum }}>
                          {formatTokens(agent.inputTokens)}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum }}>
                          {formatTokens(agent.outputTokens)}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColSmall }}>
                          {agent.tasks}
                        </span>
                        <span style={{ ...s.tableCell, ...s.tableColNum, fontWeight: 700, color: 'var(--accent-amber)' }}>
                          {'\u20AC'}{formatEUR(agent.cost)}
                        </span>
                        <span style={{ ...s.tableCell, flex: 2, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                          <div style={s.proportionTrack}>
                            <motion.div
                              style={{
                                ...s.proportionFill,
                                background:
                                  costPct > 75
                                    ? 'var(--accent-amber)'
                                    : costPct > 40
                                    ? 'var(--accent-cyan)'
                                    : 'var(--text-tertiary)',
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${costPct}%` }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                          </div>
                          <span style={s.proportionLabel}>
                            {((agent.cost / totalTokenCostAll) * 100).toFixed(0)}%
                          </span>
                        </span>
                      </motion.div>
                    );
                  })}

                  {/* Totals row */}
                  <div style={s.tableTotalRow}>
                    <span style={{ ...s.tableCell, flex: 1.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                      TOTAL
                    </span>
                    <span style={{ ...s.tableCell, ...s.tableColNum, fontWeight: 700 }}>
                      {formatTokens(sortedAgents.reduce((sum, a) => sum + a.inputTokens, 0))}
                    </span>
                    <span style={{ ...s.tableCell, ...s.tableColNum, fontWeight: 700 }}>
                      {formatTokens(sortedAgents.reduce((sum, a) => sum + a.outputTokens, 0))}
                    </span>
                    <span style={{ ...s.tableCell, ...s.tableColSmall, fontWeight: 700 }}>
                      {sortedAgents.reduce((sum, a) => sum + a.tasks, 0)}
                    </span>
                    <span style={{ ...s.tableCell, ...s.tableColNum, fontWeight: 700, color: 'var(--accent-amber)' }}>
                      {'\u20AC'}{formatEUR(totalTokenCostAll)}
                    </span>
                    <span style={{ ...s.tableCell, flex: 2, textAlign: 'right' as const, fontWeight: 700, color: 'var(--text-tertiary)' }}>
                      100%
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════ TAB 3: PLATAFORMAS ═══════════════════════════════ */}
          {activeTab === 'plataformas' && (
            <motion.div
              key="plataformas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Total KPI */}
              <motion.div
                style={s.platformKpiRow}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div style={s.platformKpiCard}>
                  <div style={s.platformKpiIcon}>
                    <Server size={20} color="var(--accent-cyan)" />
                  </div>
                  <div>
                    <div style={s.platformKpiLabel}>Custo Mensal Total</div>
                    <div style={s.platformKpiValue}>
                      {'\u20AC'}{formatEUR(totalPlatformCost)}
                    </div>
                    <div style={s.platformKpiSub}>
                      {platformCosts.length} plataformas ativas
                    </div>
                  </div>
                </div>
                <button style={s.addPlatformBtn}>
                  <Plus size={14} />
                  Adicionar plataforma
                </button>
              </motion.div>

              {/* Category groups */}
              {categories.map((cat, catIdx) => {
                const items = platformCosts.filter(p => p.category === cat);
                const catTotal = items.reduce((sum, p) => sum + p.monthlyCost, 0);
                return (
                  <motion.div
                    key={cat}
                    style={s.categorySection}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + catIdx * 0.1 }}
                  >
                    <div style={s.categoryHeader}>
                      <span style={s.categoryName}>{cat}</span>
                      <span style={s.categoryCost}>
                        {'\u20AC'}{formatEUR(catTotal)}/mes
                      </span>
                    </div>
                    <div style={s.platformGrid}>
                      {items.map((platform, pIdx) => {
                        const costPct = totalPlatformCost > 0
                          ? (platform.monthlyCost / totalPlatformCost) * 100
                          : 0;
                        return (
                          <motion.div
                            key={platform.id}
                            style={s.platformCard}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + catIdx * 0.1 + pIdx * 0.06 }}
                            whileHover={{
                              borderColor: 'var(--accent-cyan)',
                              transition: { duration: 0.15 },
                            }}
                          >
                            <div style={s.platformCardTop}>
                              <span style={s.platformIcon}>{platform.icon}</span>
                              <span style={s.platformPct}>
                                {costPct.toFixed(0)}%
                              </span>
                            </div>
                            <div style={s.platformName}>{platform.name}</div>
                            <div style={s.platformCategory}>{platform.category}</div>
                            <div style={s.platformCost}>
                              {'\u20AC'}{formatEUR(platform.monthlyCost)}
                              <span style={s.platformCostUnit}>/mes</span>
                            </div>
                            {/* Mini cost bar */}
                            <div style={s.platformBarTrack}>
                              <motion.div
                                style={{
                                  ...s.platformBarFill,
                                  background: costPct > 25
                                    ? 'var(--accent-amber)'
                                    : 'var(--accent-cyan)',
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: `${costPct}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// Styles
// ══════════════════════════════════════════════

const s: Record<string, React.CSSProperties> = {
  // ── Page Layout ──
  page: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 28px 0',
    flexShrink: 0,
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    marginTop: '4px',
    fontFamily: 'var(--font-body)',
  },
  profitBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--accent-cyan-dim)',
    border: '1px solid rgba(0,212,255,0.12)',
  },
  profitBadgeLabel: {
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)',
  },
  profitBadgeValue: {
    fontSize: '16px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--accent-cyan)',
  },

  // ── Tab Bar ──
  tabBar: {
    display: 'flex',
    gap: '4px',
    padding: '16px 28px 0',
    borderBottom: '1px solid var(--border-subtle)',
    flexShrink: 0,
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-tertiary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    marginBottom: '-1px',
  },
  tabBtnActive: {
    color: 'var(--accent-cyan)',
    borderBottomColor: 'var(--accent-cyan)',
  },

  // ── Body ──
  body: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 28px 40px',
  },

  // ── Section Titles ──
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '14px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },

  // ═══ TAB 1: KPIs ═══
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    marginBottom: '28px',
  },
  kpiCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '18px 20px',
  },
  kpiTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
  },
  kpiValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.1,
  },
  kpiLabel: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    marginTop: '6px',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },

  // ═══ TAB 1: Bar Chart ═══
  barSection: {
    marginBottom: '28px',
  },
  barContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  barLabel: {
    width: '90px',
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    color: 'var(--text-secondary)',
    flexShrink: 0,
    textAlign: 'right' as const,
  },
  barTrack: {
    flex: 1,
    height: '22px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 'var(--radius-sm)',
  },
  barAmount: {
    width: '100px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textAlign: 'right' as const,
    flexShrink: 0,
  },

  // ═══ TAB 1 / 2: Table ═══
  tableSection: {
    marginBottom: '28px',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'var(--surface-card)',
    transition: 'background 0.15s',
  },
  tableTotalRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    background: 'var(--bg-secondary)',
    borderTop: '2px solid var(--border-default)',
  },
  tableCell: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  tableColNum: {
    width: '100px',
    textAlign: 'right' as const,
    flexShrink: 0,
  },
  tableColSmall: {
    width: '60px',
    textAlign: 'center' as const,
    flexShrink: 0,
  },
  currentBadge: {
    display: 'inline-block',
    marginLeft: '8px',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--accent-cyan)',
    background: 'var(--accent-cyan-dim)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    verticalAlign: 'middle',
  },

  // ═══ TAB 2: Pricing Header ═══
  pricingHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
    marginBottom: '28px',
  },
  pricingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '16px 20px',
  },
  pricingLabel: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  pricingValue: {
    fontSize: '18px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginTop: '2px',
  },
  pricingUnit: {
    fontSize: '11px',
    fontWeight: 400,
    color: 'var(--text-tertiary)',
    marginLeft: '2px',
  },

  // ═══ TAB 2: Agent Avatar ═══
  agentAvatar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    fontSize: '14px',
    flexShrink: 0,
  },

  // ═══ TAB 2: Proportion bar ═══
  proportionTrack: {
    flex: 1,
    height: '6px',
    background: 'var(--bg-tertiary)',
    borderRadius: '3px',
    overflow: 'hidden',
    maxWidth: '120px',
  },
  proportionFill: {
    height: '100%',
    borderRadius: '3px',
  },
  proportionLabel: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    width: '30px',
    textAlign: 'right' as const,
    flexShrink: 0,
  },

  // ═══ TAB 3: Platform KPI ═══
  platformKpiRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
  },
  platformKpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px 28px',
  },
  platformKpiIcon: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--accent-cyan-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformKpiLabel: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
  },
  platformKpiValue: {
    fontSize: '26px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.1,
  },
  platformKpiSub: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  addPlatformBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  // ═══ TAB 3: Category Sections ═══
  categorySection: {
    marginBottom: '24px',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  categoryName: {
    fontSize: '13px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  categoryCost: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--accent-cyan)',
  },

  // ═══ TAB 3: Platform Cards ═══
  platformGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  platformCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '18px 20px',
    cursor: 'default',
    transition: 'border-color 0.15s',
  },
  platformCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  platformIcon: {
    fontSize: '24px',
  },
  platformPct: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    padding: '2px 8px',
    borderRadius: '10px',
    background: 'var(--bg-secondary)',
  },
  platformName: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  platformCategory: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.3px',
    marginBottom: '12px',
  },
  platformCost: {
    fontSize: '20px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '10px',
  },
  platformCostUnit: {
    fontSize: '11px',
    fontWeight: 400,
    color: 'var(--text-tertiary)',
    marginLeft: '2px',
  },
  platformBarTrack: {
    width: '100%',
    height: '4px',
    background: 'var(--bg-tertiary)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  platformBarFill: {
    height: '100%',
    borderRadius: '2px',
  },
};

export default Financial;
