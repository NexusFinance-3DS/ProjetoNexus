import { apiRequest } from "./api";
import { obterToken } from "./session";

export async function apiAutenticada(path, options = {}) {
  const token = await obterToken();
  if (!token) throw new Error("Sua sessão expirou. Entre novamente.");
  return apiRequest(path, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
}

export function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
