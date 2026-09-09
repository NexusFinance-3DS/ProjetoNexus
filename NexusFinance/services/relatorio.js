import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { formatBRL } from './financeiro';

export async function exportarRelatorio(periodo, totais, historico) {
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório Nexus Finance</title><style>@page{margin:24mm}body{font-family:Arial,sans-serif;color:#20202a;padding:24px}h1{color:#5145ff}table{border-collapse:collapse;width:100%;margin-top:24px}td,th{padding:10px;text-align:left;border-bottom:1px solid #ddd}thead{display:table-header-group}tr{break-inside:avoid}</style></head><body><h1>Nexus Finance</h1><h2>Relatório financeiro</h2><p>${escape(periodo)} · Gerado em ${new Date().toLocaleDateString('pt-BR')}</p><p>Receitas: <strong>${formatBRL(totais.totalReceitas)}</strong></p><p>Despesas: <strong>${formatBRL(totais.totalDespesas)}</strong></p><p>Saldo: <strong>${formatBRL(totais.saldo)}</strong></p><table><thead><tr><th>Mês</th><th>Receitas</th><th>Despesas</th><th>Saldo</th></tr></thead><tbody>${historico.map((h) => `<tr><td>${escape(h.periodo)}</td><td>${formatBRL(h.receitas)}</td><td>${formatBRL(h.despesas)}</td><td>${formatBRL(h.saldo)}</td></tr>`).join('')}</tbody></table></body></html>`;
  if (Platform.OS === 'web') {
    const preview = window.open('', '_blank');
    if (!preview) throw new Error('Permita a abertura da janela do relatório para salvar como PDF.');
    preview.opener = null;
    preview.document.write(html);
    preview.document.close();
    preview.focus();
    preview.print();
    return;
  }
  if (!(await Sharing.isAvailableAsync())) { await Print.printAsync({ html }); return; }
  const { uri } = await Print.printToFileAsync({ html });
  try { await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Exportar relatório' }); }
  finally { await FileSystem.deleteAsync(uri, { idempotent: true }); }
}
