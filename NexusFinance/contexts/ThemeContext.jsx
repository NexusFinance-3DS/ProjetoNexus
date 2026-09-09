import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Appearance, Platform, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import * as SecureStore from 'expo-secure-store';
import { useSession } from './SessionContext';
import { apiRequest } from '../services/api';
import { isTheme, palettes } from '../theme/palettes';

const ThemeContext = createContext(null);
const DEVICE_KEY = 'nexus_theme';
const read = async (key) => Platform.OS === 'web' ? localStorage.getItem(key) : SecureStore.getItemAsync(key);
const write = async (key, value) => Platform.OS === 'web' ? localStorage.setItem(key, value) : SecureStore.setItemAsync(key, value);

export function AppThemeProvider({ children }) {
  const { token, usuario } = useSession();
  const userId = usuario?.id;
  const [tema, setTema] = useState('escuro');
  const [pronto, setPronto] = useState(false);
  const [salvandoTema, setSalvandoTema] = useState(false);
  const [erroTema, setErroTema] = useState('');
  const revision = useRef(0);
  const saving = useRef(false);
  const identity = useRef(token);
  identity.current = token;

  useEffect(() => {
    let active = true;
    read(DEVICE_KEY).then((saved) => { if (active && isTheme(saved)) setTema(saved); }).catch(() => {}).finally(() => active && setPronto(true));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!pronto || !token || !userId) return;
    let active = true;
    const initialRevision = revision.current;
    const key = `${DEVICE_KEY}_${userId}`;
    async function restore() {
      try {
        const cached = await read(key).catch(() => null);
        if (active && revision.current === initialRevision) setTema(isTheme(cached) ? cached : 'escuro');
        const data = await apiRequest('/configuracoes', { headers: { Authorization: `Bearer ${token}` } });
        if (active && revision.current === initialRevision && isTheme(data.tema)) {
          setTema(data.tema);
          await Promise.all([write(key, data.tema), write(DEVICE_KEY, data.tema)]);
        }
      } catch { /* Keep the cached theme when offline. */ }
    }
    setErroTema('');
    restore();
    return () => { active = false; };
  }, [pronto, token, userId]);

  const colors = palettes[tema];
  useEffect(() => {
    if (!pronto) return;
    if (Platform.OS === 'web') document.documentElement.style.colorScheme = tema === 'escuro' ? 'dark' : 'light';
    else Appearance.setColorScheme(tema === 'escuro' ? 'dark' : 'light');
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [tema, colors, pronto]);

  async function alterarTema(next) {
    if (!isTheme(next) || saving.current || next === tema) return;
    const previous = tema;
    const owner = token;
    revision.current += 1;
    saving.current = true;
    setSalvandoTema(true); setErroTema(''); setTema(next);
    try {
      if (owner) await apiRequest('/configuracoes', { method: 'PUT', headers: { Authorization: `Bearer ${owner}` }, body: JSON.stringify({ tema: next }) });
      if (identity.current !== owner) return;
      // The database is authoritative. A cache failure must not undo a saved preference.
      try { await Promise.all([write(DEVICE_KEY, next), ...(userId ? [write(`${DEVICE_KEY}_${userId}`, next)] : [])]); }
      catch { setErroTema('Tema aplicado. Não foi possível guardar a cópia neste aparelho.'); }
    } catch (error) {
      if (identity.current === owner) { setTema(previous); setErroTema(error.message); }
    } finally { saving.current = false; setSalvandoTema(false); }
  }

  const navigationTheme = useMemo(() => ({
    ...(tema === 'escuro' ? DarkTheme : DefaultTheme),
    colors: { ...(tema === 'escuro' ? DarkTheme.colors : DefaultTheme.colors), primary: colors.primary, background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.border, notification: colors.danger },
  }), [tema, colors]);

  if (!pronto) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  return <ThemeContext.Provider value={{ tema, colors, isDark: tema === 'escuro', alterarTema, salvandoTema, erroTema }}>
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={tema === 'escuro' ? 'light' : 'dark'} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>{children}</View>
    </NavigationThemeProvider>
  </ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de AppThemeProvider.');
  return context;
}

export function useThemedStyles(createStyles) {
  const { colors } = useTheme();
  return useMemo(() => createStyles(colors), [createStyles, colors]);
}
