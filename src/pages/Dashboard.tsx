import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Megaphone, Bot, Plus, ArrowUpRight } from 'lucide-react';
import { api, Agent, Task, Activity } from '../services/api';

const Dashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh a cada 10s
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [agentsData, tasksData, activitiesData] = await Promise.all([
        api.getAgents(),
        api.getTasks(),
        api.getActivities()
      ]);
      setAgents(agentsData);
      setTasks(tasksData);
      setActivities(activitiesData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const onlineAgents = agents.filter(a => a.status === 'active' || a.status === 'busy').length;
  const activeTasks = tasks.filter(t => t.state === 'in_progress' || t.state === 'review').length;

  const kpis = [
    { label: 'Tarefas Ativas', value: activeTasks, icon: TrendingUp, color: '#8b5cf6' },
    { label: 'Total Tarefas', value: tasks.length, icon: Users, color: '#3b82f6' },
    { label: 'Atividades Hoje', value: activities.length, icon: Megaphone, color: '#f59e0b' },
    { label: 'Agentes Online', value: `${onlineAgents}/${agents.length}`, icon: Bot, color: '#06b6d4' },
  ];

  if (loading) return <div style={{ padding: '40px', color: '#fff' }}>Carregando...</div>;

  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <motion.div style={{ marginBottom: '32px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '8px' }}>Mission Control</h2>
        <p style={{ color: '#94a3b8' }}>Claudinho coordenando operações</p>
      </motion.div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${kpi.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} color={kpi.color} />
              </div>
              <ArrowUpRight size={16} color="#64748b" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>{kpi.value}</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Atividades Recentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Atividades Recentes</h3>
        <div>
          {activities.slice(0, 10).map((activity, i) => (
            <div
              key={activity.id}
              style={{
                padding: '16px 0',
                borderBottom: i < 9 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ fontSize: '20px' }}>
                  {activity.type === 'system' ? '⚙️' : activity.type === 'task' ? '📋' : '✨'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '4px' }}>{activity.message}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {new Date(activity.created_at).toLocaleString('pt-PT')}
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  background: activity.severity === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                  color: activity.severity === 'success' ? '#22c55e' : '#3b82f6',
                }}>
                  {activity.severity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
