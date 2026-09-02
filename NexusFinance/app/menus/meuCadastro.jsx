import React, { useState } from "react";
import BarraNavegacao from '../components/BarraNavegacao';
import { View, Text, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback } from "react-native";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

import styles from "../styles/meuCadastro";

export default function MeuCadastro() {
  const [nome, setNome] = useState("Cesar Serra");
  const [email, setEmail] = useState("cesar.serra@gmail.com");
  const [cpf, setCpf] = useState("123.456.789-00");
  const [telefone, setTelefone] = useState("(11) 98765-4321");
  const [nascimento, setNascimento] = useState("01/01/1990");
  const [endereco, setEndereco] = useState("Av. Paulista, 1000");

  const salvarCadastro = () => {
    console.log("Cadastro salvo", { nome, email, cpf, telefone, nascimento, endereco });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.profileCircle}>
              <Icon name="person" size={32} color="#5145FF" />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{nome}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
          </View>

          <Text style={styles.profileSubtitle}>
            Mantenha seus dados sempre atualizados para uma experiência personalizada.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações pessoais</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="CPF"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />

          <TextInput
            style={styles.input}
            placeholder="Data de nascimento"
            placeholderTextColor="#999"
            value={nascimento}
            onChangeText={setNascimento}
          />

          <TextInput
            style={styles.input}
            placeholder="Endereço"
            placeholderTextColor="#999"
            value={endereco}
            onChangeText={setEndereco}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Segurança</Text>

          <TouchableOpacity
            style={styles.itemButton}
            onPress={() => router.push("/auth/recuperarSenha")}
            activeOpacity={0.8}
          >
            <View style={styles.itemLeft}>
              <Icon name="lock-outline" size={24} color="#FFF" />
              <Text style={styles.itemText}>Alterar senha</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.saveButton}        
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/perfil")}
        >
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
        </TouchableOpacity>

      </ScrollView>

      <BarraNavegacao />
    </View>
  );
}
