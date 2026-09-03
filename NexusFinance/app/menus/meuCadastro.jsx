import { useSession } from '../../src/data/Session';
import { api } from '../../src/api/client';
import { isoDate, displayDate } from '../../src/data/format';
import { apiStyles, navigationContentStyle, meuCadastroStyles as styles } from '../../src/styles';
import KeyboardForm from '../../src/components/KeyboardForm';
import React, { useState } from "react";
import BarraNavegacao from '../../src/components/BarraNavegacao';
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialIcons";
export default function MeuCadastro() {
  const {
    user,
    setUser
  } = useSession();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState(null);
  React.useEffect(() => {
    api('/enderecos').then(rows => {
      setAddress(rows[0] || null);
      setEndereco(rows[0]?.logradouro || '');
    }).catch(e => setError(e.message));
  }, []);
  const [nome, setNome] = useState(user?.nome || '');
  const [email] = useState(user?.email || '');
  const [cpf] = useState(user?.cpf || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [nascimento, setNascimento] = useState(displayDate(user?.data_nascimento));
  const [endereco, setEndereco] = useState('');
  const salvarCadastro = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const profile = await api('/usuarios/me', {
        method: 'PUT',
        body: {
          nome,
          telefone: telefone || null,
          data_nascimento: isoDate(nascimento)
        }
      });
      if (endereco || address) {
        const body = address ? {
          cep: address.cep,
          logradouro: endereco,
          numero: address.numero,
          complemento: address.complemento,
          bairro: address.bairro,
          cidade: address.cidade,
          estado: address.estado
        } : {
          logradouro: endereco
        };
        const saved = await api(address ? '/enderecos/' + address.id_endereco : '/enderecos', {
          method: address ? 'PUT' : 'POST',
          body
        });
        setAddress(saved);
      }
      setUser(profile);
      router.replace('/perfil');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <View style={styles.container}>
      <KeyboardForm showsVerticalScrollIndicator={false} contentContainerStyle={navigationContentStyle}>
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

          <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#999" value={nome} onChangeText={setNome} />

          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" value={email} editable={false} />

          <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#999" keyboardType="numeric" value={cpf} editable={false} />

          <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#999" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />

          <TextInput style={styles.input} placeholder="Data de nascimento" placeholderTextColor="#999" value={nascimento} onChangeText={setNascimento} />

          <TextInput style={styles.input} placeholder="Endereço" placeholderTextColor="#999" value={endereco} onChangeText={setEndereco} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Segurança</Text>

          <TouchableOpacity style={styles.itemButton} onPress={() => router.push("/menus/alterarSenha")} activeOpacity={0.8}>
            <View style={styles.itemLeft}>
              <Icon name="lock-outline" size={24} color="#FFF" />
              <Text style={styles.itemText}>Alterar senha</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} disabled={busy} onPress={salvarCadastro}>
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
        </TouchableOpacity>

      {!!error && <Text style={apiStyles.error}>{error}</Text>}</KeyboardForm>

      <BarraNavegacao />
    </View>;
}
