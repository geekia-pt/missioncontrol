'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  AlertCircle,
  ExternalLink,
  Wifi,
  Search,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { integrations as mockIntegrations, Integration } from '@/data/mockDataExpanded';

interface LiveIntegration {
  id: string
  name: string
  icon: string
  keyword: string
  detected: boolean
  connected: boolean
}

const categories = [
  { key: 'all', label: 'Todas' },
  { key: 'core', label: 'Core' },
  { key: 'comunicacao', label: 'Comunicação' },
  { key: 'crm', label: 'CRM & Vendas' },
  { key: 'redes_sociais', label: 'Redes Sociais' },
  { key: 'site_seo', label: 'Site & SEO' },
  { key: 'produtividade', label: 'Produtividade' },
  { key: 'financeiro', label: 'Financeiro' },
];

const Integrations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveIntegrations, setLiveIntegrations] = useState<LiveIntegration[]>([]);
  const [toolsDetected, setToolsDetected] = useState<string[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    fetch('/api/integrations')
      .then(r => r.json())
      .then(d => {
        setLiveIntegrations(d.integrations || []);
        setToolsDetected(d.toolsDetected || []);
      })
      .catch(() => {})
      .finally(() => setLoadingLive(false));
  }, []);

  // Merge live connection status into mock integrations
  const integrations = mockIntegrations.map(i => ({
    ...i,
    connected: liveIntegrations.find(l => i.name.includes(l.keyword))?.connected ?? i.connected,
  }));

  const filtered = integrations
    .filter(i => activeCategory === 'all' || i.category === activeCategory)
    .filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 i.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const connectedCount = liveIntegrations.filter(l => l.connected).length || integrations.filter(i => i.connected).length;

  return (
    <div style={styles.page}>
      {/* Live OpenClaw integrations banner */}
      {!loadingLive && liveIntegrations.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const }}>
          {liveIntegrations.map(li => (
            <div key={li.id} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20, fontSize: 11,
              fontFamily: 'var(--font-mono)', fontWeight: 600,
              background: li.connected ? 'var(--status-online-dim)' : 'var(--bg-secondary)',
              color: li.connected ? 'var(--status-online)' : li.detected ? 'var(--accent-amber)' : 'var(--text-tertiary)',
              border: `1px solid ${li.connected ? 'rgba(34,232,122,0.2)' : li.detected ? 'rgba(255,182,39,0.2)' : 'var(--border-subtle)'}`,
            }}>
              <span>{li.icon}</span>
              {li.name}
              {li.connected && <Check size={10} />}
              {!li.connected && li.detected && <span style={{ fontSize: 9 }}>detectado</span>}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.pageTitle}>Integrações</h2>
          <p style={styles.pageSubtitle}>
            {connectedCount} de {integrations.length} serviços conectados
            {toolsDetected.length > 0 && ` · ${toolsDetected.length} ferramentas nos workspaces`}
          </p>
        </div>
        <div style={styles.searchBox}>
          <Search size={14} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Pesquisar integrações..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div style={styles.categoryBar}>
        {categories.map(cat => (
          <button
            key={cat.key}
            style={{
              ...styles.catBtn,
              ...(activeCategory === cat.key ? styles.catBtnActive : {}),
            }}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {filtered.map((int, i) => (
          <motion.div
            key={int.id}
            style={styles.card}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div style={styles.cardTop}>
              <div style={styles.cardIcon}>{int.icon}</div>
              <div style={{
                ...styles.statusBadge,
                color: int.connected ? 'var(--status-online)' : 'var(--text-tertiary)',
                background: int.connected ? 'var(--status-online-dim)' : 'var(--bg-hover)',
              }}>
                {int.connected ? <><Check size={10} /> Conectado</> : <><AlertCircle size={10} /> Off</>}
              </div>
            </div>
            <div style={styles.cardName}>{int.name}</div>
            <div style={styles.cardDesc}>{int.description}</div>
            <div style={styles.cardCategory}>
              {categories.find(c => c.key === int.category)?.label}
            </div>
            {int.connected && int.url && (
              <div style={styles.cardUrl}>
                <Wifi size={10} /> {int.url}
              </div>
            )}
            <button style={int.connected ? styles.btnSecondary : styles.btnPrimary}>
              {int.connected ? 'Configurar' : 'Conectar'}
              <ExternalLink size={11} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { height: '100%', overflow: 'auto', padding: '24px' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '20px',
  },
  pageTitle: {
    fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
    color: 'var(--text-primary)',
  },
  pageSubtitle: { fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px',
    borderRadius: 'var(--radius-md)', background: 'var(--surface-input)',
    border: '1px solid var(--border-default)', width: '260px',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none', background: 'transparent',
    color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'var(--font-body)',
  },
  categoryBar: {
    display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap' as const,
    background: 'var(--bg-primary)', padding: '4px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)', width: 'fit-content',
  },
  catBtn: {
    padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: 'none',
    background: 'transparent', color: 'var(--text-secondary)', fontSize: '11px',
    fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer',
  },
  catBtnActive: { background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  card: {
    background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)', padding: '18px',
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardIcon: { fontSize: '24px' },
  statusBadge: {
    display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px',
    borderRadius: '20px', fontSize: '9px', fontFamily: 'var(--font-mono)',
    fontWeight: 600, textTransform: 'uppercase' as const,
  },
  cardName: {
    fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
    color: 'var(--text-primary)',
  },
  cardDesc: { fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 },
  cardCategory: {
    fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const, letterSpacing: '0.5px',
  },
  cardUrl: {
    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px',
    fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)',
  },
  btnPrimary: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--accent-cyan)',
    color: '#000', border: 'none', fontSize: '11px', fontWeight: 600,
    fontFamily: 'var(--font-body)', cursor: 'pointer', marginTop: 'auto',
  },
  btnSecondary: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)', border: '1px solid var(--border-default)',
    fontSize: '11px', fontFamily: 'var(--font-body)', cursor: 'pointer', marginTop: 'auto',
  },
};

export default Integrations;
