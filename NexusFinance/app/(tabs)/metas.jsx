import React, { useState } from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
import { keyboardStyles, metasStyles as styles, sharedStyles } from "../styles/styles";

export default function Metas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeMeta, setNomeMeta] = useState("");
  const [valorMeta, setValorMeta] = useState("");
  const [valorAtual, setValorAtual] = useState("");

  const [metas, setMetas] = useState([
    { id: "1", nome: "Comprar um carro", objetivo: 50000, atual: 18000 }
  ]);

  function adicionarMeta() {
    if (!nomeMeta.trim() || !valorMeta.trim() || !valorAtual.trim()) return;

    const novaMeta = {
      id: Date.now().toString(),
      nome: nomeMeta,
      objetivo: Number(valorMeta),
      atual: Number(valorAtual),
    };

    setMetas([...metas, novaMeta]);
    setNomeMeta("");
    setValorMeta("");
    setValorAtual("");
    setModalVisible(false);
  }

  function renderItem({ item, index }) {
    const porcentagem = Math.min((item.atual / item.objetivo) * 100, 100);

    return (
      <AnimatedCard style={styles.card} delay={80 + index * 60}>
        <View style={styles.cardHeader}>
          <Icon name="track-changes" size={32} color="#5145FF" />
          <Text style={styles.nomeMeta}>{item.nome}</Text>
        </View>

        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${porcentagem}%` }]} />
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.valor}>R$ {item.atual.toLocaleString("pt-BR")}</Text>
          <Text style={styles.valor}>R$ {item.objetivo.toLocaleString("pt-BR")}</Text>
        </View>

        <Text style={styles.porcentagem}>{porcentagem.toFixed(0)}%</Text>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedScreen style={styles.container} delay={60}>
      <Text style={styles.title}>Minhas Metas</Text>

      <FlatList
        data={metas}
        contentContainerStyle={sharedStyles.paddingBottom150}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalVisible(true)}>
        <Icon name="add" size={25} color="#FFF" />
        <Text style={styles.botaoTexto}>Adicionar Meta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={keyboardStyles.avoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <ScrollView
          contentContainerStyle={[styles.modalBackground, keyboardStyles.modalScrollContent]}
          keyboardShouldPersistTaps="handled"
        >
          <AnimatedCard style={styles.modal} delay={30}>
            <Text style={styles.modalTitulo}>Nova Meta</Text>

            <TextInput style={styles.input} placeholder="Nome da meta" placeholderTextColor="#888" value={nomeMeta} onChangeText={setNomeMeta} />
            <TextInput style={styles.input} placeholder="Valor da meta" placeholderTextColor="#888" keyboardType="numeric" value={valorMeta} onChangeText={setValorMeta} />
            <TextInput style={styles.input} placeholder="Quanto você já possui?" placeholderTextColor="#888" keyboardType="numeric" value={valorAtual} onChangeText={setValorAtual} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.salvar} onPress={adicionarMeta}>
                <Text style={styles.salvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <BarraNavegacao />
    </AnimatedScreen>
  );
}
