import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, Plus } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  projects: any[];
  created_at: string;
}

const Clients: React.FC = () => {
  const [clients] = useState<Client[]>([
    { id: '1', name: 'Zion Oasis', email: 'contact@zionoasis.pt', phone: '+351 xxx', company: 'Audaces Capital', status: 'active', projects: [{name: 'Zion Oasis', villas: 36}], created_at: new Date().toISOString() },
    { id: '2', name: 'RenovAlgarve', email: 'info@renovalgarve.pt', phone: '+351 xxx', company: 'Marketing', status: 'active', projects: [{name: 'Lead Gen'}], created_at: new Date().toISOString() },
    { id: '3', name: 'ConstruAgil', email: 'walter@construagil.pt', phone: '+351 xxx', company: 'LSF', status: 'active', projects: [{name: 'CMO'}], created_at: new Date().toISOString() }
  ]);

  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <motion.div style={{ marginBottom: '32px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '8px' }}>Clientes</h2>
            <p style={{ color: '#94a3b8' }}>Gestão de clientes e projetos</p>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <Plus size={18} /> Novo Cliente
          </button>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {clients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '24px',
              alignItems: 'start'
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={32} color="#8b5cf6" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>{client.name}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>{client.company}</p>
                </div>
                <div style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  background: 'rgba(34,197,94,0.1)',
                  color: '#22c55e',
                  fontSize: '12px',
                  fontWeight: 600,
                  height: 'fit-content'
                }}>
                  {client.status}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                  <Mail size={16} />
                  {client.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                  <Phone size={16} />
                  {client.phone}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>PROJETOS ATIVOS:</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {client.projects.map((proj, idx) => (
                    <div key={idx} style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(59,130,246,0.1)',
                      color: '#3b82f6',
                      fontSize: '12px'
                    }}>
                      {proj.name} {proj.villas && `(${proj.villas} villas)`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
