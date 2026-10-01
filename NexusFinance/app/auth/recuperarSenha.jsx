import ModalAviso from "../../componentes/ModalAviso";
import { AreaTeclado, RolagemFormulario, CampoFormulario } from "../../componentes/LayoutFormulario";
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { CartaoAnimado, TelaAnimada } from "../componentes/TelaAnimada";
import { requisicaoApi } from "../../servicos/api";
import { salvarRecuperacaoPendente } from "../../servicos/fluxoAutenticacao";
import { useEstilosApp } from "../estilos/estilos";
export default function RecuperarSenha() {
  const {
    cores,
    estilosTeclado,
    estilosRecuperarSenha: estilos
  } = useEstilosApp();
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemEnvio, setMensagemEnvio] = useState('');
  const enviarCodigo = async () => {
    setCarregando(true);
    setErro('');
    try {
      const resposta = await requisicaoApi('/auth/recuperar-senha', {
        method: 'POST',
        body: JSON.stringify({
          email
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
    setCarregando(true);
    setErro('');
    try {
      await requisicaoApi('/auth/validar-codigo', {
        method: 'POST',
        body: JSON.stringify({
          email,
          codigo
        })
      });
      salvarRecuperacaoPendente({
        email: email.trim().toLowerCase(),
        codigo
      });
      router.push('/auth/novaSenha');
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
              Digite seu e-mail para receber um código de recuperação.
            </Text>
            <View style={estilos.campoRecipiente1}>
              <CampoFormulario style={estilos.campo} placeholder="Digite seu e-mail" placeholderTextColor={cores.textoIndicativo} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} mask="email" />

              <TouchableOpacity style={estilos.botao} onPress={enviarCodigo} disabled={carregando}>
                <Text style={estilos.botaoTexto}>
                  {carregando ? 'Enviando...' : 'Enviar código'}
                </Text>
              </TouchableOpacity>
            </View>

            <CampoFormulario style={estilos.campo} placeholder="Digite o código" placeholderTextColor={cores.textoIndicativo} keyboardType="number-pad" value={codigo} onChangeText={setCodigo} mask="digits" maskOptions={{
              maxDigits: 6
            }} maxLength={6} />

            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}

            <TouchableOpacity style={estilos.botao} onPress={verificarCodigo} disabled={carregando}>
              <Text style={estilos.botaoTexto}>{carregando ? 'Aguarde...' : 'Continuar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={estilos.voltar}>Voltar para o login</Text>
            </TouchableOpacity>
          </CartaoAnimado>
        </RolagemFormulario>
      </AreaTeclado>
    </TelaAnimada>
    <ModalAviso visivel={Boolean(mensagemEnvio)} titulo="Confira seu e-mail" mensagem={mensagemEnvio} tipo="informacao" aoFechar={() => setMensagemEnvio('')} />
    </>;
}
