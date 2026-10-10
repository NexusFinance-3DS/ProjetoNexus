import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { apiAutenticada } from "../servicos/financeiro";
const VAZIO = {
  saldoTotal: 0,
  saldoReservadoMetas: 0,
  saldoDisponivel: 0,
  saldoPrevisto: 0,
  previsao: {
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0
  },
  atual: {
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0
  },
  anterior: {
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0
  },
  economia: {
    diferenca: 0,
    percentual: null
  },
  variacaoDespesas: {
    atual: 0,
    anterior: 0,
    diferenca: 0,
    percentual: null
  },
  categorias: [],
  historico: [],
  meta: null
};
export function useResumoFinanceiro() {
  const [revisao, setRevisao] = useState(0);
  const recarregar = useCallback(() => setRevisao(valor => valor + 1), []);
  const [dados, setDados] = useState(VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setCarregando(true);
    apiAutenticada('/financeiro/resumo').then(resposta => {
      if (ativo) {
        setDados(resposta);
        setErro('');
      }
    }).catch(falha => ativo && setErro(falha.message)).finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [revisao]));
  return {
    dados,
    carregando,
    erro,
    recarregar
  };
}
