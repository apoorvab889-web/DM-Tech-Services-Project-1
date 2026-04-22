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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers || {}),
      },
    });

    if (!response.ok) {
      let message = `Request failed: ${response.status}`;
      try {
        const errorData = await response.json();
        message = errorData?.error || errorData?.message || message;
      } catch {}
      throw new Error(message);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}