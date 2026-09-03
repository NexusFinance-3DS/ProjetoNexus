import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api, setToken, onUnauthorized } from '../api/client';
const Context = createContext(null);
const KEY = 'nexus-session';
const storage = {
  get: () => Platform.OS === 'web' ? Promise.resolve(typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(KEY)) : SecureStore.getItemAsync(KEY),
  set: value => Platform.OS === 'web' ? Promise.resolve(value ? sessionStorage.setItem(KEY, value) : sessionStorage.removeItem(KEY)) : value ? SecureStore.setItemAsync(KEY, value) : SecureStore.deleteItemAsync(KEY)
};
export function SessionProvider({
  children
}) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [draft, setDraft] = useState(null);
  const [recovery, setRecovery] = useState(null);
  const clear = useCallback(async () => {
    setToken(null);
    setUser(null);
    setDraft(null);
    setRecovery(null);
    await storage.set(null);
  }, []);
  useEffect(() => {
    onUnauthorized(() => {
      clear().catch(() => {});
    });
    let active = true;
    storage.get().then(async value => {
      if (!active || !value) return;
      setToken(value);
      try {
        const profile = await api('/usuarios/me');
        if (active) setUser(profile);
      } catch {
        await clear();
      }
    }).catch(() => {
      setToken(null);
    }).finally(() => {
      if (active) setBooting(false);
    });
    return () => {
      active = false;
    };
  }, [clear]);
  const authenticate = async (path, data) => {
    const result = await api(path, {
      method: 'POST',
      body: data
    });
    await storage.set(result.access_token);
    setToken(result.access_token);
    setUser(result.usuario);
    setDraft(null);
    setRecovery(null);
  };
  const logout = async () => {
    try {
      await api('/auth/sair', {
        method: 'POST'
      });
    } finally {
      await clear();
    }
  };
  return <Context.Provider value={{
    user,
    setUser,
    booting,
    draft,
    setDraft,
    recovery,
    setRecovery,
    logout,
    clear,
    login: data => authenticate('/auth/login', data),
    register: data => authenticate('/auth/cadastro', data)
  }}>{children}</Context.Provider>;
}
export const useSession = () => useContext(Context);
