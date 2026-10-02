import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import React, { useState } from 'react';
import { router } from 'expo-router';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { TelaAnimada } from "../../componentes/TelaAnimada";
import { requisicaoApi } from "../../servicos/api";
import { useSessao } from "../../contextos/ContextoSessao";
import { useEstilosApp } from "../../style/style";
export default function Login() {
  const {
    cores,
    estilosTeclado,
    estilosLogin: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const {
    iniciarSessao
  } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  function criarConta() {
    router.push('/auth/cadastro');
  }
  function recuperarSenha() {
    router.push('/auth/recuperarSenha');
  }
  async function entrar() {
    if (!email || !senha) {
      setErro('Preencha email e senha.');
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const resposta = await requisicaoApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          senha
        })
      });
      await iniciarSessao(resposta.token, resposta.usuario);
      router.replace('/inicial');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  }
  return <TelaAnimada animada={false} larguraMaxima={560} style={estilos.recipiente}>
      <AreaTeclado style={estilosTeclado.desvioArea}>
        <RolagemFormulario contentContainerStyle={estilosTeclado.autenticacaoRolagemConteudo} resetScrollOnKeyboardHide keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Image source={require('../../../assets/images/foto.png')} style={estilosCompartilhados.entradaLogo} resizeMode="contain" accessibilityLabel="Imagem de perfil" />
          <View style={estilosTeclado.autenticacaoFormulario}>
            <Text style={estilos.rotulo}>E-mail</Text>
            <CampoFormulario style={estilos.campo} value={email} placeholder="Digite seu e-mail" onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" mask="email" placeholderTextColor={cores.textoIndicativo} />

            <Text style={estilos.rotulo}>Senha</Text>
            <CampoFormulario style={estilos.campo} value={senha} placeholder="Digite sua senha" onChangeText={setSenha} secureTextEntry placeholderTextColor={cores.textoIndicativo} />

            <TouchableOpacity accessibilityRole="button" onPress={recuperarSenha}>
              <Text style={estilos.link2}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

            <TouchableOpacity style={estilos.botao} onPress={entrar} disabled={carregando}>
              <Text style={estilos.textoBotao}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity accessibilityRole="button" onPress={criarConta}>
              <Text style={estilos.link}>Ainda não tenho conta</Text>
            </TouchableOpacity>
          </View>
        </RolagemFormulario>
      </AreaTeclado>
    </TelaAnimada>;
}
