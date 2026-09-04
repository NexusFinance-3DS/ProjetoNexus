import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import { AnimatedScreen } from "../components/AnimatedScreen";
import { keyboardStyles, novaDespesaStyles as styles, sharedStyles } from "../styles/styles";
import { apiAutenticada, today } from "../../services/financeiro";

export default function NovaDespesa() {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(today());
  const [categoria, setCategoria] = useState("Alimentação");
  const [paga, setPaga] = useState(true);
  const [recorrente, setRecorrente] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      const response = await apiAutenticada("/financeiro/transacoes", {
        method: "POST",
        body: JSON.stringify({ tipo: "Despesa", valor, descricao, data, categoria, recorrente, observacao, status: paga ? "Confirmada" : "Pendente" }),
      });
      Alert.alert("Sucesso", response.mensagem);
      router.replace("/fluxoFinanceiro");
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <KeyboardAvoidingView style={keyboardStyles.avoidingView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={keyboardStyles.scrollContent} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}>
          <View style={styles.addValor}><Text style={styles.titulo}>Adicione o valor:</Text><TextInput style={[styles.InputValor, sharedStyles.textAlignRight]} value={valor} onChangeText={setValor} keyboardType="decimal-pad" placeholder="R$ 0,00" placeholderTextColor="#3f3f3f" /></View>
          <View style={styles.inputFull}><Text style={sharedStyles.formLabel}>Descrição</Text><TextInput style={styles.input} placeholder="Ex.: Conta de luz" placeholderTextColor="#999" value={descricao} onChangeText={setDescricao} /></View>
          <View style={styles.inputFull}><Text style={sharedStyles.formLabel}>Data (AAAA-MM-DD)</Text><TextInput style={styles.input} placeholder="2026-09-04" placeholderTextColor="#999" value={data} onChangeText={setData} /></View>
          <View style={styles.inputFull}><Text style={sharedStyles.formLabel}>Categoria</Text><TextInput style={styles.input} placeholder="Alimentação" placeholderTextColor="#999" value={categoria} onChangeText={setCategoria} /></View>
          <View style={styles.listItem}><View style={styles.iconBox}><Icon name="check-circle" size={20} color="#fff" /></View><View style={sharedStyles.flex}><Text style={styles.listItemText}>Despesa paga</Text><Text style={styles.listItemSub}>{paga ? "Confirmada" : "Pendente"}</Text></View><Switch value={paga} onValueChange={setPaga} /></View>
          <View style={styles.listItem}><View style={styles.iconBox}><Icon name="repeat" size={20} color="#fff" /></View><View style={sharedStyles.flex}><Text style={styles.listItemText}>Despesa fixa</Text><Text style={styles.listItemSub}>Repetição mensal</Text></View><Switch value={recorrente} onValueChange={setRecorrente} /></View>
          <View style={styles.inputFull}><Text style={sharedStyles.formLabel}>Observação (opcional)</Text><TextInput style={[styles.input, sharedStyles.multilineInput]} placeholder="Observação" placeholderTextColor="#999" multiline value={observacao} onChangeText={setObservacao} /></View>
          {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
          <View style={styles.saveWrapper}><TouchableOpacity style={styles.saveButton} onPress={salvar} disabled={salvando}><Text style={styles.saveButtonText}>{salvando ? "Salvando..." : "Salvar despesa"}</Text></TouchableOpacity></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedScreen>
  );
}
