import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { bancoDados } from "../bancoDados/bancoDados";
import { ErroApi } from "../middlewares/erros";
import { normalizarData } from "../utilitarios/validacoes";
import { nomeAnexo, removerAnexo, armazenarAnexo } from "./anexos";
export function identificadorPositivo(valor: unknown): number | null {
  if (typeof valor !== 'string' && typeof valor !== 'number' || !/^\d+$/.test(String(valor))) return null;
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
export function converterValorMonetario(valor: unknown): number {
  if (typeof valor === 'number') {
    if (!Number.isFinite(valor) || valor < 0 || valor > 9999999999.99) return Number.NaN;
    // Rejeita casas decimais extras tanto no JSON quanto nos formulários.
    const escalado = valor * 100;
    return Math.abs(escalado - Math.round(escalado)) <= Number.EPSILON * Math.max(1, Math.abs(escalado)) * 2 ? Math.round(escalado) / 100 : Number.NaN;
  }
  if (typeof valor !== 'string') return Number.NaN;
  const limpo = valor.trim().replace(/\s/g, '').replace(/^R\$/, '');
  if (!limpo) return Number.NaN;
  if (limpo.includes(',')) {
    if (!/^(?:\d{1,3}(?:\.\d{3})*|\d+),\d{1,2}$/.test(limpo)) return Number.NaN;
    return Number(limpo.replace(/\./g, '').replace(',', '.'));
  }
  if (/^\d{1,3}(?:\.\d{3})+$/.test(limpo)) {
    return Number(limpo.replace(/\./g, ''));
  }
  return /^\d+(?:\.\d{1,2})?$/.test(limpo) ? Number(limpo) : Number.NaN;
}
export function dataTransacaoValida(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || Number(data.slice(0, 4)) < 1000) return false;
  const convertido = new Date(`${data}T00:00:00Z`);
  return !Number.isNaN(convertido.getTime()) && convertido.toISOString().slice(0, 10) === data;
}
export async function confirmarTransacao(idUsuario: number, idTransacao: unknown) {
  const id = identificadorPositivo(idTransacao);
  if (!id) throw new ErroApi(400, 'Transação inválida.');
  const conexao = await bancoDados.getConnection();
  try {
    await conexao.beginTransaction();
    const [[transacao]] = await conexao.query<RowDataPacket[]>(`SELECT st.nome AS status, t.data_transacao > CURDATE() AS futura
       FROM transacoes t JOIN status_transacao st USING (id_status_transacao)
       WHERE t.id_transacao = ? AND t.id_usuario = ? FOR UPDATE`, [id, idUsuario]);
    if (!transacao) throw new ErroApi(404, 'Transação não encontrada.');
    if (transacao.status === 'Cancelada') throw new ErroApi(409, 'Uma transação cancelada não pode ser confirmada.');
    if (transacao.futura) throw new ErroApi(409, 'Aguarde a data do lançamento para confirmar esta transação.');
    if (transacao.status === 'Pendente') {
      await conexao.execute(`UPDATE transacoes SET id_status_transacao =
        (SELECT id_status_transacao FROM status_transacao WHERE nome = 'Confirmada')
        WHERE id_transacao = ? AND id_usuario = ?`, [id, idUsuario]);
    }
    await conexao.commit();
  } catch (falha) {
    await conexao.rollback();
    throw falha;
  } finally {
    conexao.release();
  }
}
export async function criarTransacao(idUsuario: number, corpo: Record<string, unknown>, arquivo?: Express.Multer.File) {
  const nomeTipo = corpo.tipo === 'Receita' || corpo.tipo === 'Despesa' ? corpo.tipo : '';
  const descricao = typeof corpo.descricao === 'string' ? corpo.descricao.trim() : '';
  const nomeCategoria = typeof corpo.categoria === 'string' ? corpo.categoria.trim() : '';
  const idCategoria = corpo.categoriaId === undefined ? null : identificadorPositivo(corpo.categoriaId);
  const idTipoConta = corpo.tipoContaId === undefined ? null : identificadorPositivo(corpo.tipoContaId);
  const metaId = corpo.metaId === undefined || corpo.metaId === null || corpo.metaId === '' ? null : identificadorPositivo(corpo.metaId);
  const valor = converterValorMonetario(corpo.valor);
  const data = normalizarData(corpo.data);
  const observacoes = typeof corpo.observacao === 'string' ? corpo.observacao.trim() : null;
  if (!nomeTipo) throw new ErroApi(400, 'Tipo de transação inválido.');
  if (descricao.length < 2 || descricao.length > 255) throw new ErroApi(400, 'A descrição deve ter entre 2 e 255 caracteres.');
  if (corpo.categoriaId !== undefined && !idCategoria || !idCategoria && (nomeCategoria.length < 2 || nomeCategoria.length > 100)) throw new ErroApi(400, 'Selecione uma categoria válida.');
  if (corpo.tipoContaId !== undefined && !idTipoConta) throw new ErroApi(400, 'Selecione um tipo de conta válido.');
  if (corpo.metaId !== undefined && corpo.metaId !== null && corpo.metaId !== '' && !metaId) throw new ErroApi(400, 'Selecione uma meta válida.');
  if (metaId && nomeTipo !== 'Receita') throw new ErroApi(400, 'Somente receitas podem ser enviadas para uma meta.');
  if (!Number.isFinite(valor) || valor <= 0 || valor > 9999999999.99) throw new ErroApi(400, 'Informe um valor válido.');
  if (!dataTransacaoValida(data)) throw new ErroApi(400, 'Informe uma data válida.');
  if (observacoes && observacoes.length > 5000) throw new ErroApi(400, 'A observação deve ter até 5000 caracteres.');
  if (arquivo && !arquivo.size) throw new ErroApi(400, 'O arquivo está vazio.');
  if (corpo.status !== undefined && corpo.status !== 'Pendente' && corpo.status !== 'Confirmada') throw new ErroApi(400, 'Status inválido.');
  if (metaId && corpo.status === 'Pendente') throw new ErroApi(400, 'Somente receitas confirmadas podem ser enviadas para uma meta.');
  const conexao = await bancoDados.getConnection();
  let arquivoArmazenado: string | undefined;
  try {
    await conexao.beginTransaction();
    if (metaId) {
      const [[relogio]] = await conexao.query<RowDataPacket[]>("SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS hoje");
      if (data > relogio.hoje) throw new ErroApi(400, 'Receitas futuras não podem ser enviadas para uma meta.');
    }
    // Evita a criação simultânea de contas e categorias para o mesmo usuário.
    const [[usuario]] = await conexao.query<RowDataPacket[]>('SELECT id_usuario FROM usuarios WHERE id_usuario = ? FOR UPDATE', [idUsuario]);
    if (!usuario) throw new ErroApi(401, 'Usuário não encontrado.');
    const [[tipo]] = await conexao.query<RowDataPacket[]>('SELECT id_tipo_transacao AS id FROM tipos_transacao WHERE nome = ? LIMIT 1', [nomeTipo]);
    const [[status]] = await conexao.query<RowDataPacket[]>('SELECT id_status_transacao AS id FROM status_transacao WHERE nome = ? LIMIT 1', [corpo.status === 'Pendente' ? 'Pendente' : 'Confirmada']);
    if (!tipo || !status) throw new ErroApi(409, 'Dados iniciais do banco não foram encontrados.');
    let meta: RowDataPacket | undefined;
    if (metaId) {
      [[meta]] = await conexao.query<RowDataPacket[]>(`SELECT id_meta AS id, nome, valor_objetivo AS objetivo
         FROM metas
         WHERE id_meta = ? AND id_usuario = ? AND status = 'em_andamento'
         FOR UPDATE`, [metaId, idUsuario]);
      if (!meta) throw new ErroApi(400, 'A meta selecionada não está disponível.');
    }
    let [[categoria]] = idCategoria ? await conexao.query<RowDataPacket[]>('SELECT id_categoria AS id FROM categorias WHERE id_categoria = ? AND id_tipo_transacao = ? AND ativa = TRUE AND (id_usuario IS NULL OR id_usuario = ?)', [idCategoria, tipo.id, idUsuario]) : await conexao.query<RowDataPacket[]>('SELECT id_categoria AS id FROM categorias WHERE nome = ? AND id_tipo_transacao = ? AND ativa = TRUE AND (id_usuario IS NULL OR id_usuario = ?) ORDER BY padrao DESC LIMIT 1', [nomeCategoria, tipo.id, idUsuario]);
    if (!categoria && idCategoria) throw new ErroApi(400, 'Categoria indisponível para esta transação.');
    if (!categoria) {
      const [criado] = await conexao.execute<ResultSetHeader>('INSERT INTO categorias (id_usuario, id_tipo_transacao, nome) VALUES (?, ?, ?)', [idUsuario, tipo.id, nomeCategoria]);
      categoria = {
        id: criado.insertId
      } as RowDataPacket;
    }
    const [[tipoConta]] = idTipoConta ? await conexao.query<RowDataPacket[]>('SELECT id_tipo_conta AS id, nome FROM tipos_conta WHERE id_tipo_conta = ?', [idTipoConta]) : await conexao.query<RowDataPacket[]>('SELECT id_tipo_conta AS id, nome FROM tipos_conta ORDER BY id_tipo_conta LIMIT 1');
    if (!tipoConta) throw new ErroApi(400, 'Tipo de conta indisponível.');
    let [[conta]] = await conexao.query<RowDataPacket[]>(`SELECT id_conta AS id FROM contas WHERE id_usuario = ? AND ativa = TRUE ${idTipoConta ? 'AND id_tipo_conta = ?' : ''} ORDER BY id_conta LIMIT 1`, idTipoConta ? [idUsuario, idTipoConta] : [idUsuario]);
    if (!conta) {
      const [criado] = await conexao.execute<ResultSetHeader>('INSERT INTO contas (id_usuario, id_tipo_conta, nome) VALUES (?, ?, ?)', [idUsuario, tipoConta.id, idTipoConta ? tipoConta.nome : 'Conta principal']);
      conta = {
        id: criado.insertId
      } as RowDataPacket;
    }
    const [resultado] = await conexao.execute<ResultSetHeader>(`INSERT INTO transacoes (id_usuario, id_conta, id_categoria, id_tipo_transacao, id_status_transacao, descricao, valor, data_transacao, observacao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [idUsuario, conta.id, categoria.id, tipo.id, status.id, descricao, valor, data, observacoes]);
    if (metaId && meta) {
      await conexao.execute(`INSERT INTO movimentacoes_metas (id_meta, id_transacao, tipo, valor, data_movimentacao, descricao)
         VALUES (?, ?, 'deposito', ?, ?, ?)`, [metaId, resultado.insertId, valor, data, descricao]);
      const [[totalMeta]] = await conexao.query<RowDataPacket[]>(`SELECT COALESCE(SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END), 0) AS atual
         FROM movimentacoes_metas
         WHERE id_meta = ?`, [metaId]);
      if (Number(totalMeta?.atual || 0) >= Number(meta.objetivo)) {
        await conexao.execute("UPDATE metas SET status = 'concluida' WHERE id_meta = ? AND id_usuario = ?", [metaId, idUsuario]);
      }
    }
    if (corpo.recorrente === true || corpo.recorrente === 'true') {
      await conexao.execute("INSERT INTO recorrencias (id_usuario, id_transacao_origem, frequencia, data_inicio) VALUES (?, ?, 'mensal', ?)", [idUsuario, resultado.insertId, data]);
    }
    let idAnexo: number | undefined;
    if (arquivo) {
      arquivoArmazenado = await armazenarAnexo(arquivo);
      const [anexo] = await conexao.execute<ResultSetHeader>('INSERT INTO anexos_transacao (id_transacao, nome_arquivo, caminho_arquivo, tipo_arquivo, tamanho_arquivo) VALUES (?, ?, ?, ?, ?)', [resultado.insertId, nomeAnexo(arquivo.originalname), arquivoArmazenado, arquivo.mimetype.slice(0, 100), arquivo.size]);
      idAnexo = anexo.insertId;
    }
    const [[tipoNotificacao]] = await conexao.query<RowDataPacket[]>("SELECT id_tipo_notificacao AS id FROM tipos_notificacao WHERE nome = 'Financeira' LIMIT 1");
    const [[preferencias]] = await conexao.query<RowDataPacket[]>('SELECT notificacoes_ativas FROM configuracoes WHERE id_usuario = ?', [idUsuario]);
    if (tipoNotificacao && (!preferencias || preferencias.notificacoes_ativas)) {
      await conexao.execute('INSERT INTO notificacoes (id_usuario, id_tipo_notificacao, titulo, descricao) VALUES (?, ?, ?, ?)', [idUsuario, tipoNotificacao.id, `${nomeTipo} adicionada`, `${descricao} no valor de R$ ${valor.toFixed(2)}`]);
    }
    await conexao.commit();
    return {
      mensagem: metaId ? `${nomeTipo} salva e adicionada à meta com sucesso.` : `${nomeTipo} salva com sucesso.`,
      id: resultado.insertId,
      anexoId: idAnexo
    };
  } catch (falha) {
    try {
      await conexao.rollback();
    } finally {
      if (arquivoArmazenado) await removerAnexo(arquivoArmazenado);
    }
    throw falha;
  } finally {
    conexao.release();
  }
}
