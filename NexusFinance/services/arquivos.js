import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { API_URL } from './api';
import { obterToken } from './session';

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
  const url = `${API_URL}/financeiro/anexos/${encodeURIComponent(anexo.id)}`;
  const headers = { Authorization: `Bearer ${token}` };
  if (Platform.OS === 'web') {
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Não foi possível baixar o arquivo.');
    baixarNoNavegador(await response.blob(), anexo.nome);
    return;
  }
  if (!(await Sharing.isAvailableAsync())) throw new Error('O compartilhamento de arquivos não está disponível neste aparelho.');
  const nome = anexo.nome.replace(/[^\p{L}\p{N}._ -]/gu, '_').replace(/^\.+/, '_');
  const destino = `${FileSystem.cacheDirectory}anexo-${anexo.id}-${nome}`;
  try {
    const result = await FileSystem.downloadAsync(url, destino, { headers });
    if (result.status !== 200) throw new Error('Não foi possível baixar o arquivo.');
    await Sharing.shareAsync(result.uri, { dialogTitle: anexo.nome });
  } finally { await FileSystem.deleteAsync(destino, { idempotent: true }); }
}

export async function exportarCSV(transacoes) {
  const cell = (value) => {
    const text = String(value ?? '');
    // Prevent spreadsheet applications from interpreting user text as formulas.
    return `"${(/^[\s]*[=+@-]/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`;
  };
  const rows = [['Data', 'Descrição', 'Tipo', 'Categoria', 'Tipo de conta', 'Valor', 'Status', 'Observação'], ...transacoes.map((t) => [t.data, t.descricao, t.tipo, t.categoria, t.tipoConta, Number(t.valor).toFixed(2).replace('.', ','), t.status, t.observacao])];
  const csv = '\ufeff' + rows.map((row) => row.map(cell).join(';')).join('\r\n');
  const nome = 'nexus-transacoes.csv';
  if (Platform.OS === 'web') { baixarNoNavegador(new Blob([csv], { type: 'text/csv;charset=utf-8' }), nome); return; }
  if (!(await Sharing.isAvailableAsync())) throw new Error('O compartilhamento não está disponível neste aparelho.');
  const uri = FileSystem.cacheDirectory + nome;
  try {
    await FileSystem.writeAsStringAsync(uri, csv);
    await Sharing.shareAsync(uri, { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text', dialogTitle: 'Exportar transações' });
  } finally { await FileSystem.deleteAsync(uri, { idempotent: true }); }
}
