// Mission Control - API Service
// Conecta frontend ao backend real

const API_URL = process.env.REACT_APP_API_URL || 'https://consist-vids-hours-propecia.trycloudflare.com';

export interface Agent {
  id: string;
  agent_id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'idle' | 'offline' | 'busy';
  capabilities: string[];
  created_at: string;
}

export interface Task {
  id: string;
  task_id: string;
  title: string;
  state: 'inbox' | 'assigned' | 'in_progress' | 'testing' | 'review' | 'done' | 'archived';
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
}

export interface Activity {
  id: string;
  agent_id: string;
  type: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
}

class APIService {
  private async fetch(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async getAgents(): Promise<Agent[]> {
    const data = await this.fetch('/api/agents');
    return data.agents || [];
  }

  async getTasks(): Promise<Task[]> {
    const data = await this.fetch('/api/tasks');
    return data.tasks || [];
  }

  async getActivities(): Promise<Activity[]> {
    const data = await this.fetch('/api/activities');
    return data.activities || [];
  }

  async searchMemory(query: string, limit = 5) {
    return this.fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    });
  }

  connectSSE(onEvent: (event: any) => void) {
    const eventSource = new EventSource(`${API_URL}/api/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (e) {
        console.warn('SSE parse error:', e);
      }
    };
    
    eventSource.onerror = () => {
      console.warn('SSE connection lost, reconnecting...');
    };
    
    return eventSource;
  }
}

export const api = new APIService();
