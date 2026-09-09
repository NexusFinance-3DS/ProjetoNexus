import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import BarraNavegacao from "../components/BarraNavegacao";
import { AnimatedCard, AnimatedScreen } from "../components/AnimatedScreen";
import { useAppStyles } from "../styles/styles";
import { apiAutenticada, formatBRL, formatDate } from "../../services/financeiro";
import { abrirAnexo } from "../../services/arquivos";

export default function FluxoFinanceiro() {
  const { colors, fluxoFinanceiroStyles: styles, sharedStyles } = useAppStyles();
  const { aba } = useLocalSearchParams();
  const [abaSelecionada, setAbaSelecionada] = useState(aba || "Geral");
  const [transacoes, setTransacoes] = useState([]);
  const [erro, setErro] = useState("");
  const [abrindo, setAbrindo] = useState(null);
  useEffect(() => { if (['Geral', 'Receitas', 'Despesas'].includes(aba)) setAbaSelecionada(aba); }, [aba]);
  async function baixar(anexo) {
    if (abrindo) return;
    setAbrindo(anexo.id); setErro('');
    try { await abrirAnexo(anexo); } catch (error) { setErro(error.message); }
    finally { setAbrindo(null); }
  }

  useFocusEffect(useCallback(() => {
    let active = true;
    apiAutenticada("/financeiro/transacoes")
      .then((response) => { if (active) { setTransacoes(response.transacoes); setErro(''); } })
      .catch((error) => active && setErro(error.message));
    return () => { active = false; };
  }, []));

  const totalReceitas = useMemo(() => transacoes.filter((item) => item.tipo === "Receitas").reduce((sum, item) => sum + item.valor, 0), [transacoes]);
  const totalDespesas = useMemo(() => transacoes.filter((item) => item.tipo === "Despesas").reduce((sum, item) => sum + item.valor, 0), [transacoes]);
  const transacoesFiltradas = useMemo(() => abaSelecionada === "Geral" ? transacoes : transacoes.filter((item) => item.tipo === abaSelecionada), [abaSelecionada, transacoes]);

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sharedStyles.paddingBottom120}>
        <AnimatedCard style={styles.filtroContainer} delay={40}>
          {["Geral", "Receitas", "Despesas"].map((option) => (
            <TouchableOpacity key={option} style={[styles.botaoFiltro, abaSelecionada === option && styles.botaoAtivo]} onPress={() => setAbaSelecionada(option)}>
              <Text style={[styles.textoFiltro, abaSelecionada === option && styles.textoAtivo]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </AnimatedCard>

        <AnimatedCard style={styles.dados} delay={220}>
          <Text style={styles.dadosTitulo}>{abaSelecionada === "Geral" ? "Transações Recentes" : abaSelecionada}</Text>
          {erro ? <Text style={styles.dadosTexto}>{erro}</Text> : null}
          {transacoesFiltradas.map((item, index) => (
            <AnimatedCard key={item.id} style={styles.transacaoItem} delay={260 + index * 30}>
              <View style={sharedStyles.flex}><Text style={styles.transacaoDescricao}>{item.descricao}</Text><Text style={styles.transacaoCategoria}>{item.categoria} · {item.tipoConta}</Text>{item.anexos?.map((anexo) => <TouchableOpacity key={anexo.id} accessibilityRole="button" accessibilityLabel={`Abrir anexo ${anexo.nome}`} disabled={!!abrindo} onPress={() => baixar(anexo)} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.textLink, fontSize: 13 }}>{abrindo === anexo.id ? 'Baixando...' : `📎 ${anexo.nome}`}</Text></TouchableOpacity>)}</View>
              <View style={styles.transacaoDireita}>
                <Text style={[styles.transacaoValor, item.tipo === "Receitas" ? styles.receita : styles.despesa]}>{item.tipo === "Receitas" ? "+" : "-"} {formatBRL(item.valor)}</Text>
                <Text style={styles.transacaoData}>{formatDate(item.data)}</Text>
              </View>
            </AnimatedCard>
          ))}
          {!erro && transacoesFiltradas.length === 0 ? <Text style={styles.dadosTexto}>Nenhuma transação cadastrada.</Text> : null}
        </AnimatedCard>
      </ScrollView>
      <BarraNavegacao />
    </AnimatedScreen>
  );
}
