// src/api/api.js
const API_BASE_URL = "http://localhost:8000";

export async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  if (!res.ok) throw new Error(`API error: ${res.statusText}`);
  return await res.json();
}
2