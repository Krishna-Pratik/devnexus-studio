// API service utility
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedEnvBase = envApiUrl?.replace(/\/$/, '');
const envHasApiSuffix = normalizedEnvBase?.endsWith('/api');
export const API_URL = normalizedEnvBase
  ? (envHasApiSuffix ? normalizedEnvBase : `${normalizedEnvBase}/api`)
  : '/api';

const REQUEST_TIMEOUT_MS = 35000;

const createTypedError = (message: string, details: Record<string, unknown> = {}) => {
  const error = new Error(message) as Error & Record<string, unknown>;
  Object.assign(error, details);
  return error;
};

type ApiFetchOptions = RequestInit & {
  retryOnTimeout?: boolean;
  timeoutMs?: number;
};

export const apiFetch = async (endpoint: string, options: ApiFetchOptions = {}) => {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem('token');

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${API_URL}${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();
  const isIdempotentMethod = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
  const retryOnTimeout = options.retryOnTimeout ?? isIdempotentMethod;
  const timeoutMs = options.timeoutMs ?? REQUEST_TIMEOUT_MS;

  const maxAttempts = retryOnTimeout ? 2 : 1;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
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
        throw createTypedError(errorMessage, {
          type: 'server',
          code: `HTTP_${response.status}`,
          status: response.status,
        });
      }

      return data;
    } catch (error) {
      window.clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        if (attempt < maxAttempts) {
          continue;
        }
        throw createTypedError('Server is waking up, please wait and try again.', {
          type: 'timeout',
          code: 'TIMEOUT',
          status: 408,
        });
      }

      if (error instanceof TypeError) {
        throw createTypedError('Unable to connect to the server. Please check your internet connection and try again.', {
          type: 'network',
          code: 'NETWORK_ERROR',
        });
      }

      throw error;
    }
  }

  throw createTypedError('An unexpected API error occurred.', { type: 'unknown', code: 'UNKNOWN' });
};