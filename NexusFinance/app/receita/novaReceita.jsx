import React, { useState } from 'react';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/novaReceita';
import barraNavegacao from '../styles/barraNavegacao';

export default function novaReceita() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [valor, setValor] = useState("");
      const [descricao, setdescricao] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.addValor}>
                    <Text style={styles.titulo}>Adicione o valor:</Text>
                    <TextInput
                        style={styles.InputValor}
                        value={valor}
                        onChangeText={(texto) => setValor(`${texto}`)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputFull}>
                    <Text style={{color:"#fff", marginLeft:10,marginBottom:5, fontSize:16,}}>Descrição</Text>
                 <TextInput
                          style={styles.input}
                          placeholder="Descrição:"
                          placeholderTextColor="#999"
                          autoCapitalize="none"
                          value={descricao}
                          onChangeText={setdescricao}
                        />
                        </View>
            </ScrollView>

            {/* Menu expandido */}
            {menuAberto && (
                <View style={barraNavegacao.menuExpandido}>
                    <TouchableOpacity style={barraNavegacao.itemMenu}>
                        <Icon name="attach-money" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Receitas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu}>
                        <Icon name="receipt" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Despesas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu}>
                        <Icon name="swap-horiz" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Transações</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu}>
                        <Icon name="category" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Categoria</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={barraNavegacao.itemMenu}>
                        <Icon name="flag" size={30} color="#fff" />
                        <Text style={barraNavegacao.tabLabel}>Metas</Text>
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
                    <Text style={barraNavegacao.tabLabel}>Fluxo Financeiro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={barraNavegacao.tabItem}
                    onPress={() => setMenuAberto(!menuAberto)}
                    activeOpacity={0.8}
                >
                    <Icon
                        name={menuAberto ? "close" : "add-circle"}
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
                    onPress={() => router.push('/auth/login')}
                    activeOpacity={0.8}
                >
                    <Icon name="menu" size={32} color="#ffffff" />
                    <Text style={barraNavegacao.tabLabel}>mais</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}