import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import ModalAviso from "../../componentes/ModalAviso";
import { router } from 'expo-router';
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { requisicaoApi } from "../../servicos/api";
import { limparRecuperacaoPendente, obterRecuperacaoPendente } from "../../servicos/fluxoAutenticacao";
import { erroSenha } from "../../servicos/validacoes";
import { useEstilosApp } from "../estilos/estilos";
export default function NovaSenha() {
  const {
    cores,
    estilosTeclado,
    estilosNovaSenha: estilos
  } = useEstilosApp();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const irParaLogin = () => {
    setSucesso(false);
    router.replace('/auth/login');
  };
  useEffect(() => {
    if (!sucesso) return;

    const temporizador = setTimeout(() => {
      setSucesso(false);
      router.replace('/auth/login');
    }, 1500);

    return () => clearTimeout(temporizador);
  }, [sucesso]);

  const alterarSenha = async () => {
    if (carregando || sucesso) return;
    const recuperacao = obterRecuperacaoPendente();
    if (!recuperacao) return setErro('Valide o código de recuperação novamente.');
    const mensagemSenha = erroSenha(senha);
    if (mensagemSenha) return setErro(mensagemSenha);
    if (senha !== confirmarSenha) return setErro('As senhas não coincidem.');
    setCarregando(true);
    setErro('');
    try {
      await requisicaoApi('/auth/nova-senha', {
        method: 'POST',
        body: JSON.stringify({
          ...recuperacao,
          senha,
          confirmarSenha
        })
      });
      limparRecuperacaoPendente();
      setSucesso(true);
    } catch (falha) {
      setErro(falha.message || 'Não foi possível alterar a senha.');
    } finally {
      setCarregando(false);
    }
  };
  return <>
    <TelaAnimada larguraMaxima={560} style={estilos.recipiente} atraso={60}>
      <AreaTeclado style={estilosTeclado.desvioArea}>
        <RolagemFormulario contentContainerStyle={estilosTeclado.centralizadoRolagemConteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <CartaoAnimado style={estilos.conteudo} atraso={80}>
            <Text style={estilos.descricao}>Crie uma nova senha para acessar sua conta.</Text>

            <Text style={estilos.rotulo}>Nova senha</Text>

            <CampoFormulario style={estilos.campo} placeholder="Digite sua nova senha" placeholderTextColor={cores.textoIndicativo} secureTextEntry value={senha} onChangeText={setSenha} editable={!carregando && !sucesso} />

            <Text style={estilos.rotulo}>Confirmar senha</Text>

            <CampoFormulario style={estilos.campo} placeholder="Confirme sua nova senha" placeholderTextColor={cores.textoIndicativo} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} editable={!carregando && !sucesso} />

            {erro ? <Text style={estilos.erro} accessibilityLiveRegion="polite">{erro}</Text> : null}

            <TouchableOpacity style={estilos.botao} onPress={alterarSenha} disabled={carregando || sucesso} accessibilityRole="button">
              <Text style={estilos.botaoTexto}>{carregando ? 'Salvando...' : 'Salvar senha'}</Text>
            </TouchableOpacity>
          </CartaoAnimado>
        </RolagemFormulario>
      </AreaTeclado>
    </TelaAnimada>

    <ModalAviso visivel={sucesso} titulo="Senha alterada!" mensagem="Sua nova senha foi salva com sucesso. Entre na sua conta para continuar." textoBotao="Ir para o login" aoFechar={irParaLogin} />
    </>;
}
