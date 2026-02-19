import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plug,
  Building2,
  Users,
  ChevronRight,
  Check,
  ExternalLink,
  AlertCircle,
  Wifi,
  Globe,
  MessageCircle,
  Mail,
  Database,
  Zap,
} from 'lucide-react';

type Section = 'integracoes' | 'ambiente3d' | 'usuarios';

const sections: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'integracoes', label: 'Integrações', icon: Plug, description: 'APIs e serviços externos' },
  { id: 'ambiente3d', label: 'Ambiente 3D', icon: Building2, description: 'Configurar escritório virtual' },
  { id: 'usuarios', label: 'Usuários & Permissões', icon: Users, description: 'Gerir acessos (v2)' },
];

const integrations = [
  {
    id: 'openclaw',
    name: 'OpenClaw Gateway',
    description: 'Orquestração de agentes',
    icon: Zap,
    color: 'var(--accent-cyan)',
    connected: true,
    url: 'https://gateway.openclaw.ai',
  },
  {
    id: 'email',
    name: 'Email Provider',
    description: 'SMTP / SendGrid / Resend',
    icon: Mail,
    color: 'var(--accent-amber)',
    connected: true,
    url: 'smtp.resend.com',
  },
  {
    id: 'crm',
    name: 'CRM API',
    description: 'HubSpot / Pipedrive',
    icon: Database,
    color: 'var(--marketing-color)',
    connected: false,
    url: '',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'WhatsApp Cloud API',
    icon: MessageCircle,
    color: 'var(--status-online)',
    connected: false,
    url: '',
  },
  {
    id: 'web',
    name: 'Website / Analytics',
    description: 'Google Analytics / Plausible',
    icon: Globe,
    color: 'var(--text-secondary)',
    connected: true,
    url: 'plausible.io',
  },
];

const officeLayouts = [
  { id: 'open', label: 'Open Space', description: 'Layout aberto sem divisórias', preview: '🏢' },
  { id: 'rooms', label: 'Salas Separadas', description: 'Divisão por departamento', preview: '🏗️' },
  { id: 'hybrid', label: 'Híbrido', description: 'Salas + área comum', preview: '🏛️' },
];

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('integracoes');
  const [selectedLayout, setSelectedLayout] = useState('open');

  return (
    <div style={styles.page}>
      {/* ── Left: Section Selector ── */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Settings</div>
        {sections.map((section, i) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <motion.div
              key={section.id}
              style={{
                ...styles.sectionItem,
                ...(isActive ? styles.sectionItemActive : {}),
              }}
              onClick={() => setActiveSection(section.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div style={{
                ...styles.sectionIcon,
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-cyan-dim)' : 'var(--bg-hover)',
              }}>
                <Icon size={16} />
              </div>
              <div>
                <div style={{
                  ...styles.sectionName,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}>
                  {section.label}
                </div>
                <div style={styles.sectionDesc}>{section.description}</div>
              </div>
              {isActive && <ChevronRight size={14} color="var(--accent-cyan)" style={{ marginLeft: 'auto' }} />}
            </motion.div>
          );
        })}

        {/* Version Info */}
        <div style={styles.versionInfo}>
          <div style={styles.versionLabel}>Mission Control</div>
          <div style={styles.versionNumber}>v1.0.0-alpha</div>
          <div style={styles.versionBuild}>Build 2026.02.19</div>
        </div>
      </div>

      {/* ── Right: Content ── */}
      <div style={styles.content}>
        {activeSection === 'integracoes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.contentInner}
          >
            <div style={styles.contentHeader}>
              <h2 style={styles.contentTitle}>Integrações</h2>
              <p style={styles.contentSubtitle}>
                Conecte serviços externos para potenciar os agentes
              </p>
            </div>

            <div style={styles.integrationGrid}>
              {integrations.map((int, i) => {
                const Icon = int.icon;
                return (
                  <motion.div
                    key={int.id}
                    style={styles.integrationCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div style={styles.intTop}>
                      <div style={{
                        ...styles.intIcon,
                        color: int.color,
                        background: `${int.color}15`,
                      }}>
                        <Icon size={20} />
                      </div>
                      <div style={{
                        ...styles.intStatus,
                        color: int.connected ? 'var(--status-online)' : 'var(--text-tertiary)',
                        background: int.connected ? 'var(--status-online-dim)' : 'var(--bg-hover)',
                      }}>
                        {int.connected ? <><Check size={10} /> Conectado</> : <><AlertCircle size={10} /> Desconectado</>}
                      </div>
                    </div>
                    <div style={styles.intName}>{int.name}</div>
                    <div style={styles.intDesc}>{int.description}</div>
                    {int.connected && int.url && (
                      <div style={styles.intUrl}>
                        <Wifi size={10} /> {int.url}
                      </div>
                    )}
                    <button style={int.connected ? styles.intBtnSecondary : styles.intBtnPrimary}>
                      {int.connected ? 'Configurar' : 'Conectar'}
                      <ExternalLink size={11} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeSection === 'ambiente3d' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.contentInner}
          >
            <div style={styles.contentHeader}>
              <h2 style={styles.contentTitle}>Ambiente 3D</h2>
              <p style={styles.contentSubtitle}>
                Configure o escritório virtual e mapeie agentes para mesas/salas
              </p>
            </div>

            {/* Layout Selection */}
            <div style={styles.subSection}>
              <div style={styles.subSectionTitle}>Layout do escritório</div>
              <div style={styles.layoutGrid}>
                {officeLayouts.map(layout => (
                  <div
                    key={layout.id}
                    style={{
                      ...styles.layoutCard,
                      ...(selectedLayout === layout.id ? styles.layoutCardSelected : {}),
                    }}
                    onClick={() => setSelectedLayout(layout.id)}
                  >
                    <div style={styles.layoutPreview}>{layout.preview}</div>
                    <div style={styles.layoutName}>{layout.label}</div>
                    <div style={styles.layoutDesc}>{layout.description}</div>
                    {selectedLayout === layout.id && (
                      <div style={styles.layoutCheck}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Agent-Desk Mapping */}
            <div style={styles.subSection}>
              <div style={styles.subSectionTitle}>Mapeamento Agentes → Mesas</div>
              <div style={styles.mappingInfo}>
                O mapeamento atual está configurado na data layer. Na v2, poderás arrastar agentes para posições no escritório interactivamente.
              </div>
              <div style={styles.mappingTable}>
                <div style={styles.mappingHeader}>
                  <span>Agente</span><span>Sala</span><span>Posição</span>
                </div>
                {[
                  { name: '🌅 Aurora', room: 'Direção', pos: '(2,1)' },
                  { name: '📊 Maven', room: 'Marketing', pos: '(1,2)' },
                  { name: '🚀 Pulse', room: 'Marketing', pos: '(1,3)' },
                  { name: '💎 Vega', room: 'Comercial', pos: '(3,2)' },
                  { name: '🔗 Nexus', room: 'Comercial', pos: '(3,3)' },
                  { name: '📨 Echo', room: 'Marketing', pos: '(1,4)' },
                  { name: '🛡️ Sentinel', room: 'Marketing', pos: '(2,4)' },
                  { name: '⚡ Onyx', room: 'Comercial', pos: '(3,4)' },
                ].map((m, i) => (
                  <div key={i} style={styles.mappingRow}>
                    <span>{m.name}</span>
                    <span style={styles.mappingRoom}>{m.room}</span>
                    <span style={styles.mappingPos}>{m.pos}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'usuarios' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.contentInner}
          >
            <div style={styles.contentHeader}>
              <h2 style={styles.contentTitle}>Usuários & Permissões</h2>
              <p style={styles.contentSubtitle}>
                Gestão de acessos e permissões (disponível na v2)
              </p>
            </div>

            <div style={styles.comingSoon}>
              <div style={styles.comingSoonIcon}>
                <Users size={48} color="var(--text-tertiary)" />
              </div>
              <div style={styles.comingSoonTitle}>Em breve</div>
              <div style={styles.comingSoonDesc}>
                A gestão de utilizadores e permissões estará disponível na próxima versão do Mission Control.
              </div>
              <div style={styles.comingSoonFeatures}>
                <div style={styles.featureItem}>Roles personalizáveis</div>
                <div style={styles.featureItem}>Convites por email</div>
                <div style={styles.featureItem}>Audit log de ações</div>
                <div style={styles.featureItem}>SSO / SAML</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
  },
  sidebar: {
    width: '280px',
    minWidth: '280px',
    borderRight: '1px solid var(--border-subtle)',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    background: 'var(--bg-primary)',
  },
  sidebarTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    padding: '0 8px 16px',
  },
  sectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  sectionItemActive: {
    background: 'var(--accent-cyan-dim)',
    border: '1px solid rgba(0,212,255,0.08)',
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionName: {
    fontSize: '13px',
    fontWeight: 500,
  },
  sectionDesc: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  versionInfo: {
    marginTop: 'auto',
    padding: '16px 12px',
    borderTop: '1px solid var(--border-subtle)',
  },
  versionLabel: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  versionNumber: {
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  versionBuild: {
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
  contentInner: {
    padding: '24px 32px',
    maxWidth: '800px',
  },
  contentHeader: {
    marginBottom: '28px',
  },
  contentTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  contentSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  integrationGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  integrationCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
  },
  intTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  intIcon: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },
  intName: {
    fontFamily: 'var(--font-display)',
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  intDesc: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
  },
  intUrl: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    marginBottom: '12px',
  },
  intBtnPrimary: {
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
  },
  intBtnSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
    fontSize: '12px',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
  subSection: {
    marginBottom: '32px',
  },
  subSectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '12px',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  layoutCard: {
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.15s',
    position: 'relative' as const,
  },
  layoutCardSelected: {
    borderColor: 'var(--accent-cyan)',
    background: 'var(--accent-cyan-dim)',
  },
  layoutPreview: {
    fontSize: '36px',
    marginBottom: '10px',
  },
  layoutName: {
    fontFamily: 'var(--font-display)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  layoutDesc: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
  layoutCheck: {
    position: 'absolute' as const,
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'var(--accent-cyan)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
  },
  mappingInfo: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontStyle: 'italic',
    marginBottom: '12px',
    padding: '10px 14px',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    borderLeft: '3px solid var(--accent-amber)',
  },
  mappingTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  mappingHeader: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 0.8fr',
    padding: '8px 12px',
    fontSize: '10px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  mappingRow: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 0.8fr',
    padding: '10px 12px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    background: 'var(--surface-card)',
    borderRadius: 'var(--radius-sm)',
  },
  mappingRoom: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
  },
  mappingPos: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-tertiary)',
  },
  comingSoon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '60px 40px',
  },
  comingSoonIcon: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  comingSoonTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  comingSoonDesc: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    maxWidth: '400px',
    lineHeight: 1.6,
    marginBottom: '24px',
  },
  comingSoonFeatures: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  featureItem: {
    padding: '6px 14px',
    borderRadius: '20px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-default)',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
  },
};

export default Settings;
