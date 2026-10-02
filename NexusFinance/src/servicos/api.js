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
    throw new Error(`Não foi possível conectar ao servidor em ${URL_API}. Verifique se o backend está ligado.`);
  }
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Não foi possível concluir a operação.');
  }
  return dados;
}
