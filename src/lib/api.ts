const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

export type ApiError = { message: string };

export function getApiBase() {
  return API_BASE;
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dmtech_token');
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('dmtech_token', token);
  else localStorage.removeItem('dmtech_token');
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new Error(`Network error: could not reach ${API_BASE}. Make sure the backend is running and CORS allows your frontend origin.`);
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload?.error || payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}
