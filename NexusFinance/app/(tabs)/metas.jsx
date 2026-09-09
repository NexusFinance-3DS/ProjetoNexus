import { KeyboardArea, FormScrollView, FormInput } from "../../components/FormLayout";
import React, { useCallback, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import BarraNavegacao from "../components/BarraNavegacao";
import { AnimatedCard, AnimatedScreen } from "../components/AnimatedScreen";
import { useAppStyles } from "../styles/styles";
import { apiAutenticada, formatBRL } from "../../services/financeiro";

export default function Metas() {
  const { colors, keyboardStyles, metasStyles: styles, sharedStyles } = useAppStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeMeta, setNomeMeta] = useState("");
  const [valorMeta, setValorMeta] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [metas, setMetas] = useState([]);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarMetas = useCallback(async () => {
    try {
      const response = await apiAutenticada("/metas");
      setMetas(response.metas);
      setErro("");
    } catch (error) {
      setErro(error.message);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregarMetas(); }, [carregarMetas]));

  async function adicionarMeta() {
    setSalvando(true);
    setErro("");
    try {
      await apiAutenticada("/metas", {
        method: "POST",
        body: JSON.stringify({ nome: nomeMeta, objetivo: valorMeta, atual: valorAtual || 0 }),
      });
      setNomeMeta("");
      setValorMeta("");
      setValorAtual("");
      setModalVisible(false);
      await carregarMetas();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  function renderItem({ item, index }) {
    const porcentagem = item.objetivo > 0 ? Math.min((item.atual / item.objetivo) * 100, 100) : 0;
    return (
      <AnimatedCard style={styles.card} delay={80 + index * 60}>
        <View style={styles.cardHeader}><Icon name="track-changes" size={32} color={colors.primary} /><Text style={styles.nomeMeta}>{item.nome}</Text></View>
        <View style={styles.progressBackground}><View style={[styles.progressFill, { width: `${porcentagem}%` }]} /></View>
        <View style={styles.infoLinha}><Text style={styles.valor}>{formatBRL(item.atual)}</Text><Text style={styles.valor}>{formatBRL(item.objetivo)}</Text></View>
        <Text style={styles.porcentagem}>{porcentagem.toFixed(0)}%</Text>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      {erro && !modalVisible ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
      <FlatList data={metas} contentContainerStyle={sharedStyles.paddingBottom150} renderItem={renderItem} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} ListEmptyComponent={<Text style={sharedStyles.errorText}>Nenhuma meta cadastrada.</Text>} />
      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => { setErro(""); setModalVisible(true); }}><Icon name="add" size={25} color={colors.onPrimary} /><Text style={styles.botaoTexto}>Adicionar Meta</Text></TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <KeyboardArea modal style={keyboardStyles.avoidingView}>
          <FormScrollView contentContainerStyle={[styles.modalBackground, keyboardStyles.modalScrollContent]} keyboardShouldPersistTaps="handled">
            <AnimatedCard style={styles.modal} delay={30}>
              <Text style={styles.modalTitulo}>Nova Meta</Text>
              <FormInput style={styles.input} placeholder="Nome da meta" placeholderTextColor={colors.placeholder} value={nomeMeta} onChangeText={setNomeMeta} />
              <FormInput style={styles.input} placeholder="Valor da meta" placeholderTextColor={colors.placeholder} keyboardType="decimal-pad" value={valorMeta} onChangeText={setValorMeta} />
              <FormInput style={styles.input} placeholder="Quanto você já possui?" placeholderTextColor={colors.placeholder} keyboardType="decimal-pad" value={valorAtual} onChangeText={setValorAtual} />
              {erro ? <Text style={sharedStyles.errorText}>{erro}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelar} onPress={() => setModalVisible(false)}><Text style={styles.cancelarTexto}>Cancelar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.salvar} onPress={adicionarMeta} disabled={salvando}><Text style={styles.salvarTexto}>{salvando ? "Salvando..." : "Salvar"}</Text></TouchableOpacity>
              </View>
            </AnimatedCard>
          </FormScrollView>
        </KeyboardArea>
      </Modal>
      <BarraNavegacao />
    </AnimatedScreen>
  );
}
