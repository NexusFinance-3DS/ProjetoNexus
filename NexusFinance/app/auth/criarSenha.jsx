import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import { useState } from 'react';
import ModalAviso from "../../componentes/ModalAviso";
import { Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { requisicaoApi } from "../../servicos/api";
import { limparCadastroPendente, obterCadastroPendente } from "../../servicos/fluxoAutenticacao";
import { erroSenha } from "../../servicos/validacoes";
import { useEstilosApp } from "../estilos/estilos";
const CriarSenha = () => {
  const {
    cores,
    estilosCriarSenha: estilos,
    estilosTeclado,
    estilosCompartilhados
  } = useEstilosApp();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // POPUP
  const [sucesso, setSucesso] = useState(false);
  const irParaLogin = () => {
    setSucesso(false);
    router.replace('/auth/login');
  };
  const continuar = async () => {
    if (carregando || sucesso) return;
    const dadosCadastro = obterCadastroPendente();
    if (!dadosCadastro) {
      setErro('Os dados do cadastro não foram encontrados. Volte e preencha novamente.');
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
      await requisicaoApi('/auth/cadastro', {
        method: 'POST',
        body: JSON.stringify({
          ...dadosCadastro,
          senha,
          confirmarSenha
        })
      });
      limparCadastroPendente();

      // ABRE O POPUP
      setSucesso(true);
    } catch (falha) {
      setErro(falha.message || 'Erro ao criar conta.');
    } finally {
      setCarregando(false);
    }
  };
  return <>
      <TelaAnimada larguraMaxima={560} style={estilos.recipiente} atraso={60}>
        <Image source={require('../../assets/images/cadeado.png')} style={[estilosCompartilhados.entradaLogo, {
        marginTop: "20%",
        marginBottom: -50
      }]} resizeMode="contain" accessibilityLabel="Imagem de cadeado" />

        <AreaTeclado style={estilosTeclado.desvioArea}>
          <RolagemFormulario contentContainerStyle={estilosTeclado.centralizadoRolagemConteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <CartaoAnimado style={estilos.conteudo} atraso={80}>
              <Text style={estilos.rotulo}>
                Senha
              </Text>

              <CampoFormulario style={estilos.campo} placeholder="Digite sua senha" placeholderTextColor={cores.textoIndicativo} secureTextEntry value={senha} onChangeText={setSenha} editable={!carregando && !sucesso} />

              <Text style={estilos.rotulo}>
                Confirme sua senha
              </Text>

              <CampoFormulario style={estilos.campo} placeholder="Confirme sua senha" placeholderTextColor={cores.textoIndicativo} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} editable={!carregando && !sucesso} />

              {erro ? <Text style={estilos.erro} accessibilityLiveRegion="polite">
                  {erro}
                </Text> : null}

              <TouchableOpacity style={estilos.botao} onPress={continuar} disabled={carregando || sucesso}>
                <Text style={estilos.botaoTexto}>
                  {carregando ? 'Salvando...' : sucesso ? 'Conta criada!' : 'Criar conta'}
                </Text>
              </TouchableOpacity>
            </CartaoAnimado>
          </RolagemFormulario>
        </AreaTeclado>
      </TelaAnimada>

      <ModalAviso visivel={sucesso} titulo="Conta criada!" mensagem="Seu cadastro foi realizado com sucesso." textoBotao="Ir para o login" aoFechar={irParaLogin} />
    </>;
};
export default CriarSenha;
