// API service utility
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedEnvBase = envApiUrl?.replace(/\/$/, '');
export const API_URL = normalizedEnvBase
  ? `${normalizedEnvBase}/api`
  : '/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem('token');

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${API_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutMs = 15000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      signal: controller.signal,
    });

    window.clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    window.clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to connect to the API server. Please ensure backend is running and reachable.');
    }
    throw error;
  }
};