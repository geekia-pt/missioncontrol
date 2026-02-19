import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DemoBanner from './components/DemoBanner';
import Dashboard from './pages/Dashboard';
import Office from './pages/Office';
import Marketing from './pages/Marketing';
import CRM from './pages/CRM';
import Agents from './pages/Agents';
import Settings from './pages/Settings';
import Hub from './pages/Hub';
import Operational from './pages/Operational';
import Orcamentos from './pages/Orcamentos';
import EstudosMercado from './pages/EstudosMercado';
import Clients from './pages/Clients';
import Financial from './pages/Financial';
import Integrations from './pages/Integrations';
import Memory from './pages/Memory';
import './styles/globals.css';


const App: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider>
        <Router>
          <DemoBanner />
          <div style={styles.appShell}>
            <div className="noise-overlay" />
            <div className="scanlines" />
            <Sidebar />
            <div style={styles.mainArea}>
              <Topbar />
              <main style={styles.mainContent}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/office" element={<Office />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/crm" element={<CRM />} />
                  <Route path="/operational" element={<Operational />} />
                  <Route path="/orcamentos" element={<Orcamentos />} />
                  <Route path="/estudos" element={<EstudosMercado />} />
                  <Route path="/hub" element={<Hub />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/financial" element={<Financial />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/memory" element={<Memory />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appShell: {
    display: 'flex', height: '100vh', width: '100vw',
    overflow: 'hidden', background: 'var(--bg-void)',
  },
  mainArea: {
    flex: 1, display: 'flex', flexDirection: 'column',
    overflow: 'hidden', minWidth: 0,
  },
  mainContent: {
    flex: 1, overflow: 'hidden', background: 'var(--bg-secondary)',
    borderTopLeftRadius: 'var(--radius-xl)', position: 'relative',
  },
};

export default App;
