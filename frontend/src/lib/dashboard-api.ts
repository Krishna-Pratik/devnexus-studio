// Dashboard API Service
import { API_URL, apiFetch } from './api';

// ============ PROJECTS ============

export const projectsAPI = {
  getAll: async () => {
    return apiFetch('/projects', { method: 'GET' });
  },

  getOne: async (id: string) => {
    return apiFetch(`/projects/${id}`, { method: 'GET' });
  },

  create: async (data: any) => {
    return apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/projects/${id}`, { method: 'DELETE' });
  },

  getStats: async () => {
    return apiFetch('/projects/stats/overview', { method: 'GET' });
  },
};

// ============ MESSAGES ============

export const messagesAPI = {
  getForProject: async (projectId: string) => {
    return apiFetch(`/messages/${projectId}`, { method: 'GET' });
  },

  send: async (projectId: string, text: string) => {
    return apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify({ projectId, text }),
    });
  },

  delete: async (id: string) => {
    return apiFetch(`/messages/${id}`, { method: 'DELETE' });
  },
};

// ============ PAYMENTS ============

export const paymentsAPI = {
  getAll: async () => {
    return apiFetch('/payments', { method: 'GET' });
  },

  getOne: async (id: string) => {
    return apiFetch(`/payments/${id}`, { method: 'GET' });
  },

  create: async (data: any) => {
    return apiFetch('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiFetch(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getStats: async () => {
    return apiFetch('/payments/stats/overview', { method: 'GET' });
  },
};

// ============ ACTIVITY ============

export const activityAPI = {
  getAll: async (limit: number = 20) => {
    return apiFetch(`/activity?limit=${limit}`, { method: 'GET' });
  },

  getForProject: async (projectId: string, limit: number = 10) => {
    return apiFetch(`/activity/project/${projectId}?limit=${limit}`, { method: 'GET' });
  },

  create: async (data: any) => {
    return apiFetch('/activity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
