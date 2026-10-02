import ModalAviso from "../../componentes/ModalAviso";
import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { CartaoAnimado, TelaAnimada } from "../../componentes/TelaAnimada";
import { requisicaoApi } from "../../servicos/api";
import { limparRecuperacaoPendente, salvarRecuperacaoPendente } from "../../servicos/fluxoAutenticacao";
import { useEstilosApp } from "../../style/style";
import { useSessao } from "../../contextos/ContextoSessao";
import { validarEmail } from "../../servicos/validacoes";
export default function RecuperarSenha() {
  const { autenticado, usuario } = useSessao();
  const {
    cores,
    estilosTeclado,
    estilosRecuperarSenha: estilos
  } = useEstilosApp();
  const [email, setEmail] = useState(usuario?.email || '');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemEnvio, setMensagemEnvio] = useState('');
  useEffect(() => {
    limparRecuperacaoPendente();
  }, []);

  const enviarCodigo = async () => {
    if (carregando) return;
    if (!validarEmail(email)) return setErro('Informe um e-mail válido.');
    limparRecuperacaoPendente();
    setCodigo('');
    setCarregando(true);
    setErro('');
    try {
      const resposta = await requisicaoApi('/auth/recuperar-senha', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase()
        })
      });
      setMensagemEnvio(resposta.mensagem || 'Se o e-mail estiver cadastrado, um código será enviado.');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  };
  const verificarCodigo = async () => {
    if (carregando) return;
    if (!validarEmail(email)) return setErro('Informe um e-mail válido.');
    if (!/^\d{6}$/.test(codigo)) return setErro('Digite o código de 6 números recebido por e-mail.');
    setCarregando(true);
    setErro('');
    try {
      await requisicaoApi('/auth/validar-codigo', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          codigo
        })
      });
      salvarRecuperacaoPendente({
        email: email.trim().toLowerCase(),
        codigo
      });
      router.push(autenticado ? '/auth/alterarSenha' : '/auth/novaSenha');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setCarregando(false);
    }
  };
  return <>
    <TelaAnimada larguraMaxima={560} style={estilos.recipiente} atraso={60}>
      <AreaTeclado style={estilosTeclado.desvioArea}>
        <RolagemFormulario contentContainerStyle={estilosTeclado.centralizadoRolagemConteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <CartaoAnimado style={estilos.conteudo} atraso={80}>
            <Text style={estilos.descricao}>
              {autenticado ? 'Confirme o código enviado ao e-mail da sua conta para alterar sua senha.' : 'Digite seu e-mail para receber um código de recuperação.'}
            </Text>
            <View style={estilos.campoRecipiente1}>
              <CampoFormulario style={estilos.campo} placeholder="Digite seu e-mail" placeholderTextColor={cores.textoIndicativo} keyboardType="email-address" autoCapitalize="none" value={email} editable={!autenticado && !carregando} onChangeText={setEmail} mask="email" />

              <TouchableOpacity style={estilos.botao} onPress={enviarCodigo} disabled={carregando}>
                <Text style={estilos.botaoTexto}>
                  {carregando ? 'Enviando...' : 'Enviar código'}
                </Text>
              </TouchableOpacity>
            </View>

            <CampoFormulario style={estilos.campo} placeholder="Digite o código" placeholderTextColor={cores.textoIndicativo} keyboardType="number-pad" value={codigo} editable={!carregando} onChangeText={setCodigo} mask="digits" maskOptions={{
              maxDigits: 6
            }} maxLength={6} />

            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

            <TouchableOpacity style={estilos.botao} onPress={verificarCodigo} disabled={carregando}>
              <Text style={estilos.botaoTexto}>{carregando ? 'Aguarde...' : 'Continuar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={carregando} onPress={() => router.replace(autenticado ? "/configuracoes" : "/auth/login")}>
              <Text style={estilos.voltar}>{autenticado ? 'Voltar para configurações' : 'Voltar para o login'}</Text>
            </TouchableOpacity>
          </CartaoAnimado>
        </RolagemFormulario>
      </AreaTeclado>
    </TelaAnimada>
    <ModalAviso visivel={Boolean(mensagemEnvio)} titulo="Confira seu e-mail" mensagem={mensagemEnvio} tipo="informacao" aoFechar={() => setMensagemEnvio('')} />
    </>;
}
