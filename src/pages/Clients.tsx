import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Building2,
  Home,
  Store,
  Users,
  CreditCard,
  CheckCircle2,
  Circle,
  Clock,
  Pause,
  Zap,
  Mail,
  User,
  FileText,
  Settings2,
  Bot,
  Link2,
  Rocket,
  ChevronRight,
  TrendingUp,
  Receipt,
  DollarSign,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { clientWorkspaces, ClientWorkspace, onboardingSteps } from '../data/mockDataExpanded';

// ── Helpers ──

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.05, duration: 0.4 },
});

type TabKey = 'workspaces' | 'onboarding' | 'billing';

const typeConfig: Record<ClientWorkspace['type'], { label: string; color: string; bg: string }> = {
  construcao: { label: 'Construcao', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' },
  imobiliario: { label: 'Imobiliario', color: 'var(--marketing-color)', bg: 'var(--marketing-dim)' },
  negocio_local: { label: 'Negocio Local', color: 'var(--comercial-color)', bg: 'var(--comercial-dim)' },
};

const planConfig: Record<ClientWorkspace['plan'], { label: string; color: string; bg: string }> = {
  starter: { label: 'Starter', color: 'var(--text-secondary)', bg: 'var(--bg-tertiary)' },
  pro: { label: 'Pro', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)' },
  enterprise: { label: 'Enterprise', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' },
};

const statusConfig: Record<ClientWorkspace['status'], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  onboarding: { label: 'Onboarding', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)', icon: <Clock size={10} /> },
  active: { label: 'Ativo', color: 'var(--status-online)', bg: 'var(--status-online-dim)', icon: <Zap size={10} /> },
  paused: { label: 'Pausado', color: 'var(--text-tertiary)', bg: 'var(--bg-tertiary)', icon: <Pause size={10} /> },
};

const stepIcons = [FileText, Settings2, Bot, Link2, Rocket];

// ══════════════════════════════════════════════════
// CLIENTS PAGE
// ══════════════════════════════════════════════════

const Clients: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('workspaces');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkspaces = useMemo(
    () =>
      clientWorkspaces.filter(
        (ws) =>
          ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ws.contactName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const onboardingClients = useMemo(
    () => clientWorkspaces.filter((ws) => ws.status === 'onboarding'),
    [],
  );

  const activeClients = useMemo(
    () => clientWorkspaces.filter((ws) => ws.status === 'active'),
    [],
  );

  const totalMRR = useMemo(
    () => clientWorkspaces.reduce((sum, ws) => sum + ws.monthlyBilling, 0),
    [],
  );

  const avgTicket = useMemo(() => {
    const paying = clientWorkspaces.filter((ws) => ws.monthlyBilling > 0);
    return paying.length > 0 ? Math.round(totalMRR / paying.length) : 0;
  }, [totalMRR]);

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'workspaces', label: 'Workspaces', count: clientWorkspaces.length },
    { key: 'onboarding', label: 'Onboarding', count: onboardingClients.length },
    { key: 'billing', label: 'Billing' },
  ];

  return (
    <div style={s.page}>
      {/* ── Page Header ── */}
      <motion.div style={s.header} {...stagger(0)}>
        <div>
          <h2 style={s.pageTitle}>Clientes</h2>
          <p style={s.pageSubtitle}>
            Gestao multi-tenant de workspaces, onboarding e faturacao
          </p>
        </div>
        <div style={s.headerActions}>
          <div style={s.searchBox}>
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Pesquisar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={s.searchInput}
            />
          </div>
          <button style={s.btnPrimary}>
            <Plus size={14} /> Novo Cliente
          </button>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div style={s.tabBar} {...stagger(1)}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...s.tab,
              ...(activeTab === tab.key ? s.tabActive : {}),
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  ...s.tabBadge,
                  background:
                    activeTab === tab.key
                      ? 'var(--accent-cyan)'
                      : 'var(--bg-tertiary)',
                  color:
                    activeTab === tab.key ? '#000' : 'var(--text-tertiary)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'workspaces' && (
          <motion.div
            key="workspaces"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <WorkspacesTab workspaces={filteredWorkspaces} />
          </motion.div>
        )}
        {activeTab === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <OnboardingTab clients={onboardingClients} />
          </motion.div>
        )}
        {activeTab === 'billing' && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <BillingTab
              clients={clientWorkspaces}
              totalMRR={totalMRR}
              activeCount={activeClients.length}
              avgTicket={avgTicket}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ══════════════════════════════════════════════════
// TAB 1: WORKSPACES
// ══════════════════════════════════════════════════

const WorkspacesTab: React.FC<{ workspaces: ClientWorkspace[] }> = ({ workspaces }) => (
  <div style={s.wsGrid}>
    {workspaces.map((ws, i) => (
      <motion.div
        key={ws.id}
        style={s.wsCard}
        {...stagger(i + 2)}
        whileHover={{ y: -4, transition: { duration: 0.15 } }}
      >
        {/* Card Top Row: Logo + Name + Status */}
        <div style={s.wsCardTop}>
          <div style={s.wsLogoName}>
            <div style={s.wsLogo}>{ws.logo}</div>
            <div>
              <div style={s.wsName}>{ws.name}</div>
              <div style={s.wsContact}>
                <User size={10} color="var(--text-tertiary)" />
                <span>{ws.contactName}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              ...s.connectionDot,
              background: ws.openclawConnected
                ? 'var(--status-online)'
                : 'var(--status-error)',
              boxShadow: ws.openclawConnected
                ? '0 0 8px var(--status-online-dim)'
                : '0 0 8px var(--status-error-dim)',
            }}
            title={ws.openclawConnected ? 'OpenClaw conectado' : 'OpenClaw desconectado'}
          />
        </div>

        {/* Badges Row */}
        <div style={s.wsBadgeRow}>
          <span
            style={{
              ...s.badge,
              color: typeConfig[ws.type].color,
              background: typeConfig[ws.type].bg,
            }}
          >
            {ws.type === 'construcao' && <Building2 size={10} />}
            {ws.type === 'imobiliario' && <Home size={10} />}
            {ws.type === 'negocio_local' && <Store size={10} />}
            {typeConfig[ws.type].label}
          </span>
          <span
            style={{
              ...s.badge,
              color: planConfig[ws.plan].color,
              background: planConfig[ws.plan].bg,
            }}
          >
            {planConfig[ws.plan].label}
          </span>
          <span
            style={{
              ...s.badge,
              color: statusConfig[ws.status].color,
              background: statusConfig[ws.status].bg,
            }}
          >
            {statusConfig[ws.status].icon}
            {statusConfig[ws.status].label}
          </span>
        </div>

        {/* Agents Progress */}
        <div style={s.wsAgentsRow}>
          <div style={s.wsAgentsLabel}>
            <Bot size={12} color="var(--text-tertiary)" />
            <span>
              Agentes: {ws.agentsActive}/{ws.agentsTotal}
            </span>
          </div>
          <div style={s.progressBarBg}>
            <div
              style={{
                ...s.progressBarFill,
                width:
                  ws.agentsTotal > 0
                    ? `${(ws.agentsActive / ws.agentsTotal) * 100}%`
                    : '0%',
                background:
                  ws.agentsActive === ws.agentsTotal
                    ? 'var(--status-online)'
                    : 'var(--accent-cyan)',
              }}
            />
          </div>
        </div>

        {/* Footer: billing + email */}
        <div style={s.wsFooter}>
          <div style={s.wsBilling}>
            <span style={s.wsBillingValue}>
              {ws.monthlyBilling > 0 ? `${ws.monthlyBilling}` : '--'}
            </span>
            <span style={s.wsBillingCurrency}>{ws.monthlyBilling > 0 ? '/mes' : ''}</span>
          </div>
          <div style={s.wsEmail} title={ws.contactEmail}>
            <Mail size={10} color="var(--text-tertiary)" />
            <span>{ws.contactEmail}</span>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ══════════════════════════════════════════════════
// TAB 2: ONBOARDING
// ══════════════════════════════════════════════════

const OnboardingTab: React.FC<{ clients: ClientWorkspace[] }> = ({ clients }) => {
  if (clients.length === 0) {
    return (
      <div style={s.emptyState}>
        <CheckCircle2 size={40} color="var(--status-online)" />
        <p style={s.emptyTitle}>Todos os clientes completaram o onboarding</p>
        <p style={s.emptySubtitle}>Nenhum workspace em processo de ativacao.</p>
      </div>
    );
  }

  return (
    <div style={s.onboardingList}>
      {clients.map((client, ci) => (
        <motion.div key={client.id} style={s.onboardingCard} {...stagger(ci + 2)}>
          {/* Client Info Side */}
          <div style={s.obClientInfo}>
            <div style={s.obClientLogo}>{client.logo}</div>
            <div>
              <div style={s.obClientName}>{client.name}</div>
              <div style={s.obClientMeta}>
                <span
                  style={{
                    ...s.badge,
                    color: typeConfig[client.type].color,
                    background: typeConfig[client.type].bg,
                    fontSize: '10px',
                  }}
                >
                  {typeConfig[client.type].label}
                </span>
                <span
                  style={{
                    ...s.badge,
                    color: planConfig[client.plan].color,
                    background: planConfig[client.plan].bg,
                    fontSize: '10px',
                  }}
                >
                  {planConfig[client.plan].label}
                </span>
              </div>
              <div style={s.obContactRow}>
                <User size={10} color="var(--text-tertiary)" />
                <span>{client.contactName}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>|</span>
                <Mail size={10} color="var(--text-tertiary)" />
                <span>{client.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div style={s.stepper}>
            {onboardingSteps.map((step, si) => {
              const isDone = client.onboardingStep > step.step;
              const isCurrent = client.onboardingStep === step.step;
              const StepIcon = stepIcons[si];

              return (
                <React.Fragment key={step.step}>
                  <div style={s.stepItem}>
                    <div
                      style={{
                        ...s.stepCircle,
                        background: isDone
                          ? 'var(--status-online)'
                          : isCurrent
                          ? 'var(--accent-cyan)'
                          : 'var(--bg-tertiary)',
                        border: isCurrent
                          ? '2px solid var(--accent-cyan)'
                          : isDone
                          ? '2px solid var(--status-online)'
                          : '2px solid var(--border-default)',
                        boxShadow: isCurrent
                          ? 'var(--shadow-glow-cyan)'
                          : 'none',
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} color="#000" />
                      ) : (
                        <StepIcon
                          size={14}
                          color={isCurrent ? '#000' : 'var(--text-tertiary)'}
                        />
                      )}
                    </div>
                    <div style={s.stepLabel}>
                      <span
                        style={{
                          ...s.stepLabelText,
                          color: isDone
                            ? 'var(--status-online)'
                            : isCurrent
                            ? 'var(--accent-cyan)'
                            : 'var(--text-tertiary)',
                          fontWeight: isCurrent ? 600 : 400,
                        }}
                      >
                        {step.label}
                      </span>
                      <span style={s.stepDesc}>{step.description}</span>
                    </div>
                  </div>
                  {si < onboardingSteps.length - 1 && (
                    <div
                      style={{
                        ...s.stepConnector,
                        background: isDone
                          ? 'var(--status-online)'
                          : 'var(--border-subtle)',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Progress text */}
          <div style={s.obProgress}>
            <span style={s.obProgressText}>
              Passo {client.onboardingStep} de {client.totalSteps}
            </span>
            <div style={s.obProgressBarBg}>
              <div
                style={{
                  ...s.obProgressBarFill,
                  width: `${(client.onboardingStep / client.totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════
// TAB 3: BILLING
// ══════════════════════════════════════════════════

const BillingTab: React.FC<{
  clients: ClientWorkspace[];
  totalMRR: number;
  activeCount: number;
  avgTicket: number;
}> = ({ clients, totalMRR, activeCount, avgTicket }) => {
  const summaryCards = [
    {
      label: 'Total MRR',
      value: `${totalMRR}`,
      icon: TrendingUp,
      color: 'var(--accent-cyan)',
      bg: 'var(--accent-cyan-dim)',
    },
    {
      label: 'Clientes ativos',
      value: `${activeCount}`,
      icon: Users,
      color: 'var(--status-online)',
      bg: 'var(--status-online-dim)',
    },
    {
      label: 'Ticket medio',
      value: `${avgTicket}`,
      icon: Receipt,
      color: 'var(--accent-amber)',
      bg: 'var(--accent-amber-dim)',
    },
  ];

  return (
    <div style={s.billingWrap}>
      {/* Summary KPIs */}
      <div style={s.billingSummaryGrid}>
        {summaryCards.map((card, i) => (
          <motion.div key={card.label} style={s.billingSummaryCard} {...stagger(i + 2)}>
            <div style={s.billingSummaryTop}>
              <div style={{ ...s.billingSummaryIcon, background: card.bg }}>
                <card.icon size={18} color={card.color} />
              </div>
              <ArrowUpRight size={14} color="var(--text-tertiary)" />
            </div>
            <div style={s.billingSummaryValue}>
              <DollarSign size={16} color={card.color} style={{ marginRight: 2 }} />
              {card.value}
            </div>
            <div style={s.billingSummaryLabel}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Billing Table */}
      <motion.div style={s.billingTableCard} {...stagger(5)}>
        <div style={s.billingTableHeader}>
          <h3 style={s.cardTitle}>Faturacao por cliente</h3>
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Cliente</th>
                <th style={s.th}>Plano</th>
                <th style={s.th}>Status</th>
                <th style={{ ...s.th, textAlign: 'right' as const }}>Mensal</th>
                <th style={s.th}>Metodo</th>
                <th style={{ ...s.th, textAlign: 'right' as const }}>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={s.tableClient}>
                      <span style={s.tableClientLogo}>{client.logo}</span>
                      <div>
                        <div style={s.tableClientName}>{client.name}</div>
                        <div style={s.tableClientEmail}>{client.contactEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <span
                      style={{
                        ...s.badge,
                        color: planConfig[client.plan].color,
                        background: planConfig[client.plan].bg,
                      }}
                    >
                      {planConfig[client.plan].label}
                    </span>
                  </td>
                  <td style={s.td}>
                    <span
                      style={{
                        ...s.badge,
                        color: statusConfig[client.status].color,
                        background: statusConfig[client.status].bg,
                      }}
                    >
                      {statusConfig[client.status].icon}
                      {statusConfig[client.status].label}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: 'right' as const }}>
                    <span style={s.billingAmount}>
                      {client.monthlyBilling > 0 ? `${client.monthlyBilling}` : '--'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={s.billingMethod}>
                      <CreditCard size={12} color="var(--text-tertiary)" />
                      <span>Stripe</span>
                    </div>
                  </td>
                  <td style={{ ...s.td, textAlign: 'right' as const }}>
                    <div style={s.billingActions}>
                      <button style={s.btnSmall}>
                        <Eye size={12} />
                        Ver fatura
                      </button>
                      <button style={s.btnSmallOutline}>
                        <Settings2 size={12} />
                        Gerir plano
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// ══════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════

const s: Record<string, React.CSSProperties> = {
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
    flexWrap: 'wrap',
    gap: '12px',
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
    border: '1px solid var(--border-subtle)',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    width: '180px',
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

  // ── Tab Bar ──
  tabBar: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    width: 'fit-content',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    borderRadius: 'var(--radius-md)',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-tertiary)',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  tabBadge: {
    fontSize: '10px',
    fontWeight: 700,
    padding: '1px 7px',
    borderRadius: '999px',
    fontFamily: 'var(--font-mono)',
  },

  // ── Tab 1: Workspaces Grid ──
  wsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '16px',
  },
  wsCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  wsCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wsLogoName: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  wsLogo: {
    fontSize: '28px',
    lineHeight: 1,
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
    flexShrink: 0,
  },
  wsName: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
  },
  wsContact: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
    fontFamily: 'var(--font-body)',
  },
  connectionDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '4px',
  },
  wsBadgeRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  },
  wsAgentsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  wsAgentsLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  },
  progressBarBg: {
    width: '100%',
    height: '4px',
    borderRadius: '999px',
    background: 'var(--bg-tertiary)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.5s ease',
  },
  wsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: '6px',
    borderTop: '1px solid var(--border-subtle)',
  },
  wsBilling: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px',
  },
  wsBillingValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  wsBillingCurrency: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-body)',
  },
  wsEmail: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  // ── Tab 2: Onboarding ──
  onboardingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  onboardingCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  obClientInfo: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  obClientLogo: {
    fontSize: '32px',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-lg)',
    flexShrink: 0,
  },
  obClientName: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  obClientMeta: {
    display: 'flex',
    gap: '6px',
    marginTop: '6px',
  },
  obContactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    marginTop: '6px',
    fontFamily: 'var(--font-body)',
  },

  // ── Stepper ──
  stepper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0px',
    padding: '0 8px',
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minWidth: '100px',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.3s ease',
  },
  stepLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    textAlign: 'center',
  },
  stepLabelText: {
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    lineHeight: 1.3,
  },
  stepDesc: {
    fontSize: '9px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-body)',
    lineHeight: 1.3,
    maxWidth: '110px',
  },
  stepConnector: {
    height: '2px',
    flex: 1,
    minWidth: '20px',
    marginTop: '16px',
    borderRadius: '999px',
    alignSelf: 'flex-start',
  },

  obProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
  },
  obProgressText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  obProgressBarBg: {
    flex: 1,
    height: '6px',
    borderRadius: '999px',
    background: 'var(--bg-tertiary)',
    overflow: 'hidden',
  },
  obProgressBarFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'var(--accent-cyan)',
    transition: 'width 0.5s ease',
  },

  // ── Empty State ──
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  emptySubtitle: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    margin: 0,
  },

  // ── Tab 3: Billing ──
  billingWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  billingSummaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  billingSummaryCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
  },
  billingSummaryTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  billingSummaryIcon: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingSummaryValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '26px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
  },
  billingSummaryLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    marginTop: '4px',
  },

  // ── Billing Table ──
  billingTableCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
  },
  billingTableHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-body)',
    borderBottom: '1px solid var(--border-subtle)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '14px 16px',
    color: 'var(--text-secondary)',
    verticalAlign: 'middle',
  },
  tableClient: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  tableClientLogo: {
    fontSize: '20px',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-sm)',
    flexShrink: 0,
  },
  tableClientName: {
    fontFamily: 'var(--font-display)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  tableClientEmail: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-mono)',
    marginTop: '1px',
  },
  billingAmount: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  billingMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  billingActions: {
    display: 'flex',
    gap: '6px',
    justifyContent: 'flex-end',
  },
  btnSmall: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-cyan-dim)',
    color: 'var(--accent-cyan)',
    border: 'none',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnSmallOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    fontSize: '11px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default Clients;
