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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { AnimatedCard, AnimatedScreen } from '../components/AnimatedScreen';
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
    popupStyles: popup,
  } = useAppStyles();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const animacao = useRef(new Animated.Value(0)).current;
  const envioEmAndamento = useRef(false);
  const navegou = useRef(false);

  const irParaLogin = () => {
    if (navegou.current) return;
    navegou.current = true;
    router.replace('/auth/login');
  };

  useEffect(() => {
    if (!sucesso) return;

    animacao.setValue(0);

    const entrada = Animated.timing(animacao, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    });

    entrada.start();

    const temporizador = setTimeout(irParaLogin, 1500);

    return () => {
      entrada.stop();
      clearTimeout(temporizador);
    };
  }, [sucesso, animacao]);

  const continuar = async () => {
    if (envioEmAndamento.current || sucesso) return;

    const dadosCadastro = obterCadastroPendente();

    if (!dadosCadastro) {
      setErro(
        'Os dados do cadastro não foram encontrados. Volte e preencha novamente.',
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

    envioEmAndamento.current = true;
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
      Keyboard.dismiss();
      setSucesso(true);
    } catch (error) {
      setErro(error.message || 'Não foi possível criar sua conta.');
    } finally {
      envioEmAndamento.current = false;
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
        <KeyboardArea style={keyboardStyles.avoidingView}>
          <FormScrollView
            contentContainerStyle={keyboardStyles.centeredScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AnimatedCard style={styles.content} delay={80}>
              <Text style={styles.label}>Senha</Text>

              <FormInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.placeholder}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                editable={!carregando && !sucesso}
              />

              <Text style={styles.label}>Confirme sua senha</Text>

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
                accessibilityRole="button"
                accessibilityState={{
                  disabled: carregando || sucesso,
                  busy: carregando,
                }}
              >
                <Text style={styles.buttonText}>
                  {sucesso
                    ? 'Conta criada!'
                    : carregando
                      ? 'Salvando...'
                      : 'Criar conta'}
                </Text>
              </TouchableOpacity>
            </AnimatedCard>
          </FormScrollView>
        </KeyboardArea>
      </AnimatedScreen>

      <Modal
        visible={sucesso}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={irParaLogin}
      >
        <View style={popup.fundo}>
          <Animated.View
            accessibilityViewIsModal
            style={[
              popup.card,
              {
                opacity: animacao,
                transform: [
                  {
                    scale: animacao.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={popup.circuloExterno}>
              <View style={popup.circuloInterno}>
                <Icon
                  name="check"
                  size={34}
                  color={colors.surface}
                />
              </View>
            </View>

            <Text
              style={popup.titulo}
              accessibilityLiveRegion="polite"
            >
              Conta criada!
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default CriarSenha;