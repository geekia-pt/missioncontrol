// ═══════════════════════════════════════════════
// MISSION CONTROL — Demo Mode Banner
// Shows a fixed banner when demo mode is active
// ═══════════════════════════════════════════════

import React from 'react';
import { Eye, EyeOff, Shield, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const DemoBanner: React.FC = () => {
  const { config, toggleDemoMode, togglePrivacyMode } = useApp();

  if (!config.demoMode) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.left}>
        <Shield size={14} color="var(--accent-amber)" />
        <span style={styles.text}>DEMO MODE</span>
        <span style={styles.subtext}>Read-only — all write actions are disabled</span>
      </div>
      <div style={styles.right}>
        <button style={styles.privacyBtn} onClick={togglePrivacyMode}>
          {config.privacyMode ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>{config.privacyMode ? 'Data Hidden' : 'Show Data'}</span>
        </button>
        <button style={styles.closeBtn} onClick={toggleDemoMode}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    background: 'linear-gradient(90deg, var(--accent-amber-dim), rgba(255,182,39,0.08))',
    borderBottom: '1px solid rgba(255,182,39,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 10000,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  text: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: 'var(--accent-amber)',
    letterSpacing: '1.5px',
  },
  subtext: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  privacyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid var(--border-default)',
    background: 'var(--surface-input)',
    color: 'var(--text-secondary)',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
  },
};

export default DemoBanner;
