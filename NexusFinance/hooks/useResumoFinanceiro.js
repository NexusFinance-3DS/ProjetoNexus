import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { apiAutenticada } from "../services/financeiro";

const EMPTY = {
  atual: { totalReceitas: 0, totalDespesas: 0, saldo: 0 },
  anterior: { totalReceitas: 0, totalDespesas: 0, saldo: 0 },
  economia: { diferenca: 0, percentual: 0 },
  categorias: [],
  historico: [],
  meta: null,
};

export function useResumoFinanceiro() {
  const [dados, setDados] = useState(EMPTY);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useFocusEffect(useCallback(() => {
    let active = true;
    setCarregando(true);
    apiAutenticada("/financeiro/resumo")
      .then((response) => active && setDados(response))
      .catch((error) => active && setErro(error.message))
      .finally(() => active && setCarregando(false));
    return () => { active = false; };
  }, []));

  return { dados, carregando, erro };
}
