const BASE_URL = process.env.REACT_APP_API_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('ps_token');
}

function buildHeaders(extra: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as any).message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  get<T>(path: string): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: buildHeaders(),
    }).then((r) => handleResponse<T>(r));
  },

  post<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then((r) => handleResponse<T>(r));
  },

  put<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then((r) => handleResponse<T>(r));
  },

  delete<T>(path: string): Promise<T> {
    return fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }).then((r) => handleResponse<T>(r));
  },
};
