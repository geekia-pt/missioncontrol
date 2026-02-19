import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bell,
  Search,
  ChevronDown,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { agents, tasks, alerts } from '../../data/mockData';
import { useTheme, ThemeMode } from '../../contexts/ThemeContext';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/office': 'Escritório 3D',
  '/marketing': 'Marketing & Gestão',
  '/crm': 'Comercial / CRM',
  '/operational': 'Operacional',
  '/orcamentos': 'Orçamentos',
  '/estudos': 'Estudos de Mercado',
  '/hub': 'Command Center',
  '/clients': 'Clientes',
  '/agents': 'Agents',
  '/financial': 'Financeiro',
  '/integrations': 'Integrações',
  '/memory': 'SuperMemory',
  '/settings': 'Settings',
};

const themeIcons: Record<ThemeMode, React.ElementType> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

const themeOrder: ThemeMode[] = ['dark', 'light', 'system'];

const Topbar: React.FC = () => {
  const location = useLocation();
  const { mode, setMode } = useTheme();
  const title = routeTitles[location.pathname] || 'Mission Control';

  const onlineCount = agents.filter(a => a.status === 'online' || a.status === 'busy').length;
  const activeTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'testing').length;
  const errorCount = alerts.filter(a => a.type === 'error').length;

  const cycleTheme = () => {
    const currentIndex = themeOrder.indexOf(mode);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setMode(themeOrder[nextIndex]);
  };

  const ThemeIcon = themeIcons[mode];

  return (
    <header style={styles.topbar}>
      {/* ── Left ── */}
      <div style={styles.leftSection}>
        <h1 style={styles.title}>{title}</h1>
        <button style={styles.orgSelector}>
          <span style={styles.orgDot} />
          <span style={styles.orgName}>Audaces Capital</span>
          <ChevronDown size={14} color="var(--text-tertiary)" />
        </button>
      </div>

      {/* ── Center: Search ── */}
      <div style={styles.searchContainer}>
        <Search size={15} color="var(--text-tertiary)" />
        <input
          type="text"
          placeholder="Pesquisar agentes, tarefas, leads..."
          style={styles.searchInput}
        />
        <div style={styles.searchShortcut}>⌘K</div>
      </div>

      {/* ── Right ── */}
      <div style={styles.rightSection}>
        <div style={styles.chipGroup}>
          <div style={styles.chip}>
            <Wifi size={12} color="var(--status-online)" />
            <span style={styles.chipValue}>{onlineCount}</span>
            <span style={styles.chipLabel}>online</span>
          </div>
          <div style={styles.chip}>
            <CheckCircle2 size={12} color="var(--accent-cyan)" />
            <span style={styles.chipValue}>{activeTasks}</span>
            <span style={styles.chipLabel}>tarefas</span>
          </div>
          {errorCount > 0 && (
            <div style={{ ...styles.chip, ...styles.chipError }}>
              <AlertTriangle size={12} color="var(--status-error)" />
              <span style={{ ...styles.chipValue, color: 'var(--status-error)' }}>{errorCount}</span>
              <span style={styles.chipLabel}>alerta</span>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button style={styles.themeBtn} onClick={cycleTheme} title={`Tema: ${mode}`}>
          <ThemeIcon size={16} color="var(--text-secondary)" />
        </button>

        {/* Notifications */}
        <button style={styles.iconBtn}>
          <Bell size={18} color="var(--text-secondary)" />
          {errorCount > 0 && <div style={styles.notifDot} />}
        </button>

        {/* User */}
        <div style={styles.userAvatar}>
          <span style={styles.userInitials}>WS</span>
        </div>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  topbar: {
    height: 'var(--topbar-height)', minHeight: 'var(--topbar-height)',
    background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 24px', gap: '24px',
  },
  leftSection: { display: 'flex', alignItems: 'center', gap: '16px', minWidth: 'fit-content' },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600,
    color: 'var(--text-primary)', whiteSpace: 'nowrap' as const,
  },
  orgSelector: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px',
    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)',
    background: 'var(--surface-input)', cursor: 'pointer', color: 'var(--text-secondary)',
    fontSize: '12px', fontFamily: 'var(--font-body)',
  },
  orgDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-amber)' },
  orgName: { whiteSpace: 'nowrap' as const },
  searchContainer: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px',
    borderRadius: 'var(--radius-md)', background: 'var(--surface-input)',
    border: '1px solid var(--border-default)', flex: 1, maxWidth: '400px',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none', background: 'transparent',
    color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-body)',
  },
  searchShortcut: {
    padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-hover)',
    fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)',
    border: '1px solid var(--border-default)',
  },
  rightSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  chipGroup: { display: 'flex', gap: '6px' },
  chip: {
    display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px',
    borderRadius: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
  },
  chipError: {
    background: 'var(--status-error-dim)', border: '1px solid rgba(255, 59, 92, 0.2)',
  },
  chipValue: {
    fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
  },
  chipLabel: {
    fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase' as const,
  },
  themeBtn: {
    width: 36, height: 36, borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)', background: 'var(--surface-input)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)', background: 'var(--surface-input)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', position: 'relative' as const,
  },
  notifDot: {
    position: 'absolute' as const, top: 6, right: 6, width: 7, height: 7,
    borderRadius: '50%', background: 'var(--status-error)', border: '2px solid var(--bg-primary)',
  },
  userAvatar: {
    width: 34, height: 34, borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, var(--accent-cyan), #0066ff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  },
  userInitials: {
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: '#fff',
  },
};

export default Topbar;
