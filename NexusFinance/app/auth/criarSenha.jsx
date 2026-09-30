import {
  KeyboardArea,
  FormScrollView,
  FormInput,
} from '../../components/FormLayout';

import { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

import {
  AnimatedCard,
  AnimatedScreen,
} from '../components/AnimatedScreen';

import { apiRequest } from '../../services/api';

import {
  limparCadastroPendente,
  obterCadastroPendente,
} from '../../services/authFlow';

import { erroSenha } from '../../services/validations';
import { useAppStyles } from '../styles/styles';

const CriarSenha = () => {
  const {
    colors,
    criarSenhaStyles: styles,
    keyboardStyles,
    sharedStyles,
  } = useAppStyles();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // POPUP
  const [sucesso, setSucesso] = useState(false);

  const animacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (sucesso) {
      Keyboard.dismiss();

      animacao.setValue(0);

      Animated.spring(animacao, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
      }).start();
    }
  }, [sucesso, animacao]);

  const irParaLogin = () => {
    setSucesso(false);
    router.replace('/auth/login');
  };

  const continuar = async () => {
    const dadosCadastro = obterCadastroPendente();

    if (!dadosCadastro) {
      setErro(
        'Os dados do cadastro não foram encontrados. Volte e preencha novamente.'
      );
      return;
    }

    const mensagemSenha = erroSenha(senha);

    if (mensagemSenha) {
      setErro(mensagemSenha);
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      await apiRequest('/auth/cadastro', {
        method: 'POST',
        body: JSON.stringify({
          ...dadosCadastro,
          senha,
          confirmarSenha,
        }),
      });

      limparCadastroPendente();

      // ABRE O POPUP
      setSucesso(true);

    } catch (error) {
      setErro(error.message || 'Erro ao criar conta.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <AnimatedScreen
        maxWidth={560}
        style={styles.container}
        delay={60}
      >
        <Image
          source={require('../../assets/images/cadeado.png')}
          style={[
            sharedStyles.loginLogo,
            {
              marginTop: 80,
              marginBottom: -50,
            },
          ]}
          resizeMode="contain"
          accessibilityLabel="Imagem de cadeado"
        />

        <KeyboardArea style={keyboardStyles.avoidingView}>
          <FormScrollView
            contentContainerStyle={
              keyboardStyles.centeredScrollContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AnimatedCard
              style={styles.content}
              delay={80}
            >
              <Text style={styles.label}>
                Senha
              </Text>

              <FormInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.placeholder}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                editable={!carregando && !sucesso}
              />

              <Text style={styles.label}>
                Confirme sua senha
              </Text>

              <FormInput
                style={styles.input}
                placeholder="Confirme sua senha"
                placeholderTextColor={colors.placeholder}
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                editable={!carregando && !sucesso}
              />

              {erro ? (
                <Text
                  style={styles.erro}
                  accessibilityLiveRegion="polite"
                >
                  {erro}
                </Text>
              ) : null}

              <TouchableOpacity
                style={styles.button}
                onPress={continuar}
                disabled={carregando || sucesso}
              >
                <Text style={styles.buttonText}>
                  {carregando
                    ? 'Salvando...'
                    : sucesso
                    ? 'Conta criada!'
                    : 'Criar conta'}
                </Text>
              </TouchableOpacity>
            </AnimatedCard>
          </FormScrollView>
        </KeyboardArea>
      </AnimatedScreen>

      {/* POPUP DE SUCESSO */}

      <Modal
        visible={sucesso}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={irParaLogin}
      >
        <View style={popupStyles.fundo}>
          <Animated.View
            style={[
              popupStyles.card,
              {
                opacity: animacao,

                transform: [
                  {
                    scale: animacao.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={popupStyles.circuloExterno}>
              <View style={popupStyles.circuloInterno}>
                <Icon
                  name="check"
                  size={38}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <Text style={popupStyles.titulo}>
              Conta criada!
            </Text>

            <Text style={popupStyles.texto}>
              Seu cadastro foi realizado com sucesso.
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                popupStyles.botao,
              ]}
              onPress={irParaLogin}
            >
              <Text style={styles.buttonText}>
                Ir para o login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const popupStyles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  card: {
    width: '100%',
    maxWidth: 380,

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    paddingVertical: 30,
    paddingHorizontal: 25,

    alignItems: 'center',

    elevation: 10,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  circuloExterno: {
    width: 90,
    height: 90,

    borderRadius: 45,

    backgroundColor: '#DCFCE7',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 20,
  },

  circuloInterno: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#22C55E',

    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  texto: {
    fontSize: 15,
    color: '#6B7280',

    textAlign: 'center',

    marginTop: 8,
  },

  botao: {
    marginTop: 24,
    width: '100%',
  },
});

export default CriarSenha;