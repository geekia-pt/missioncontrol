import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Zap, AlertCircle } from 'lucide-react';

interface FinancialData {
  daily_cost: number;
  breakdown: {
    anthropic: { cost: number; percentage: string };
    openai: { cost: number; percentage: string };
    openrouter: { cost: number; percentage: string };
  };
  total_calls: number;
  optimization_tips: string[];
}

const Financial: React.FC = () => {
  const [data, setData] = useState<FinancialData | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_URL}/api/financial`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Erro ao carregar dados financeiros:', e);
    }
  };

  if (!data) return <div style={{ padding: '40px', color: '#fff' }}>Carregando...</div>;

  const providers = [
    { name: 'Claude (Anthropic)', key: 'anthropic', color: '#8b5cf6', icon: '🧠' },
    { name: 'OpenAI', key: 'openai', color: '#3b82f6', icon: '🤖' },
    { name: 'OpenRouter', key: 'openrouter', color: '#10b981', icon: '⚡' }
  ];

  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <motion.div style={{ marginBottom: '32px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '8px' }}>Controle Financeiro</h2>
        <p style={{ color: '#94a3b8' }}>Otimização de custos com Model Router</p>
      </motion.div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <DollarSign size={24} color="#22c55e" />
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>CUSTO DIÁRIO</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700 }}>${data.daily_cost.toFixed(2)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Zap size={24} color="#3b82f6" />
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>CHAMADAS HOJE</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700 }}>{data.total_calls}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <TrendingDown size={24} color="#10b981" />
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>ECONOMIA VS CLAUDE ONLY</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, color: '#22c55e' }}>~75%</div>
        </motion.div>
      </div>

      {/* Breakdown por provider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Uso por Provider</h3>
        
        {providers.map((provider, i) => {
          const providerData = data.breakdown[provider.key as keyof typeof data.breakdown];
          return (
            <div key={provider.key} style={{ marginBottom: i < 2 ? '20px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{provider.icon}</span>
                  <span>{provider.name}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>${providerData.cost.toFixed(2)}</span>
                  <span style={{ color: '#64748b', marginLeft: '8px' }}>({providerData.percentage}%)</span>
                </div>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${providerData.percentage}%`,
                  height: '100%',
                  background: provider.color,
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Dicas de otimização */}
      {data.optimization_tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <AlertCircle size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f59e0b' }}>Dicas de Otimização</h3>
          </div>
          {data.optimization_tips.map((tip, i) => (
            <div key={i} style={{ marginBottom: i < data.optimization_tips.length - 1 ? '8px' : 0, color: '#fbbf24', fontSize: '14px' }}>
              • {tip}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Financial;
