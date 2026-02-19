// ═══════════════════════════════════════════════
// MISSION CONTROL — Unified App Context
// Points 5, 6, 7: Demo Mode, Privacy, Unified State
// ═══════════════════════════════════════════════

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ── App Config ──
export interface AppConfig {
  demoMode: boolean;       // Point 5: Read-only demo mode
  privacyMode: boolean;    // Point 6: Hide sensitive data
  sseConnected: boolean;   // Point 8: SSE connection status
  version: string;
  environment: 'development' | 'staging' | 'production';
}

// ── Notification ──
export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}

// ── Context Shape ──
interface AppContextType {
  config: AppConfig;
  notifications: AppNotification[];
  // Actions
  toggleDemoMode: () => void;
  togglePrivacyMode: () => void;
  setSSEConnected: (connected: boolean) => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  // Privacy helpers
  maskEmail: (email: string) => string;
  maskPhone: (phone: string) => string;
  maskValue: (value: number) => string;
  maskName: (name: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// ── Provider ──
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>({
    demoMode: false,
    privacyMode: false,
    sseConnected: false,
    version: '2.1.0',
    environment: 'development',
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'n-1', type: 'warning', message: 'Onyx (WhatsApp) offline há 3h', timestamp: '2026-02-19 06:12', read: false },
    { id: 'n-2', type: 'info', message: 'Pipeline review agendada sexta 16h', timestamp: '2026-02-19 09:00', read: false },
    { id: 'n-3', type: 'success', message: 'Campanha Spring Launch ativada', timestamp: '2026-02-19 08:00', read: true },
  ]);

  // ── Toggle Demo Mode ──
  const toggleDemoMode = useCallback(() => {
    setConfig(prev => ({ ...prev, demoMode: !prev.demoMode }));
  }, []);

  // ── Toggle Privacy Mode ──
  const togglePrivacyMode = useCallback(() => {
    setConfig(prev => ({ ...prev, privacyMode: !prev.privacyMode }));
  }, []);

  // ── SSE Connection ──
  const setSSEConnected = useCallback((connected: boolean) => {
    setConfig(prev => ({ ...prev, sseConnected: connected }));
  }, []);

  // ── Notifications ──
  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const notification: AppNotification = {
      ...n,
      id: `n-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Cap at 50
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // ── Privacy Masking Helpers ──
  const maskEmail = useCallback((email: string): string => {
    if (!config.privacyMode) return email;
    const [user, domain] = email.split('@');
    return `${user[0]}${'•'.repeat(user.length - 1)}@${domain}`;
  }, [config.privacyMode]);

  const maskPhone = useCallback((phone: string): string => {
    if (!config.privacyMode) return phone;
    return phone.slice(0, 4) + ' ••• •••' + phone.slice(-2);
  }, [config.privacyMode]);

  const maskValue = useCallback((value: number): string => {
    if (!config.privacyMode) return `€${value.toLocaleString()}`;
    return '€•••••';
  }, [config.privacyMode]);

  const maskName = useCallback((name: string): string => {
    if (!config.privacyMode) return name;
    const parts = name.split(' ');
    return parts.map((p, i) => i === 0 ? p : p[0] + '•••').join(' ');
  }, [config.privacyMode]);

  return (
    <AppContext.Provider value={{
      config,
      notifications,
      toggleDemoMode,
      togglePrivacyMode,
      setSSEConnected,
      addNotification,
      markNotificationRead,
      clearNotifications,
      maskEmail,
      maskPhone,
      maskValue,
      maskName,
    }}>
      {children}
    </AppContext.Provider>
  );
};
