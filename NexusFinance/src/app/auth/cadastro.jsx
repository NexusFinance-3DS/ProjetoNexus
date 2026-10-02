import CampoData from "../../componentes/CampoData";
import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import { useState } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { TelaAnimada } from "../../componentes/TelaAnimada";
import { salvarCadastroPendente } from "../../servicos/fluxoAutenticacao";
import { validarDataNascimento, validarEmail } from "../../servicos/validacoes";
import { useEstilosApp } from "../../style/style";
export default function Cadastro() {
  const {
    cores,
    estilosCadastro: estilos,
    estilosTeclado,
    estilosCompartilhados
  } = useEstilosApp();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');
  const continuar = () => {
    if (nome.trim().length < 3) return setErro('Informe o nome completo.');
    if (!validarEmail(email)) return setErro('Informe um e-mail válido.');
    if (!validarDataNascimento(dataNascimento)) return setErro('Use uma data válida no formato DD/MM/AAAA.');
    setErro('');
    salvarCadastroPendente({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      dataNascimento
    });
    router.push('/auth/criarSenha');
  };
  return <TelaAnimada animada={false} larguraMaxima={560} style={estilos.recipiente}>
      <AreaTeclado style={estilosTeclado.desvioArea}>
        <RolagemFormulario contentContainerStyle={estilosTeclado.autenticacaoRolagemConteudo} resetScrollOnKeyboardHide keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Image source={require('../../../assets/images/foto.png')} style={estilosCompartilhados.entradaLogo} resizeMode="contain" accessibilityLabel="Imagem de perfil" />
          <View style={estilosTeclado.autenticacaoFormulario}>
            <CampoFormulario style={estilos.campo} placeholder="E-mail" placeholderTextColor={cores.textoIndicativo} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} mask="email" />

            <CampoFormulario style={estilos.campo} placeholder="Nome completo" placeholderTextColor={cores.textoIndicativo} value={nome} onChangeText={setNome} />

            <CampoData style={estilos.campo} placeholder="Data de nascimento (DD/MM/AAAA)" placeholderTextColor={cores.textoIndicativo} value={dataNascimento} onChangeText={setDataNascimento} />

            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

            <TouchableOpacity style={estilos.botao} onPress={continuar}>
              <Text style={estilos.botaoTexto}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </RolagemFormulario>
      </AreaTeclado>
    </TelaAnimada>;
}
