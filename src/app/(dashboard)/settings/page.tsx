'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plug, FolderOpen, Users, FileBarChart2,
  ChevronRight, Check, ExternalLink, AlertCircle,
  Wifi, Globe, MessageCircle, Mail, Database, Zap,
  Search, Plus, Download, Calendar, Clock,
  Shield, Eye, Edit3, Crown, UserPlus,
  FileText, Table2, BarChart3, TrendingUp,
  RefreshCw, Send, Filter, Tag,
} from 'lucide-react';

type Section = 'integracoes' | 'projetosdb' | 'equipa' | 'relatorios';

const sections: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'integracoes', label: 'Integrações', icon: Plug, description: 'APIs e serviços externos' },
  { id: 'projetosdb', label: 'Projetos DB', icon: FolderOpen, description: 'Base de dados de projetos' },
  { id: 'equipa', label: 'Equipa & Permissões', icon: Users, description: 'Membros e acessos' },
  { id: 'relatorios', label: 'Relatórios & Exports', icon: FileBarChart2, description: 'Templates e agendamentos' },
];

const integrations = [
  { id: 'openclaw', name: 'OpenClaw Gateway', description: 'Orquestração de agentes IA', icon: Zap, color: 'var(--accent-cyan)', connected: true, url: 'localhost:3333' },
  { id: 'email', name: 'Email Provider', description: 'SMTP / SendGrid / Resend', icon: Mail, color: 'var(--accent-amber)', connected: true, url: 'smtp.resend.com' },
  { id: 'crm', name: 'CRM API', description: 'HubSpot / Pipedrive / GoHighLevel', icon: Database, color: 'var(--marketing-color)', connected: false, url: '' },
  { id: 'whatsapp', name: 'WhatsApp Business', description: 'WhatsApp Cloud API', icon: MessageCircle, color: 'var(--status-online)', connected: false, url: '' },
  { id: 'web', name: 'Website / Analytics', description: 'Google Analytics / Plausible', icon: Globe, color: 'var(--text-secondary)', connected: true, url: 'plausible.io' },
];

const projectsDB = [
  { id: 'op-001', name: 'Mission Control v2', client: 'Interno', type: 'desenvolvimento', status: 'em_andamento', progress: 65, agent: '⚙️ Ops', budget: '—', updated: 'Hoje' },
  { id: 'op-002', name: 'Aceleração Digital Doce Pão', client: 'Padaria Doce Pão', type: 'aceleração', status: 'em_andamento', progress: 40, agent: '📣 Marketer', budget: '€2.400', updated: '2 dias' },
  { id: 'op-003', name: 'Consultoria CRM Imobiliária Costa', client: 'Imobiliária Costa', type: 'consultoria', status: 'em_andamento', progress: 70, agent: '💼 Comercial', budget: '€4.800', updated: '3 dias' },
  { id: 'op-004', name: 'Empreendimento Foz Riverside', client: 'Audaces Capital', type: 'imobiliário', status: 'em_andamento', progress: 30, agent: '🏗️ Imobiliário', budget: '€280k', updated: '1 semana' },
  { id: 'op-005', name: 'Campanha Instagram Techfield', client: 'Techfield Porto', type: 'marketing', status: 'concluido', progress: 100, agent: '📣 Marketer', budget: '€600', updated: '2 semanas' },
  { id: 'op-006', name: 'Rebranding Construções Ribeiro', client: 'Construções Ribeiro', type: 'design', status: 'pausado', progress: 20, agent: '📣 Marketer', budget: '€1.200', updated: '1 mês' },
  { id: 'op-007', name: 'Análise Mercado Imobiliário Porto', client: 'Audaces Capital', type: 'pesquisa', status: 'concluido', progress: 100, agent: '🔍 Pesquisa', budget: '—', updated: '3 semanas' },
];

const teamMembers = [
  { id: 'u-001', name: 'Audaces Capital', initials: 'AC', role: 'owner', email: 'ws@audacescapital.com', lastActive: 'Agora', permissions: ['read', 'write', 'admin', 'billing'] },
  { id: 'u-002', name: 'João Ferreira', initials: 'JF', role: 'admin', email: 'j.ferreira@audacescapital.com', lastActive: '2h atrás', permissions: ['read', 'write', 'admin'] },
  { id: 'u-003', name: 'Maria Santos', initials: 'MS', role: 'editor', email: 'maria@audacescapital.com', lastActive: 'Ontem', permissions: ['read', 'write'] },
  { id: 'u-004', name: 'Pedro Alves', initials: 'PA', role: 'viewer', email: 'pedro@audacescapital.com', lastActive: '3 dias', permissions: ['read'] },
];

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  owner: { label: 'Owner', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)', icon: Crown },
  admin: { label: 'Admin', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)', icon: Shield },
  editor: { label: 'Editor', color: 'var(--marketing-color)', bg: 'rgba(139,92,246,0.1)', icon: Edit3 },
  viewer: { label: 'Viewer', color: 'var(--text-tertiary)', bg: 'var(--bg-hover)', icon: Eye },
};

const reportTemplates = [
  { id: 'r-001', name: 'Resumo Executivo Semanal', description: 'KPIs, projetos ativos, tarefas concluídas, alertas críticos', icon: TrendingUp, color: 'var(--accent-cyan)', format: 'PDF', frequency: 'Semanal', lastRun: 'Seg 10:00', nextRun: 'Seg 24 Fev', scheduled: true },
  { id: 'r-002', name: 'Pipeline CRM', description: 'Deal stages, leads novos, follow-ups pendentes, conversão mensal', icon: BarChart3, color: 'var(--marketing-color)', format: 'PDF + Slack', frequency: 'Mensal', lastRun: '01 Fev', nextRun: '01 Mar', scheduled: true },
  { id: 'r-003', name: 'Operacional Diário', description: 'Tasks do dia, bloqueios, tempo médio por agente', icon: Table2, color: 'var(--accent-amber)', format: 'Slack', frequency: 'Diário', lastRun: 'Hoje 09:00', nextRun: 'Amanhã 09:00', scheduled: true },
  { id: 'r-004', name: 'Relatório Financeiro', description: 'Receitas, custos, faturas pendentes, comparativo mensal', icon: FileText, color: 'var(--status-online)', format: 'PDF + CSV', frequency: 'Mensal', lastRun: '31 Jan', nextRun: '28 Fev', scheduled: false },
  { id: 'r-005', name: 'Relatório de Cliente', description: 'Resumo de projeto, horas, entregas, próximos passos', icon: Send, color: 'var(--text-secondary)', format: 'PDF', frequency: 'Por pedido', lastRun: '—', nextRun: '—', scheduled: false },
];

const recentExports = [
  { name: 'Resumo_Executivo_24Fev.pdf', size: '1.2 MB', date: 'Hoje 10:02', format: 'PDF' },
  { name: 'Pipeline_CRM_Fev2026.csv', size: '84 KB', date: 'Ontem 09:15', format: 'CSV' },
  { name: 'Operacional_23Fev.slack', size: '—', date: '23 Fev 09:00', format: 'Slack' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  em_andamento: { label: 'Em andamento', color: 'var(--accent-cyan)', bg: 'var(--accent-cyan-dim)' },
  concluido: { label: 'Concluído', color: 'var(--status-online)', bg: 'rgba(0,200,120,0.08)' },
  pausado: { label: 'Pausado', color: 'var(--accent-amber)', bg: 'var(--accent-amber-dim)' },
};

const typeColors: Record<string, string> = {
  desenvolvimento: 'var(--accent-cyan)',
  'aceleração': 'var(--marketing-color)',
  consultoria: 'var(--accent-amber)',
  imobiliário: 'var(--status-online)',
  marketing: '#e879f9',
  design: '#f472b6',
  pesquisa: 'var(--text-secondary)',
};

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('integracoes');
  const [projectFilter, setProjectFilter] = useState<'all' | 'em_andamento' | 'concluido' | 'pausado'>('all');
  const [projectSearch, setProjectSearch] = useState('');

  const filteredProjects = projectsDB
    .filter(p => projectFilter === 'all' || p.status === projectFilter)
    .filter(p => !projectSearch || p.name.toLowerCase().includes(projectSearch.toLowerCase()) || p.client.toLowerCase().includes(projectSearch.toLowerCase()));

  return (
    <div style={styles.page}>
      {/* ── Left Sidebar ── */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>Settings</div>
        {sections.map((section, i) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <motion.div
              key={section.id}
              style={{ ...styles.sectionItem, ...(isActive ? styles.sectionItemActive : {}) }}
              onClick={() => setActiveSection(section.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div style={{ ...styles.sectionIcon, color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)', background: isActive ? 'var(--accent-cyan-dim)' : 'var(--bg-hover)' }}>
                <Icon size={16} />
              </div>
              <div>
                <div style={{ ...styles.sectionName, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{section.label}</div>
                <div style={styles.sectionDesc}>{section.description}</div>
              </div>
              {isActive && <ChevronRight size={14} color="var(--accent-cyan)" style={{ marginLeft: 'auto' }} />}
            </motion.div>
          );
        })}
        <div style={styles.versionInfo}>
          <div style={styles.versionLabel}>Mission Control</div>
          <div style={styles.versionNumber}>v2.0.0-alpha</div>
          <div style={styles.versionBuild}>Build 2026.02.26</div>
        </div>
      </div>

      {/* ── Right Content ── */}
      <div style={styles.content}>
        <AnimatePresence mode="wait">

          {/* ─── INTEGRAÇÕES ─── */}
          {activeSection === 'integracoes' && (
            <motion.div key="integracoes" style={styles.contentInner} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
              <div style={styles.contentHeader}>
                <h2 style={styles.contentTitle}>Integrações</h2>
                <p style={styles.contentSubtitle}>Conecte serviços externos para potenciar os agentes</p>
              </div>
              <div style={styles.integrationGrid}>
                {integrations.map((int, i) => {
                  const Icon = int.icon;
                  return (
                    <motion.div key={int.id} style={styles.integrationCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <div style={styles.intTop}>
                        <div style={{ ...styles.intIcon, color: int.color, background: `${int.color}18` }}><Icon size={20} /></div>
                        <div style={{ ...styles.intStatus, color: int.connected ? 'var(--status-online)' : 'var(--text-tertiary)', background: int.connected ? 'var(--status-online-dim)' : 'var(--bg-hover)' }}>
                          {int.connected ? <><Check size={10} /> Conectado</> : <><AlertCircle size={10} /> Desconectado</>}
                        </div>
                      </div>
                      <div style={styles.intName}>{int.name}</div>
                      <div style={styles.intDesc}>{int.description}</div>
                      {int.connected && int.url && <div style={styles.intUrl}><Wifi size={10} /> {int.url}</div>}
                      <button style={int.connected ? styles.intBtnSecondary : styles.intBtnPrimary}>
                        {int.connected ? 'Configurar' : 'Conectar'}<ExternalLink size={11} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── PROJETOS DB ─── */}
          {activeSection === 'projetosdb' && (
            <motion.div key="projetosdb" style={styles.contentInner} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
              <div style={styles.contentHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={styles.contentTitle}>Projetos DB</h2>
                    <p style={styles.contentSubtitle}>Base de dados central de todos os projetos</p>
                  </div>
                  <button style={styles.actionBtn}><Plus size={13} /> Novo Projeto</button>
                </div>
              </div>

              {/* Stats row */}
              <div style={styles.dbStatsRow}>
                {[
                  { label: 'Total', value: projectsDB.length, color: 'var(--text-primary)' },
                  { label: 'Em andamento', value: projectsDB.filter(p => p.status === 'em_andamento').length, color: 'var(--accent-cyan)' },
                  { label: 'Concluídos', value: projectsDB.filter(p => p.status === 'concluido').length, color: 'var(--status-online)' },
                  { label: 'Pausados', value: projectsDB.filter(p => p.status === 'pausado').length, color: 'var(--accent-amber)' },
                ].map(s => (
                  <div key={s.label} style={styles.dbStatChip}>
                    <div style={{ ...styles.dbStatValue, color: s.color }}>{s.value}</div>
                    <div style={styles.dbStatLabel}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Filters + Search */}
              <div style={styles.dbFilterRow}>
                <div style={styles.dbSearchBox}>
                  <Search size={12} color="var(--text-tertiary)" />
                  <input type="text" placeholder="Pesquisar projetos..." value={projectSearch} onChange={e => setProjectSearch(e.target.value)} style={styles.dbSearchInput} />
                </div>
                <div style={styles.dbFilterBtns}>
                  {(['all', 'em_andamento', 'concluido', 'pausado'] as const).map(f => (
                    <button key={f} style={{ ...styles.filterBtn, ...(projectFilter === f ? styles.filterBtnActive : {}) }} onClick={() => setProjectFilter(f)}>
                      {f === 'all' ? 'Todos' : f === 'em_andamento' ? 'Ativos' : f === 'concluido' ? 'Concluídos' : 'Pausados'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div style={styles.tableHeader}>
                <span style={{ flex: 3 }}>Projeto</span>
                <span style={{ flex: 2 }}>Cliente</span>
                <span style={{ flex: 1.5 }}>Tipo</span>
                <span style={{ flex: 1 }}>Estado</span>
                <span style={{ flex: 2 }}>Progresso</span>
                <span style={{ flex: 1.5 }}>Agente</span>
                <span style={{ flex: 1, textAlign: 'right' as const }}>Budget</span>
              </div>

              {/* Table rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredProjects.map((p, i) => {
                  const st = statusConfig[p.status];
                  return (
                    <motion.div key={p.id} style={styles.tableRow} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={styles.projectName}>{p.name}</span>
                        <span style={styles.projectUpdated}><Clock size={9} /> {p.updated}</span>
                      </div>
                      <div style={{ flex: 2, fontSize: 12, color: 'var(--text-secondary)' }}>{p.client}</div>
                      <div style={{ flex: 1.5 }}>
                        <span style={{ ...styles.typeBadge, color: typeColors[p.type] || 'var(--text-tertiary)', background: `${typeColors[p.type] || 'var(--text-tertiary)'}15` }}>{p.type}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ ...styles.statusBadge, color: st.color, background: st.bg }}>{st.label}</span>
                      </div>
                      <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={styles.progressBar}>
                          <div style={{ ...styles.progressFill, width: `${p.progress}%`, background: p.progress === 100 ? 'var(--status-online)' : 'var(--accent-cyan)' }} />
                        </div>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', minWidth: 28 }}>{p.progress}%</span>
                      </div>
                      <div style={{ flex: 1.5, fontSize: 11, color: 'var(--text-secondary)' }}>{p.agent}</div>
                      <div style={{ flex: 1, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textAlign: 'right' as const }}>{p.budget}</div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── EQUIPA & PERMISSÕES ─── */}
          {activeSection === 'equipa' && (
            <motion.div key="equipa" style={styles.contentInner} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
              <div style={styles.contentHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={styles.contentTitle}>Equipa & Permissões</h2>
                    <p style={styles.contentSubtitle}>{teamMembers.length} membros · Gestão de acessos e roles</p>
                  </div>
                  <button style={styles.actionBtn}><UserPlus size={13} /> Convidar membro</button>
                </div>
              </div>

              <div style={styles.teamGrid}>
                {teamMembers.map((member, i) => {
                  const role = roleConfig[member.role];
                  const RoleIcon = role.icon;
                  return (
                    <motion.div key={member.id} style={styles.memberCard} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                      {/* Avatar + Role */}
                      <div style={styles.memberTop}>
                        <div style={{ ...styles.memberAvatar, background: `${role.color}20`, color: role.color }}>{member.initials}</div>
                        <div style={{ flex: 1 }}>
                          <div style={styles.memberName}>{member.name}</div>
                          <div style={styles.memberEmail}>{member.email}</div>
                        </div>
                        <div style={{ ...styles.roleBadge, color: role.color, background: role.bg }}>
                          <RoleIcon size={10} /> {role.label}
                        </div>
                      </div>
                      {/* Last Active */}
                      <div style={styles.memberActive}>
                        <div style={{ ...styles.activeDot, background: member.lastActive === 'Agora' ? 'var(--status-online)' : 'var(--text-tertiary)' }} />
                        <span>Último acesso: {member.lastActive}</span>
                      </div>
                      {/* Permissions */}
                      <div style={styles.permissionsRow}>
                        {['read', 'write', 'admin', 'billing'].map(perm => (
                          <div key={perm} style={{ ...styles.permBadge, ...(member.permissions.includes(perm) ? styles.permBadgeOn : styles.permBadgeOff) }}>
                            {member.permissions.includes(perm) ? <Check size={9} /> : <span style={{ fontSize: 9 }}>—</span>}
                            {perm}
                          </div>
                        ))}
                      </div>
                      {/* Actions */}
                      <div style={styles.memberActions}>
                        <button style={styles.memberBtn}>Editar permissões</button>
                        {member.role !== 'owner' && <button style={{ ...styles.memberBtn, color: 'var(--status-error)' }}>Remover</button>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Invite pending */}
              <div style={styles.subSection}>
                <div style={styles.subSectionTitle}>Convites pendentes</div>
                <div style={styles.emptyState}>
                  <UserPlus size={28} color="var(--text-tertiary)" />
                  <span>Nenhum convite pendente</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── RELATÓRIOS & EXPORTS ─── */}
          {activeSection === 'relatorios' && (
            <motion.div key="relatorios" style={styles.contentInner} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
              <div style={styles.contentHeader}>
                <h2 style={styles.contentTitle}>Relatórios & Exports</h2>
                <p style={styles.contentSubtitle}>Templates automáticos e exportação de dados</p>
              </div>

              {/* Templates */}
              <div style={styles.subSection}>
                <div style={styles.subSectionTitle}>Templates de relatório</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reportTemplates.map((r, i) => {
                    const Icon = r.icon;
                    return (
                      <motion.div key={r.id} style={styles.reportCard} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div style={{ ...styles.reportIcon, color: r.color, background: `${r.color}15` }}><Icon size={18} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={styles.reportName}>{r.name}</div>
                          <div style={styles.reportDesc}>{r.description}</div>
                          <div style={styles.reportMeta}>
                            <span style={styles.reportMetaItem}><Calendar size={9} /> {r.frequency}</span>
                            <span style={styles.reportMetaItem}><FileText size={9} /> {r.format}</span>
                            {r.lastRun !== '—' && <span style={styles.reportMetaItem}><Clock size={9} /> Último: {r.lastRun}</span>}
                          </div>
                        </div>
                        <div style={styles.reportActions}>
                          {r.scheduled && (
                            <div style={styles.scheduledBadge}><RefreshCw size={8} /> Agendado</div>
                          )}
                          <button style={styles.reportBtnPrimary}><Download size={11} /> Gerar</button>
                          <button style={styles.reportBtnSecondary}><Calendar size={11} /> Agendar</button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Exports */}
              <div style={styles.subSection}>
                <div style={styles.subSectionTitle}>Exports recentes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {recentExports.map((exp, i) => (
                    <div key={i} style={styles.exportRow}>
                      <FileText size={13} color="var(--text-tertiary)" />
                      <span style={styles.exportName}>{exp.name}</span>
                      <span style={styles.exportMeta}>{exp.size}</span>
                      <span style={styles.exportMeta}>{exp.date}</span>
                      <span style={{ ...styles.exportFormat, color: exp.format === 'PDF' ? 'var(--status-error)' : exp.format === 'CSV' ? 'var(--status-online)' : 'var(--accent-amber)' }}>{exp.format}</span>
                      <button style={styles.exportBtn}><Download size={11} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { height: '100%', display: 'flex', overflow: 'hidden' },
  sidebar: { width: '260px', minWidth: '260px', borderRight: '1px solid var(--border-subtle)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-primary)' },
  sidebarTitle: { fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', padding: '0 8px 16px' },
  sectionItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s' },
  sectionItemActive: { background: 'var(--accent-cyan-dim)', border: '1px solid rgba(0,212,255,0.08)' },
  sectionIcon: { width: 34, height: 34, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionName: { fontSize: '13px', fontWeight: 500 },
  sectionDesc: { fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '1px' },
  versionInfo: { marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid var(--border-subtle)' },
  versionLabel: { fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
  versionNumber: { fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' },
  versionBuild: { fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: '2px' },
  content: { flex: 1, overflow: 'auto' },
  contentInner: { padding: '28px 32px', maxWidth: '860px' },
  contentHeader: { marginBottom: '24px' },
  contentTitle: { fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' },
  contentSubtitle: { fontSize: '13px', color: 'var(--text-secondary)', marginTop: '5px' },

  // Integrations
  integrationGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  integrationCard: { background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '18px' },
  intTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  intIcon: { width: 42, height: 42, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  intStatus: { display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase' as const },
  intName: { fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' },
  intDesc: { fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' },
  intUrl: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: '10px' },
  intBtnPrimary: { display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: 'var(--radius-md)', background: 'var(--accent-cyan)', color: '#000', border: 'none', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer' },
  intBtnSecondary: { display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', fontSize: '12px', fontFamily: 'var(--font-body)', cursor: 'pointer' },

  // Projects DB
  actionBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--accent-cyan)', color: '#000', border: 'none', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer' },
  dbStatsRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  dbStatChip: { background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' },
  dbStatValue: { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 },
  dbStatLabel: { fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
  dbFilterRow: { display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' },
  dbSearchBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', borderRadius: 'var(--radius-md)', background: 'var(--surface-input)', border: '1px solid var(--border-default)', flex: 1 },
  dbSearchInput: { flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '12px', fontFamily: 'var(--font-body)' },
  dbFilterBtns: { display: 'flex', gap: '4px' },
  filterBtn: { padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'var(--font-body)', cursor: 'pointer' },
  filterBtnActive: { background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' },
  tableHeader: { display: 'flex', padding: '8px 12px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase' as const, letterSpacing: '0.8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' },
  tableRow: { display: 'flex', alignItems: 'center', padding: '11px 12px', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'border-color 0.15s' },
  projectName: { fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' },
  projectUpdated: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' },
  typeBadge: { fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase' as const },
  statusBadge: { fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase' as const },
  progressBar: { flex: 1, height: 4, borderRadius: '2px', background: 'var(--bg-hover)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '2px', transition: 'width 0.6s ease' },

  // Team
  teamGrid: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' },
  memberCard: { background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' },
  memberTop: { display: 'flex', alignItems: 'center', gap: '14px' },
  memberAvatar: { width: 44, height: 44, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', flexShrink: 0 },
  memberName: { fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' },
  memberEmail: { fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '2px' },
  roleBadge: { display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase' as const },
  memberActive: { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' },
  activeDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  permissionsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const },
  permBadge: { display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase' as const },
  permBadgeOn: { background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' },
  permBadgeOff: { background: 'var(--bg-hover)', color: 'var(--text-tertiary)' },
  memberActions: { display: 'flex', gap: '8px', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' },
  memberBtn: { padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'var(--font-body)', cursor: 'pointer' },
  subSection: { marginBottom: '28px' },
  subSectionTitle: { fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' },
  emptyState: { display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', fontSize: '12px' },

  // Reports
  reportCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' },
  reportIcon: { width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reportName: { fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '3px' },
  reportDesc: { fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' },
  reportMeta: { display: 'flex', gap: '10px' },
  reportMetaItem: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' },
  reportActions: { display: 'flex', flexDirection: 'column' as const, gap: '5px', alignItems: 'flex-end', flexShrink: 0 },
  scheduledBadge: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', padding: '2px 7px', borderRadius: '4px', background: 'var(--accent-cyan-dim)', marginBottom: '4px' },
  reportBtnPrimary: { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--accent-cyan)', color: '#000', border: 'none', fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer' },
  reportBtnSecondary: { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)', fontSize: '11px', fontFamily: 'var(--font-body)', cursor: 'pointer' },
  exportRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--surface-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' },
  exportName: { flex: 1, fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' },
  exportMeta: { fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' },
  exportFormat: { fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700 },
  exportBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'var(--bg-hover)', color: 'var(--text-secondary)', cursor: 'pointer' },
};

export default Settings;
