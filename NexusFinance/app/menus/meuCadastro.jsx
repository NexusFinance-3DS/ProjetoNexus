import ModalAviso from "../../componentes/ModalAviso";
import CampoData from "../../componentes/CampoData";
import { TelaAnimada } from "../componentes/TelaAnimada";
import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { useEstilosApp } from "../estilos/estilos";
import { apiAutenticada } from "../../servicos/financeiro";
import { useSessao } from "../../contextos/ContextoSessao";
export default function MeuCadastro() {
  const {
    cores,
    estilosTeclado,
    estilosMeuCadastro: estilos,
    estilosCompartilhados
  } = useEstilosApp();
  const {
    setUsuario
  } = useSessao();
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
  useFocusEffect(useCallback(() => {
    let ativo = true;
    setErro('');
    apiAutenticada('/usuarios/me').then(({
      usuario
    }) => {
      if (!ativo) return;
      const dados = {
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        nascimento: usuario.dataNascimento || ''
      };
      setNome(dados.nome);
      setEmail(dados.email);
      setTelefone(dados.telefone);
      setNascimento(dados.nascimento);
      setOriginal(dados);
    }).catch(falha => {
      if (ativo) {
        setErro(falha.message);
      }
    });
    return () => {
      ativo = false;
    };
  }, []));
  async function salvarCadastro() {
    if (salvando) return;
    setErro('');
    setSucesso('');
    setPopupErro('');
    const semAlteracao = original && nome.trim() === original.nome && email.trim() === original.email && telefone.trim() === original.telefone && nascimento.trim() === original.nascimento;
    if (semAlteracao) {
      setPopupErro('Você não alterou nenhum dado.');
      return;
    }
    setSalvando(true);
    try {
      const resposta = await apiAutenticada('/usuarios/me', {
        method: 'PUT',
        body: JSON.stringify({
          nome,
          email,
          telefone,
          dataNascimento: nascimento
        })
      });
      setUsuario(atual => ({
        ...atual,
        nome,
        email
      }));
      setSucesso(resposta.mensagem || 'Alterações salvas com sucesso!');
    } catch (falha) {
      setErro(falha.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }
  return <TelaAnimada larguraMaxima={560} style={estilos.recipiente}>
      <ModalAviso visivel={Boolean(sucesso)} titulo="Cadastro atualizado!" mensagem={sucesso} textoBotao="Voltar para o perfil" aoFechar={() => {
      setSucesso('');
      router.replace('/perfil');
    }} />
      <ModalAviso visivel={Boolean(popupErro)} titulo="Nenhuma alteração" mensagem={popupErro} tipo="informacao" aoFechar={() => setPopupErro('')} />

      <AreaTeclado>
        <RolagemFormulario showsVerticalScrollIndicator={false} contentContainerStyle={estilosTeclado.rolagemConteudo} keyboardShouldPersistTaps="handled">
          <View style={estilos.cartao}>
            <View style={estilos.perfilLinha}>
              <View style={estilos.perfilCirculo}>
                <Icon name="person" size={32} color={cores.primaria} />
              </View>

              <View style={estilos.perfilInformacoes}>
                <Text style={estilos.perfilNome}>
                  {nome || 'Usuário'}
                </Text>

                <Text style={estilos.perfilEmail}>
                  {email}
                </Text>
              </View>
            </View>

            <Text style={estilos.perfilSubtitulo}>
              Estes dados são carregados diretamente do seu cadastro.
            </Text>
          </View>

          <View style={estilos.cartao}>
            <Text style={estilos.cartaoTitulo}>
              Informações pessoais
            </Text>

            <CampoFormulario style={estilos.campo} placeholder="Nome completo" placeholderTextColor={cores.textoIndicativo} value={nome} onChangeText={setNome} />

            <CampoFormulario style={estilos.campo} placeholder="E-mail" placeholderTextColor={cores.textoIndicativo} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} mask="email" />

            <CampoFormulario style={estilos.campo} placeholder="Telefone" placeholderTextColor={cores.textoIndicativo} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} mask="phone" maxLength={15} />

            <CampoData style={estilos.campo} placeholder="Data de nascimento (DD/MM/AAAA)" placeholderTextColor={cores.textoIndicativo} value={nascimento} onChangeText={setNascimento} />
          </View>

          <View style={estilos.cartao}>
            <Text style={estilos.cartaoTitulo}>
              Segurança
            </Text>

            <TouchableOpacity style={estilos.itemBotao} onPress={() => router.push('/auth/recuperarSenha')} activeOpacity={0.8}>
              <View style={estilos.itemEsquerda}>
                <Icon name="lock-outline" size={24} color={cores.textoPrincipal} />

                <Text style={estilos.itemTexto}>
                  Alterar senha
                </Text>
              </View>

              <Icon name="chevron-right" size={24} color={cores.textoPrincipal} />
            </TouchableOpacity>
          </View>

          {erro ? <Text style={estilosCompartilhados.erroTexto}>
              {erro}
            </Text> : null}

          <TouchableOpacity style={[estilos.salvarBotao, salvando && estilos.salvarBotaoDesabilitado]} activeOpacity={0.8} onPress={salvarCadastro} disabled={salvando}>
            <Text style={estilos.salvarBotaoTexto}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Text>
          </TouchableOpacity>
        </RolagemFormulario>
      </AreaTeclado>
    </TelaAnimada>;
}
