const API_BASE =
  (import.meta.env.VITE_API_URL || "https://dm-tech-services-project-1.onrender.com/api").replace(/\/$/, "");

export function getAuthToken() {
  return localStorage.getItem("dmtech_token");
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("dmtech_token", token);
  } else {
    localStorage.removeItem("dmtech_token");
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}