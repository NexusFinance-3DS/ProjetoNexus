import Constants from 'expo-constants';
import { Platform } from 'react-native';
function obterUrlApi() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (Platform.OS === 'web') return 'http://localhost:3000';
  const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (expoHost) return `http://${expoHost}:3000`;
  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
}
export const URL_API = obterUrlApi();
export async function requisicaoApi(caminho, opcoes = {}) {
  let resposta;
  const multipart = typeof FormData !== 'undefined' && opcoes.body instanceof FormData;
  try {
    resposta = await fetch(`${URL_API}${caminho}`, {
      ...opcoes,
      headers: {
        ...(multipart ? {} : {
          'Content-Type': 'application/json'
        }),
        ...opcoes.headers
      }
    });
  } catch {
    throw new Error('Não foi possível conectar ao serviço. Tente novamente em alguns instantes.');
  }
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const mensagem = typeof dados.mensagem === 'string' ? dados.mensagem.trim() : '';
    if (resposta.status >= 500) throw new Error('O serviço está indisponível no momento. Tente novamente em alguns instantes.');
    throw new Error(mensagem || 'Não foi possível concluir. Confira os dados e tente novamente.');
  }
  return dados;
}
