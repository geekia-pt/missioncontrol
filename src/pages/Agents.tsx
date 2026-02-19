import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Activity, Zap } from 'lucide-react';
import { api, Agent } from '../services/api';

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadAgents = async () => {
    const data = await api.getAgents();
    setAgents(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'busy': return '#f59e0b';
      case 'idle': return '#64748b';
      default: return '#ef4444';
    }
  };

  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <motion.div style={{ marginBottom: '32px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '8px' }}>Agentes IA</h2>
        <p style={{ color: '#94a3b8' }}>Coordenação Claudinho Mission Control</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '16px', right: '16px', width: '12px', height: '12px', borderRadius: '50%', background: getStatusColor(agent.status), boxShadow: `0 0 12px ${getStatusColor(agent.status)}` }} />
            
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: agent.agent_id === 'claudinho' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {agent.agent_id === 'claudinho' ? <Zap size={28} color="#fff" /> : <Bot size={28} color="#3b82f6" />}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>{agent.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>{agent.role}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Activity size={14} color="#64748b" />
              <span style={{ fontSize: '12px', color: '#64748b' }}>{agent.department}</span>
            </div>

            <div style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: `${getStatusColor(agent.status)}15`,
              color: getStatusColor(agent.status),
              fontSize: '12px',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              {agent.status.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
