import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Appearance, Platform, View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import * as SecureStore from 'expo-secure-store';
import { useSessao } from "./ContextoSessao";
import { requisicaoApi } from "../servicos/api";
import { temaValido, paletas } from "../tema/paletas";
const ContextoTema = createContext(null);
const CHAVE_APARELHO = 'nexus_theme';
const ler = async chave => Platform.OS === 'web' ? localStorage.getItem(chave) : SecureStore.getItemAsync(chave);
const gravar = async (chave, valor) => Platform.OS === 'web' ? localStorage.setItem(chave, valor) : SecureStore.setItemAsync(chave, valor);
export function ProvedorTema({
  children: filhos
}) {
  const {
    token,
    usuario
  } = useSessao();
  const idUsuario = usuario?.id;
  const [tema, setTema] = useState('escuro');
  const [pronto, setPronto] = useState(false);
  const [salvandoTema, setSalvandoTema] = useState(false);
  const [erroTema, setErroTema] = useState('');
  const revisao = useRef(0);
  const salvando = useRef(false);
  const identidade = useRef(token);
  identidade.current = token;
  useEffect(() => {
    let ativo = true;
    ler(CHAVE_APARELHO).then(salvo => {
      if (ativo && temaValido(salvo)) setTema(salvo);
    }).catch(() => {}).finally(() => ativo && setPronto(true));
    return () => {
      ativo = false;
    };
  }, []);
  useEffect(() => {
    if (!pronto || !token || !idUsuario) return;
    let ativo = true;
    const revisaoInicial = revisao.current;
    const chave = `${CHAVE_APARELHO}_${idUsuario}`;
    async function restaurar() {
      try {
        const emCache = await ler(chave).catch(() => null);
        if (ativo && revisao.current === revisaoInicial) setTema(temaValido(emCache) ? emCache : 'escuro');
        const dados = await requisicaoApi('/configuracoes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (ativo && revisao.current === revisaoInicial && temaValido(dados.tema)) {
          setTema(dados.tema);
          await Promise.all([gravar(chave, dados.tema), gravar(CHAVE_APARELHO, dados.tema)]);
        }
      } catch {
        /* Mantém o tema em cache quando não há conexão. */
      }
    }
    setErroTema('');
    restaurar();
    return () => {
      ativo = false;
    };
  }, [pronto, token, idUsuario]);
  const cores = paletas[tema];
  useEffect(() => {
    if (!pronto) return;
    if (Platform.OS === 'web') document.documentElement.style.colorScheme = tema === 'escuro' ? 'dark' : 'light';else Appearance.setColorScheme(tema === 'escuro' ? 'dark' : 'light');
    SystemUI.setBackgroundColorAsync(cores.fundo).catch(() => {});
  }, [tema, cores, pronto]);
  async function alterarTema(proximo) {
    if (!temaValido(proximo) || salvando.current || proximo === tema) return;
    const anterior = tema;
    const responsavel = token;
    revisao.current += 1;
    salvando.current = true;
    setSalvandoTema(true);
    setErroTema('');
    setTema(proximo);
    try {
      if (responsavel) await requisicaoApi('/configuracoes', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${responsavel}`
        },
        body: JSON.stringify({
          tema: proximo
        })
      });
      if (identidade.current !== responsavel) return;
      // O banco é a fonte principal. Falhas no cache não desfazem uma preferência salva.
      try {
        await Promise.all([gravar(CHAVE_APARELHO, proximo), ...(idUsuario ? [gravar(`${CHAVE_APARELHO}_${idUsuario}`, proximo)] : [])]);
      } catch {
        setErroTema('Tema aplicado. Não foi possível guardar a cópia neste aparelho.');
      }
    } catch (falha) {
      if (identidade.current === responsavel) {
        setTema(anterior);
        setErroTema(falha.message);
      }
    } finally {
      salvando.current = false;
      setSalvandoTema(false);
    }
  }
  const navigationTheme = useMemo(() => ({
    ...(tema === 'escuro' ? DarkTheme : DefaultTheme),
    colors: {
      ...(tema === 'escuro' ? DarkTheme.colors : DefaultTheme.colors),
      primary: cores.primaria,
      background: cores.fundo,
      card: cores.superficie,
      text: cores.textoPrincipal,
      border: cores.borda,
      notification: cores.perigo
    }
  }), [tema, cores]);
  if (!pronto) return <View style={{
    flex: 1,
    backgroundColor: cores.fundo
  }} />;
  return <ContextoTema.Provider value={{
    tema,
    cores,
    temaEscuro: tema === 'escuro',
    alterarTema,
    salvandoTema,
    erroTema
  }}>
      <NavigationThemeProvider value={navigationTheme}>
        <StatusBar style={tema === 'escuro' ? 'light' : 'dark'} />
        <View style={{
        flex: 1,
        backgroundColor: cores.fundo
      }}>{filhos}</View>
      </NavigationThemeProvider>
    </ContextoTema.Provider>;
}
export function useTema() {
  const contexto = useContext(ContextoTema);
  if (!contexto) throw new Error("useTema deve ser usado dentro de ProvedorTema.");
  return contexto;
}
export function useEstilosTema(criarEstilos) {
  const {
    cores
  } = useTema();
  return useMemo(() => criarEstilos(cores), [criarEstilos, cores]);
}
