import { Platform } from 'react-native';
import Constants from 'expo-constants';
const metroHost = Constants.expoConfig?.hostUri?.split(':')[0];
const webHost = typeof window !== 'undefined' ? window.location.hostname : null;
const host = Platform.OS === 'web' ? webHost || 'localhost' : metroHost || 'localhost';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || `http://${host}:8000/api/v1`).replace(/\/$/, '');
let token = null;
let unauthorized = () => {};
export function setToken(value) {
  token = value;
}
export function onUnauthorized(callback) {
  unauthorized = callback;
}
export function authHeaders() {
  return token ? {
    Authorization: `Bearer ${token}`
  } : {};
}
export async function api(path, {
  method = 'GET',
  body,
  ...options
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  const form = typeof FormData !== 'undefined' && body instanceof FormData;
  try {
    const response = await fetch(API_URL + path, {
      method,
      ...options,
      signal: controller.signal,
      headers: {
        ...authHeaders(),
        ...(body && !form ? {
          'Content-Type': 'application/json'
        } : {}),
        ...options.headers
      },
      body: body ? form ? body : JSON.stringify(body) : undefined
    });
    if (response.status === 204) return null;
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && token) unauthorized();
      const message = Array.isArray(data.detail) ? data.detail.map(item => `${item.loc?.at(-1) || 'Campo'}: ${item.msg}`).join('\n') : data.detail || 'Não foi possível concluir a operação.';
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('O servidor demorou para responder. Tente novamente.');
    if (error instanceof TypeError) throw new Error('Não foi possível conectar à API. Confira o endereço e se o servidor está ligado.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
