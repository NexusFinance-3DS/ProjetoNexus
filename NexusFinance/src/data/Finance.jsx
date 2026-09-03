import { AppState } from 'react-native';
import { useSession } from './Session';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { localDate, periodDates, displayDate } from './format';
const Context = createContext(null);
const empty = {
  transacoes: [],
  contas: [],
  categorias: [],
  metas: [],
  notificacoes: [],
  catalogos: {},
  configuracoes: {},
  resumo: {},
  anterior: {},
  historico: {}
};
export function FinanceProvider({
  children
}) {
  const {
    user
  } = useSession();
  const userId = user?.id_usuario;
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    if (!userId) return;
    const current = ++generation.current;
    setLoading(true);
    setError('');
    try {
      const now = new Date();
      const priorStart = localDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      const priorEnd = localDate(new Date(now.getFullYear(), now.getMonth(), 0));
      const historyStart = localDate(new Date(now.getFullYear(), now.getMonth() - 5, 1));
      const paths = ['/contas', '/categorias', '/metas', '/notificacoes', '/catalogos', '/configuracoes', '/resumo?' + new URLSearchParams(periodDates()), `/resumo?data_inicio=${priorStart}&data_fim=${priorEnd}`, `/resumo?data_inicio=${historyStart}&data_fim=${localDate()}`];
      const [contas, categorias, metas, notificacoes, catalogos, configuracoes, resumo, anterior, historico] = await Promise.all(paths.map(path => api(path)));
      const entries = [];
      let offset = 0;
      while (true) {
        const page = await api(`/transacoes?limit=500&offset=${offset}`);
        entries.push(...page.items);
        offset += page.items.length;
        if (offset >= page.total || !page.items.length) break;
      }
      if (generation.current !== current) return;
      setData({
        contas,
        categorias,
        catalogos,
        configuracoes,
        resumo,
        anterior,
        historico,
        metas: metas.map(x => ({
          ...x,
          id: String(x.id_meta),
          objetivo: Number(x.valor_objetivo),
          atual: Number(x.valor_atual)
        })),
        notificacoes: notificacoes.map(x => ({
          ...x,
          id: x.id_notificacao,
          hora: x.criado_em?.slice(0, 10),
          icone: 'notifications',
          cor: '#4b3df2'
        })),
        transacoes: entries.map(x => ({
          ...x,
          id: String(x.id_transacao),
          tipoOriginal: x.tipo,
          tipo: x.tipo === 'Receita' ? 'Receitas' : 'Despesas',
          valor: Number(x.valor),
          data: displayDate(x.data_transacao)
        }))
      });
    } catch (e) {
      if (generation.current === current) setError(e.message);
    } finally {
      if (generation.current === current) setLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    refresh();
    return () => {
      generation.current += 1;
    };
  }, [refresh]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => listener.remove();
  }, [refresh]);
  const totals = {
    totalReceitas: Number(data.resumo.total_receitas || 0),
    totalDespesas: Number(data.resumo.total_despesas || 0),
    saldo: Number(data.resumo.saldo || 0)
  };
  const previous = {
    totalReceitas: Number(data.anterior.total_receitas || 0),
    totalDespesas: Number(data.anterior.total_despesas || 0),
    saldo: Number(data.anterior.saldo || 0)
  };
  const economy = totals.totalReceitas - totals.totalDespesas,
    prev = previous.totalReceitas - previous.totalDespesas;
  return <Context.Provider value={{
    ...data,
    loading,
    error,
    refresh,
    totals,
    getTotals: () => totals,
    getPreviousTotals: () => previous,
    getEconomiaComparison: () => ({
      economiaThis: economy,
      economiaPrev: prev,
      diff: economy - prev,
      percent: prev ? (economy - prev) / Math.abs(prev) * 100 : 0
    })
  }}>{children}</Context.Provider>;
}
export const useFinance = () => useContext(Context);
