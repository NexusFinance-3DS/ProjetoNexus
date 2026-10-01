import { requisicaoApi } from './api';
import { obterToken } from "./sessao";
export async function apiAutenticada(caminho, opcoes = {}) {
  const token = await obterToken();
  if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
  return requisicaoApi(caminho, {
    ...opcoes,
    headers: {
      ...opcoes.headers,
      Authorization: `Bearer ${token}`
    }
  });
}
export function formatarReais(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
export function formatarData(valor) {
  if (!valor) return '';
  return new Date(`${String(valor).slice(0, 10)}T00:00:00`).toLocaleDateString('pt-BR');
}
export function hoje() {
  const data = new Date();
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}
