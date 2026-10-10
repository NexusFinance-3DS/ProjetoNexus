import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { formatarReais } from './financeiro';
export async function exportarRelatorio(periodo, totais, historico) {
  const escaparHtml = valor => String(valor).replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere]);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório Nexus Finance</title><style>@page{margin:24mm}body{font-family:Arial,sans-serif;color:#20202a;padding:24px}h1{color:#5145ff}table{border-collapse:collapse;width:100%;margin-top:24px}td,th{padding:10px;text-align:left;border-bottom:1px solid #ddd}thead{display:table-header-group}tr{break-inside:avoid}</style></head><body><h1>Nexus Finance</h1><h2>Relatório financeiro</h2><p>${escaparHtml(periodo)} · Gerado em ${new Date().toLocaleDateString('pt-BR')}</p><p>Receitas: <strong>${formatarReais(totais.totalReceitas)}</strong></p><p>Despesas: <strong>${formatarReais(totais.totalDespesas)}</strong></p><p>Resultado do período: <strong>${formatarReais(totais.saldo)}</strong></p><table><thead><tr><th>Mês</th><th>Receitas</th><th>Despesas</th><th>Resultado</th></tr></thead><tbody>${historico.map(h => `<tr><td>${escaparHtml(h.periodo)}</td><td>${formatarReais(h.receitas)}</td><td>${formatarReais(h.despesas)}</td><td>${formatarReais(h.saldo)}</td></tr>`).join('')}</tbody></table></body></html>`;
  if (Platform.OS === 'web') {
    const previsualizacao = window.open('', '_blank');
    if (!previsualizacao) throw new Error('Permita a abertura da janela do relatório para salvar como PDF.');
    previsualizacao.opener = null;
    previsualizacao.document.write(html);
    previsualizacao.document.close();
    previsualizacao.focus();
    previsualizacao.print();
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    await Print.printAsync({
      html
    });
    return;
  }
  const {
    uri
  } = await Print.printToFileAsync({
    html
  });
  try {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: 'Exportar relatório'
    });
  } finally {
    await FileSystem.deleteAsync(uri, {
      idempotent: true
    });
  }
}

function escaparHtml(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[caractere]);
}

export async function exportarDashboard(tipo, dados) {
  const atual = dados.atual || {};
  const previsao = dados.previsao || {};
  const historico = dados.historico || [];
  const categorias = dados.categorias || [];
  const moeda = valor => formatarReais(valor);
  const tabela = (cabecalhos, linhas) => '<table><thead><tr>' +
    cabecalhos.map(item => '<th>' + escaparHtml(item) + '</th>').join('') +
    '</tr></thead><tbody>' + linhas.map(linha => '<tr>' +
      linha.map(item => '<td>' + escaparHtml(item) + '</td>').join('') +
      '</tr>').join('') + '</tbody></table>';
  const blocos = [];
  if (tipo === 'completo' || tipo === 'indicadores') {
    blocos.push('<h2>Indicadores do mês</h2>' + tabela(
      ['Indicador', 'Valor'],
      [
        ['Receitas realizadas', moeda(atual.totalReceitas)],
        ['Despesas realizadas', moeda(atual.totalDespesas)],
        ['Resultado do mês', moeda(atual.saldo)],
        ['Saldo previsto no fim do mês', moeda(dados.saldoPrevisto)],
        ['Receitas previstas', moeda(previsao.totalReceitas)],
        ['Despesas previstas', moeda(previsao.totalDespesas)],
        ['Resultado previsto', moeda(previsao.saldo)],
        ['Taxa de economia', Number(atual.totalReceitas) > 0 ? ((Number(atual.saldo) / Number(atual.totalReceitas)) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : 'Sem receitas'],
        ['Variação das despesas vs. mesmo período do mês anterior', dados.variacaoDespesas?.percentual == null ? 'Sem comparação' : Number(dados.variacaoDespesas.percentual).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%']
      ]
    ));
  }
  if (tipo === 'completo' || tipo === 'evolucao' || tipo === 'comparativo') {
    blocos.push('<h2>' + (tipo === 'comparativo' ? 'Receitas e despesas' : 'Evolução mensal') + '</h2>' + tabela(
      ['Mês', 'Receitas', 'Despesas', 'Resultado'],
      historico.map(item => [item.periodo, moeda(item.receitas), moeda(item.despesas), moeda(item.saldo)])
    ));
  }
  if (tipo === 'resultados') {
    blocos.push('<h2>Evolução dos resultados</h2>' + tabela(
      ['Mês', 'Resultado'],
      historico.map(item => [item.periodo, moeda(item.saldo)])
    ));
  }
  if (tipo === 'completo' || tipo === 'categorias') {
    blocos.push('<h2>Despesas por categoria</h2>' + tabela(
      ['Categoria', 'Valor'],
      categorias.map(item => [item.nome, moeda(item.valor)])
    ));
  }
  if ((tipo === 'completo' || tipo === 'meta') && dados.meta && Number(dados.meta.objetivo) > 0) {
    const progresso = Number(dados.meta.atual) / Number(dados.meta.objetivo) * 100;
    blocos.push('<h2>Progresso da meta</h2>' + tabela(
      ['Meta', 'Acumulado', 'Objetivo', 'Progresso'],
      [[dados.meta.nome || 'Meta em andamento', moeda(dados.meta.atual), moeda(dados.meta.objetivo), progresso.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%']]
    ));
  }
  const nomes = { completo: 'Dashboard financeiro completo', indicadores: 'Projeção do mês', comparativo: 'Receitas e despesas', resultados: 'Evolução dos resultados', categorias: 'Gastos por categoria', evolucao: 'Evolução mensal', meta: 'Progresso da meta' };
  const titulo = nomes[tipo] || 'Dashboard financeiro';
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>' +
    escaparHtml(titulo) +
    '</title><style>@page{margin:22mm}body{font-family:Arial,sans-serif;color:#20202a;padding:20px}h1{color:#5145ff;font-size:25px}h2{margin-top:28px;color:#343044;font-size:17px}p{color:#5d5b68}table{border-collapse:collapse;width:100%;margin-top:12px}td,th{padding:10px;text-align:left;border-bottom:1px solid #e5e3ed}th{background:#f4f2ff;color:#5145ff}tr{break-inside:avoid}</style></head><body><h1>Nexus Finance</h1><p>' +
    escaparHtml(titulo) + ' · Gerado em ' + new Date().toLocaleDateString('pt-BR') +
    '</p>' + blocos.join('') + '</body></html>';

  if (Platform.OS === 'web') {
    const previsualizacao = window.open('', '_blank');
    if (!previsualizacao) throw new Error('Permita a abertura da janela do relatório para salvar como PDF.');
    previsualizacao.opener = null;
    previsualizacao.document.write(html);
    previsualizacao.document.close();
    previsualizacao.focus();
    previsualizacao.print();
    return;
  }
  if (!(await Sharing.isAvailableAsync())) {
    await Print.printAsync({ html });
    return;
  }
  const { uri } = await Print.printToFileAsync({ html });
  try {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: 'Compartilhar ' + titulo
    });
  } finally {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}



