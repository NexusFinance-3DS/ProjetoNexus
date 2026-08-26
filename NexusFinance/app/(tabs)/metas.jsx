import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/metas";
import barraNavegacao from "../styles/barraNavegacao";

export default function Metas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [menuAberto, setMenuAberto] = useState(null);

  const [nomeMeta, setNomeMeta] = useState("");
  const [valorMeta, setValorMeta] = useState("");
  const [valorAtual, setValorAtual] = useState("");

  const [metas, setMetas] = useState([
    {
      id: "1",
      nome: "Comprar um carro",
      objetivo: 50000,
      atual: 18000,
    }
  ]);

  function adicionarMeta() {
    if (
      nomeMeta.trim() === "" ||
      valorMeta.trim() === "" ||
      valorAtual.trim() === ""
    ) {
      return;
    }

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

  function renderItem({ item }) {
    const porcentagem = Math.min(
      (item.atual / item.objetivo) * 100,
      100
    );

    return (
      <View style={styles.card}>

        <View style={styles.cardHeader}>
          <Icon
            name="track-changes"
            size={32}
            color="#5145FF"
          />

          <Text style={styles.nomeMeta}>
            {item.nome}
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${porcentagem}%` },
            ]}
          />
        </View>

        <View style={styles.infoLinha}>
          <Text style={styles.valor}>
            R$ {item.atual.toLocaleString("pt-BR")}
          </Text>

          <Text style={styles.valor}>
            R$ {item.objetivo.toLocaleString("pt-BR")}
          </Text>
        </View>

        <Text style={styles.porcentagem}>
          {porcentagem.toFixed(0)}%
        </Text>

      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Metas</Text>

      <FlatList
        data={metas}
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      />

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => setModalVisible(true)}
      >
        <Icon
          name="add"
          size={25}
          color="#FFF"
        />

        <Text style={styles.botaoTexto}>
          Adicionar Meta
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalBackground}>

          <View style={styles.modal}>

            <Text style={styles.modalTitulo}>
              Nova Meta
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da meta"
              placeholderTextColor="#888"
              value={nomeMeta}
              onChangeText={setNomeMeta}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor da meta"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={valorMeta}
              onChangeText={setValorMeta}
            />

            <TextInput
              style={styles.input}
              placeholder="Quanto você já possui?"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={valorAtual}
              onChangeText={setValorAtual}
            />

            <View style={styles.modalButtons}>

              <TouchableOpacity
                style={styles.cancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelarTexto}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.salvar}
                onPress={adicionarMeta}
              >
                <Text style={styles.salvarTexto}>
                  Salvar
                </Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>
      </Modal>

      {/* Menu expandido */}
      {menuAberto != null && (
        <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
          <View style={barraNavegacao.overlay} />
        </TouchableWithoutFeedback>
      )}

      {menuAberto === 'add' && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/receita/novaReceita'); }}>
            <Icon name="attach-money" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Receitas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/despesa/novaDespesa'); }}>
            <Icon name="receipt" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/transacoes'); }}>
            <Icon name="swap-horiz" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Transações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/categoria'); }}>
            <Icon name="category" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={barraNavegacao.itemMenu} onPress={() => { setMenuAberto(null); router.push('/metas'); }}>
            <Icon name="flag" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Metas</Text>
          </TouchableOpacity>
        </View>
      )}

      {menuAberto === 'more' && (
        <View style={barraNavegacao.menuExpandido}>
          <TouchableOpacity
            style={barraNavegacao.itemMenu}
            onPress={() => {
              setMenuAberto(null);
              router.push('/dashboard');
            }}
          >
            <Icon name="menu" size={30} color="#fff" />
            <Text style={barraNavegacao.tabLabel}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Barra de navegação inferior */}
      <View style={barraNavegacao.tabBar}>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/inicial')}
          activeOpacity={0.8}
        >
          <Icon name="home" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/fluxoFinanceiro')}
          activeOpacity={0.8}
        >
          <Icon name="swap-horiz" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Fluxo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => setMenuAberto(menuAberto === 'add' ? null : 'add')}
          activeOpacity={0.8}
        >
          <Icon
            name={menuAberto != null ? "close" : "add-circle"}
            size={56}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => router.push('/metas')}
          activeOpacity={0.8}
        >
          <Icon name="radar" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>Metas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={barraNavegacao.tabItem}
          onPress={() => setMenuAberto(menuAberto === 'more' ? null : 'more')}
          activeOpacity={0.8}
        >
          <Icon name="menu" size={32} color="#ffffff" />
          <Text style={barraNavegacao.tabLabel}>mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}