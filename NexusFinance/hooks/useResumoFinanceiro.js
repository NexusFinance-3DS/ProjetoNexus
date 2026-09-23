import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { apiAutenticada } from '../services/financeiro';

const EMPTY = {
  saldoDisponivel: 0,
  saldoPrevisto: 0,
  previsao: { totalReceitas: 0, totalDespesas: 0, saldo: 0 },
  atual: { totalReceitas: 0, totalDespesas: 0, saldo: 0 },
  anterior: { totalReceitas: 0, totalDespesas: 0, saldo: 0 },
  economia: { diferenca: 0, percentual: null },
  categorias: [],
  historico: [],
  meta: null,
};

export function useResumoFinanceiro() {
  const [revision, setRevision] = useState(0);
  const recarregar = useCallback(() => setRevision((value) => value + 1), []);
  const [dados, setDados] = useState(EMPTY);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setCarregando(true);
      apiAutenticada('/financeiro/resumo')
        .then((response) => {
          if (active) {
            setDados(response);
            setErro('');
          }
        })
        .catch((error) => active && setErro(error.message))
        .finally(() => active && setCarregando(false));
      return () => {
        active = false;
      };
    }, [revision]),
  );

  return { dados, carregando, erro, recarregar };
}
