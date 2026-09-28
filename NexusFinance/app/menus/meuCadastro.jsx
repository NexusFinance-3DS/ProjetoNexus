import DateInput from '../../components/DateInput';
import { AnimatedScreen } from '../components/AnimatedScreen';
import {
  KeyboardArea,
  FormScrollView,
  FormInput,
} from '../../components/FormLayout';

import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';

import { useAppStyles } from '../styles/styles';
import { apiAutenticada } from '../../services/financeiro';
import { useSession } from '../../contexts/SessionContext';

export default function MeuCadastro() {
  const {
    colors,
    keyboardStyles,
    meuCadastroStyles: styles,
    sharedStyles,
  } = useAppStyles();

  const { setUsuario } = useSession();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');

  // dados originais carregados da API (para detectar se algo mudou)
  const [original, setOriginal] = useState(null);

  const [erro, setErro] = useState('');
  const [popupErro, setPopupErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setErro('');

      apiAutenticada('/usuarios/me')
        .then(({ usuario }) => {
          if (!active) return;

          const dados = {
            nome: usuario.nome || '',
            email: usuario.email || '',
            telefone: usuario.telefone || '',
            nascimento: usuario.dataNascimento || '',
          };

          setNome(dados.nome);
          setEmail(dados.email);
          setTelefone(dados.telefone);
          setNascimento(dados.nascimento);
          setOriginal(dados);
        })
        .catch((error) => {
          if (active) {
            setErro(error.message);
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  async function salvarCadastro() {
    if (salvando) return;

    setErro('');
    setSucesso('');
    setPopupErro('');

    const semAlteracao =
      original &&
      nome.trim() === original.nome &&
      email.trim() === original.email &&
      telefone.trim() === original.telefone &&
      nascimento.trim() === original.nascimento;

    if (semAlteracao) {
      setPopupErro('Você não alterou nenhum dado.');
      setTimeout(() => setPopupErro(''), 3000);
      return;
    }

    setSalvando(true);

    try {
      const response = await apiAutenticada('/usuarios/me', {
        method: 'PUT',
        body: JSON.stringify({
          nome,
          email,
          telefone,
          dataNascimento: nascimento,
        }),
      });

      setUsuario((current) => ({
        ...current,
        nome,
        email,
      }));

      setSucesso(response.mensagem || 'Alterações salvas com sucesso!');

      setTimeout(() => {
        setSucesso('');
        router.replace('/perfil');
      }, 2500); // antes: 1200
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <AnimatedScreen maxWidth={560} style={styles.container}>
      {sucesso ? (
        <View style={styles.popupSucesso}>
          <Icon
            name="check-circle"
            size={20}
            color={colors.success || '#22C55E'}
          />

          <Text style={styles.popupSucessoTexto}>
            {sucesso}
          </Text>
        </View>
      ) : null}

      {popupErro ? (
        <View style={styles.popupErro}>
          <Icon
            name="error-outline"
            size={20}
            color={colors.error || '#EF4444'}
          />

          <Text style={styles.popupErroTexto}>
            {popupErro}
          </Text>
        </View>
      ) : null}

      <KeyboardArea>
        <FormScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={keyboardStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.profileCircle}>
                <Icon
                  name="person"
                  size={32}
                  color={colors.primary}
                />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {nome || 'Usuário'}
                </Text>

                <Text style={styles.profileEmail}>
                  {email}
                </Text>
              </View>
            </View>

            <Text style={styles.profileSubtitle}>
              Estes dados são carregados diretamente do seu cadastro.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Informações pessoais
            </Text>

            <FormInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={colors.placeholder}
              value={nome}
              onChangeText={setNome}
            />

            <FormInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <FormInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor={colors.placeholder}
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />

            <DateInput
              style={styles.input}
              placeholder="Data de nascimento (DD/MM/AAAA)"
              placeholderTextColor={colors.placeholder}
              value={nascimento}
              onChangeText={setNascimento}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Segurança
            </Text>

            <TouchableOpacity
              style={styles.itemButton}
              onPress={() => router.push('/auth/recuperarSenha')}
              activeOpacity={0.8}
            >
              <View style={styles.itemLeft}>
                <Icon
                  name="lock-outline"
                  size={24}
                  color={colors.textPrimary}
                />

                <Text style={styles.itemText}>
                  Alterar senha
                </Text>
              </View>

              <Icon
                name="chevron-right"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {erro ? (
            <Text style={sharedStyles.errorText}>
              {erro}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.saveButton,
              salvando && styles.saveButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={salvarCadastro}
            disabled={salvando}
          >
            <Text style={styles.saveButtonText}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Text>
          </TouchableOpacity>
        </FormScrollView>
      </KeyboardArea>
    </AnimatedScreen>
  );
}