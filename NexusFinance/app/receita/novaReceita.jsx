import { TransactionSelectors, TransactionAttachment } from "../../components/TransactionOptions";
import { useTransactionOptions } from "../../hooks/useTransactionOptions";
import { KeyboardArea as KeyboardAvoidingView, FormScrollView as ScrollView, FormInput as TextInput } from "../../components/FormLayout";
import React, { useState, useRef } from "react";
import { Alert, Switch, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import { AnimatedScreen } from "../components/AnimatedScreen";
import { useAppStyles } from "../styles/styles";
import { apiAutenticada, today } from "../../services/financeiro";

export default function NovaReceita() {
  const { colors, keyboardStyles, novaReceitaStyles: styles, sharedStyles } = useAppStyles();
  const opcoes = useTransactionOptions("Receita");
  const submitLock = useRef(false);
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(today());
  const [recorrente, setRecorrente] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (submitLock.current) return;
    submitLock.current = true;
    setSalvando(true);
    setErro("");
    try {
      const response = await apiAutenticada("/financeiro/transacoes", opcoes.prepararEnvio({ tipo: "Receita", valor, descricao, data, recorrente, observacao, status: "Confirmada" }));
      Alert.alert("Sucesso", response.mensagem);
      router.replace("/fluxoFinanceiro");
    } catch (error) {
      setErro(error.message);
    } finally {
      submitLock.current = false;
      setSalvando(false);
    }
  }

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <KeyboardAvoidingView style={keyboardStyles.avoidingView}>
        <ScrollView contentContainerStyle={keyboardStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.addValor}>
            <Text style={styles.titulo}>Adicione o valor:</Text>
            <TextInput style={[styles.InputValor, sharedStyles.textAlignRight]} value={valor} onChangeText={setValor} keyboardType="decimal-pad" placeholder="R$ 0,00" placeholderTextColor={colors.placeholder} />
          </View>
          <View style={styles.inputFull}><Text style={sharedStyles.formLabel}>Descrição</Text><TextInput style={styles.input} placeholder="Ex.: Salário" placeholderTextColor={colors.placeholder} value={descricao} onChangeText={setDescricao} /></View>
          <View style={styles.inputFull}><Text style={sharedStyles.formLabel}>Data (AAAA-MM-DD)</Text><TextInput style={styles.input} placeholder="2026-09-04" placeholderTextColor={colors.placeholder} value={data} onChangeText={setData} /></View>
          <TransactionSelectors options={opcoes} disabled={salvando} />
          <View style={styles.listItem}>
            <View style={styles.iconBox}><Icon name="repeat" size={20} color={colors.textPrimary} /></View>
            <View style={sharedStyles.flex}><Text style={styles.listItemText}>Receita fixa</Text><Text style={styles.listItemSub}>Repetição mensal</Text></View>
            <Switch value={recorrente} onValueChange={setRecorrente} />
          </View>
          <View style={styles.inputFull}><Text style={sharedStyles.formLabel}>Observação (opcional)</Text><TextInput style={[styles.input, sharedStyles.multilineInput]} placeholder="Observação" placeholderTextColor={colors.placeholder} multiline value={observacao} onChangeText={setObservacao} /></View>
          <TransactionAttachment options={opcoes} disabled={salvando} />
          {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
          <View style={styles.saveWrapper}><TouchableOpacity style={styles.saveButton} onPress={salvar} disabled={salvando || opcoes.carregando || !!opcoes.erroOpcoes || !opcoes.categoriaId || !opcoes.tipoContaId}><Text style={styles.saveButtonText}>{salvando ? "Salvando..." : "Salvar receita"}</Text></TouchableOpacity></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}