import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  Users,
  Bot,
  Settings,
  ChevronRight,
  Zap,
  Inbox,
  Briefcase,
  Calculator,
  BarChart3,
  UserCheck,
  DollarSign,
  Plug,
  Brain,
  FileText,
} from 'lucide-react';
import { agents } from '../../data/mockData';
import { hubDeliveries } from '../../data/mockDataExpanded';

interface NavSection {
  label?: string;
  items: { path: string; label: string; icon: React.ElementType; badge?: number }[];
}

const navSections: NavSection[] = [
  {
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/office', label: 'Escritório 3D', icon: Building2 },
    ],
  },
  {
    label: 'OPERAÇÕES',
    items: [
      { path: '/marketing', label: 'Marketing & Gestão', icon: Megaphone },
      { path: '/crm', label: 'Comercial / CRM', icon: Users },
      { path: '/operational', label: 'Operacional', icon: Briefcase },
      { path: '/orcamentos', label: 'Orçamentos', icon: Calculator },
      { path: '/estudos', label: 'Estudos de Mercado', icon: BarChart3 },
    ],
  },
  {
    label: 'COMMAND CENTER',
    items: [
      { path: '/hub', label: 'Hub', icon: Inbox, badge: hubDeliveries.filter(d => d.status === 'para_revisao').length },
    ],
  },
  {
    label: 'GESTÃO',
    items: [
      { path: '/clients', label: 'Clientes', icon: UserCheck },
      { path: '/agents', label: 'Agents', icon: Bot },
      { path: '/financial', label: 'Financeiro', icon: DollarSign },
    ],
  },
  {
    label: 'SISTEMA',
    items: [
      { path: '/integrations', label: 'Integrações', icon: Plug },
      { path: '/memory', label: 'Memory', icon: Brain },
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const onlineAgents = agents.filter(a => a.status === 'online' || a.status === 'busy').length;
  const pendingDeliveries = hubDeliveries.filter(d => d.status === 'para_revisao').length;

  return (
    <aside style={styles.sidebar}>
      {/* ── Logo ── */}
      <div style={styles.logoSection}>
        <div style={styles.logoMark}>
          <Zap size={20} color="var(--accent-cyan)" />
        </div>
        <div>
          <div style={styles.logoText}>OPENCLAW</div>
          <div style={styles.logoSub}>Mission Control</div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={styles.nav}>
        {navSections.map((section, si) => (
          <div key={si} style={styles.section}>
            {section.label && (
              <div style={styles.sectionLabel}>{section.label}</div>
            )}
            {section.items.map((item, i) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (si * 3 + i) * 0.03, duration: 0.25 }}
                    style={{
                      ...styles.navItem,
                      ...(isActive ? styles.navItemActive : {}),
                    }}
                  >
                    {isActive && <div style={styles.activeIndicator} />}
                    <Icon
                      size={16}
                      color={isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'}
                      style={{ flexShrink: 0 }}
                    />
                    <span style={{
                      ...styles.navLabel,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 500 : 400,
                    }}>
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span style={styles.badge}>{item.badge}</span>
                    )}
                    {isActive && (
                      <ChevronRight size={12} color="var(--accent-cyan)" style={{ marginLeft: 'auto', opacity: 0.5 }} />
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div style={styles.bottomSection}>
        {pendingDeliveries > 0 && (
          <NavLink to="/hub" style={{ textDecoration: 'none' }}>
            <div style={styles.deliveryAlert}>
              <FileText size={13} color="var(--accent-amber)" />
              <span style={styles.deliveryText}>{pendingDeliveries} entregas para revisão</span>
              <ChevronRight size={12} color="var(--accent-amber)" />
            </div>
          </NavLink>
        )}
        <div style={styles.divider} />
        <div style={styles.statusCard}>
          <div style={styles.statusRow}>
            <div style={styles.statusDot} />
            <span style={styles.statusLabel}>Agentes online</span>
            <span style={styles.statusValue}>{onlineAgents}/{agents.length}</span>
          </div>
          <div style={styles.statusBar}>
            <div style={{ ...styles.statusBarFill, width: `${(onlineAgents / agents.length) * 100}%` }} />
          </div>
        </div>
        <div style={styles.companyBadge}>
          <div style={styles.companyAvatar}>AC</div>
          <div>
            <div style={styles.companyName}>Audaces Capital</div>
            <div style={styles.companyPlan}>Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 'var(--sidebar-width)',
    minWidth: 'var(--sidebar-width)',
    height: '100vh',
    background: 'var(--bg-primary)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
  },
  logoMark: {
    width: 34, height: 34, borderRadius: '9px',
    background: 'var(--accent-cyan-dim)', border: '1px solid var(--border-accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
    letterSpacing: '2px', color: 'var(--text-primary)',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)',
    letterSpacing: '0.5px', marginTop: '1px',
  },
  nav: { flex: 1, overflow: 'auto', padding: '4px 10px' },
  section: { marginBottom: '4px' },
  sectionLabel: {
    fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700,
    color: 'var(--text-tertiary)', textTransform: 'uppercase' as const,
    letterSpacing: '1.5px', padding: '12px 10px 6px',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.12s ease',
    position: 'relative' as const, overflow: 'hidden',
  },
  navItemActive: { background: 'var(--accent-cyan-dim)' },
  activeIndicator: {
    position: 'absolute' as const, left: 0, top: '50%', transform: 'translateY(-50%)',
    width: 3, height: 16, borderRadius: '0 3px 3px 0', background: 'var(--accent-cyan)',
  },
  navLabel: { fontSize: '12px', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const },
  badge: {
    marginLeft: 'auto', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700,
    padding: '2px 6px', borderRadius: '10px', background: 'var(--accent-amber-dim)',
    color: 'var(--accent-amber)', border: '1px solid rgba(255,182,39,0.2)',
  },
  bottomSection: { padding: '8px 10px 12px' },
  deliveryAlert: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px',
    borderRadius: 'var(--radius-sm)', background: 'var(--accent-amber-dim)',
    border: '1px solid rgba(255,182,39,0.12)', cursor: 'pointer', marginBottom: '8px',
  },
  deliveryText: {
    flex: 1, fontSize: '10px', fontFamily: 'var(--font-mono)',
    color: 'var(--accent-amber)', fontWeight: 600,
  },
  divider: { height: 1, background: 'var(--border-subtle)', margin: '4px 8px' },
  statusCard: { padding: '10px 10px' },
  statusRow: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' },
  statusDot: {
    width: 6, height: 6, borderRadius: '50%', background: 'var(--status-online)',
    boxShadow: '0 0 8px var(--status-online)', animation: 'pulse-glow 2s infinite',
  },
  statusLabel: {
    fontSize: '9px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase' as const, letterSpacing: '0.5px',
  },
  statusValue: {
    marginLeft: 'auto', fontSize: '11px', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)', fontWeight: 600,
  },
  statusBar: { height: 3, borderRadius: 2, background: 'var(--bg-hover)', overflow: 'hidden' },
  statusBarFill: {
    height: '100%', borderRadius: 2,
    background: 'linear-gradient(90deg, var(--status-online), var(--accent-cyan))',
  },
  companyBadge: {
    display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0 0',
    padding: '8px 10px', borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
  },
  companyAvatar: {
    width: 28, height: 28, borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(135deg, var(--accent-amber), var(--accent-amber-glow))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '10px', color: '#000',
  },
  companyName: { fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)' },
  companyPlan: { fontSize: '9px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' },
};

export default Sidebar;
