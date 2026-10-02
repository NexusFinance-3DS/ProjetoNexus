import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { URL_API } from './api';
import { obterToken } from "./sessao";
function baixarNoNavegador(blob, nome) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
export async function abrirAnexo(anexo) {
  const token = await obterToken();
  if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
  const url = `${URL_API}/financeiro/anexos/${encodeURIComponent(anexo.id)}`;
  const cabecalhos = {
    Authorization: `Bearer ${token}`
  };
  if (Platform.OS === 'web') {
    const resposta = await fetch(url, {
      headers: cabecalhos
    });
    if (!resposta.ok) throw new Error('Não foi possível baixar o arquivo.');
    baixarNoNavegador(await resposta.blob(), anexo.nome);
    return;
  }
  if (!(await Sharing.isAvailableAsync())) throw new Error('O compartilhamento de arquivos não está disponível neste aparelho.');
  const nome = anexo.nome.replace(/[^\p{L}\p{N}._ -]/gu, '_').replace(/^\.+/, '_');
  const destino = `${FileSystem.cacheDirectory}anexo-${anexo.id}-${nome}`;
  try {
    const resultado = await FileSystem.downloadAsync(url, destino, {
      headers: cabecalhos
    });
    if (resultado.status !== 200) throw new Error('Não foi possível baixar o arquivo.');
    await Sharing.shareAsync(resultado.uri, {
      dialogTitle: anexo.nome
    });
  } finally {
    await FileSystem.deleteAsync(destino, {
      idempotent: true
    });
  }
}
export async function exportarCSV(transacoes) {
  const cell = valor => {
    const texto = String(valor ?? '');
    // Prevent spreadsheet applications from interpreting user text as formulas.
    return `"${(/^[\s]*[=+@-]/.test(texto) ? "'" + texto : texto).replace(/"/g, '""')}"`;
  };
  const linhas = [['Data', 'Descrição', 'Tipo', 'Categoria', 'Tipo de conta', 'Valor', 'Status', 'Observação'], ...transacoes.map(t => [t.data, t.descricao, t.tipo, t.categoria, t.tipoConta, Number(t.valor).toFixed(2).replace('.', ','), t.status, t.observacao])];
  const csv = '\ufeff' + linhas.map(linha => linha.map(cell).join(';')).join('\r\n');
  const nome = 'nexus-transacoes.csv';
  if (Platform.OS === 'web') {
    baixarNoNavegador(new Blob([csv], {
      type: 'text/csv;charset=utf-8'
    }), nome);
    return;
  }
  if (!(await Sharing.isAvailableAsync())) throw new Error('O compartilhamento não está disponível neste aparelho.');
  const uri = FileSystem.cacheDirectory + nome;
  try {
    await FileSystem.writeAsStringAsync(uri, csv);
    await Sharing.shareAsync(uri, {
      mimeType: 'text/csv',
      UTI: 'public.comma-separated-values-text',
      dialogTitle: 'Exportar transações'
    });
  } finally {
    await FileSystem.deleteAsync(uri, {
      idempotent: true
    });
  }
}
