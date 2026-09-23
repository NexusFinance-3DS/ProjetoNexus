import { financialSummary } from '../finance';
import { generateRecurrences } from '../recurrences';
import { confirmTransaction, createTransaction, parseMoney } from '../transactions';
import { upload } from '../uploads';
import { financeOptionsRoutes } from './finance-options.routes';
import { Router } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { authenticate, AuthenticatedRequest } from '../auth';
import { database } from '../database';
import { isValidBirthDate, isValidEmail, normalizeDate, normalizeEmail } from '../validations';

interface DataRow extends RowDataPacket {
  [key: string]: unknown;
}

export const dataRoutes = Router();
dataRoutes.use(authenticate);
dataRoutes.use(financeOptionsRoutes);

dataRoutes.get('/configuracoes', async (req: AuthenticatedRequest, res, next) => {
  try {
    const [[row]] = await database.query<RowDataPacket[]>(
      'SELECT notificacoes_ativas, tema FROM configuracoes WHERE id_usuario = ?',
      [req.userId],
    );
    res.json({
      notificacoes: row ? Boolean(row.notificacoes_ativas) : true,
      tema: row?.tema === 'claro' ? 'claro' : 'escuro',
    });
  } catch (error) {
    next(error);
  }
});

dataRoutes.put('/configuracoes', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { notificacoes, tema } = req.body || {};
    if (notificacoes === undefined && tema === undefined)
      return res.status(400).json({ mensagem: 'Informe a preferência que deseja alterar.' });
    if (notificacoes !== undefined && typeof notificacoes !== 'boolean')
      return res.status(400).json({ mensagem: 'Preferência de notificações inválida.' });
    if (tema !== undefined && tema !== 'claro' && tema !== 'escuro')
      return res.status(400).json({ mensagem: 'Escolha tema claro ou escuro.' });
    // Update only supplied preferences so concurrent changes do not overwrite each other.
    const updates = [
      notificacoes !== undefined ? 'notificacoes_ativas = VALUES(notificacoes_ativas)' : '',
      tema !== undefined ? 'tema = VALUES(tema)' : '',
    ]
      .filter(Boolean)
      .join(', ');
    await database.execute(
      `INSERT INTO configuracoes (id_usuario, notificacoes_ativas, tema) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ${updates}`,
      [req.userId, notificacoes ?? true, tema ?? 'escuro'],
    );
    const [[row]] = await database.query<RowDataPacket[]>(
      'SELECT notificacoes_ativas, tema FROM configuracoes WHERE id_usuario = ?',
      [req.userId],
    );
    res.json({ notificacoes: Boolean(row.notificacoes_ativas), tema: row.tema });
  } catch (error) {
    next(error);
  }
});

dataRoutes.get('/financeiro/resumo', async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    await generateRecurrences(userId);
    const summary = await financialSummary(userId);
    const [goals] = await database.query<DataRow[]>(
      `SELECT m.id_meta AS id, m.nome, m.valor_objetivo AS objetivo,
        COALESCE(SUM(CASE WHEN mm.tipo = 'deposito' THEN mm.valor ELSE -mm.valor END), 0) AS atual
       FROM metas m LEFT JOIN movimentacoes_metas mm ON mm.id_meta = m.id_meta
       WHERE m.id_usuario = ? AND m.status = 'em_andamento'
       GROUP BY m.id_meta ORDER BY m.criada_em DESC LIMIT 1`,
      [userId],
    );

    res.json({
      ...summary,
      meta: goals[0]
        ? {
            id: Number(goals[0].id),
            nome: String(goals[0].nome),
            objetivo: Number(goals[0].objetivo),
            atual: Number(goals[0].atual),
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
});

dataRoutes.get('/financeiro/transacoes', async (req: AuthenticatedRequest, res, next) => {
  try {
    await generateRecurrences(req.userId!);
    const [rows] = await database.query<DataRow[]>(
      `SELECT t.id_transacao AS id, t.descricao, t.valor,
        DATE_FORMAT(t.data_transacao, '%Y-%m-%d') AS data,
        c.nome AS categoria, tt.nome AS tipo, st.nome AS status, t.observacao,
        co.nome AS conta, tc.nome AS tipoConta,
        t.data_transacao > CURDATE() AS futura
       FROM transacoes t
       INNER JOIN categorias c ON c.id_categoria = t.id_categoria
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = t.id_tipo_transacao
       INNER JOIN status_transacao st ON st.id_status_transacao = t.id_status_transacao
       INNER JOIN contas co ON co.id_conta = t.id_conta
       INNER JOIN tipos_conta tc ON tc.id_tipo_conta = co.id_tipo_conta
       WHERE t.id_usuario = ? ORDER BY t.data_transacao DESC, t.id_transacao DESC`,
      [req.userId],
    );
    const [attachments] = await database.query<DataRow[]>(
      `SELECT a.id_anexo AS id, a.id_transacao AS transacaoId, a.nome_arquivo AS nome, a.tamanho_arquivo AS tamanho
       FROM anexos_transacao a INNER JOIN transacoes t ON t.id_transacao = a.id_transacao
       WHERE t.id_usuario = ? ORDER BY a.id_anexo`,
      [req.userId],
    );
    res.json({
      transacoes: rows.map((row) => ({
        id: String(row.id),
        descricao: String(row.descricao),
        categoria: String(row.categoria),
        tipo: row.tipo === 'Receita' ? 'Receitas' : 'Despesas',
        valor: Number(row.valor),
        data: String(row.data),
        status: String(row.status),
        futura: Boolean(row.futura),
        podeConfirmar: row.status === 'Pendente' && !row.futura,
        observacao: row.observacao ? String(row.observacao) : '',
        conta: String(row.conta),
        tipoConta: String(row.tipoConta),
        anexos: attachments
          .filter((item) => String(item.transacaoId) === String(row.id))
          .map((item) => ({
            id: String(item.id),
            nome: String(item.nome),
            tamanho: Number(item.tamanho),
            url: `/financeiro/anexos/${item.id}`,
          })),
      })),
    });
  } catch (error) {
    next(error);
  }
});

dataRoutes.post(
  '/financeiro/transacoes',
  upload.single('arquivo'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const result = await createTransaction(req.userId!, req.body || {}, req.file);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

dataRoutes.patch(
  '/financeiro/transacoes/:id/confirmar',
  async (req: AuthenticatedRequest, res, next) => {
    try {
      await confirmTransaction(req.userId!, req.params.id);
      res.json({ mensagem: 'Transação confirmada com sucesso.' });
    } catch (error) {
      next(error);
    }
  },
);

dataRoutes.get('/metas', async (req: AuthenticatedRequest, res, next) => {
  try {
    const [rows] = await database.query<DataRow[]>(
      `SELECT m.id_meta AS id, m.nome, m.valor_objetivo AS objetivo, m.status,
        COALESCE(SUM(CASE WHEN mm.tipo = 'deposito' THEN mm.valor ELSE -mm.valor END), 0) AS atual
       FROM metas m LEFT JOIN movimentacoes_metas mm ON mm.id_meta = m.id_meta
       WHERE m.id_usuario = ? GROUP BY m.id_meta ORDER BY m.criada_em DESC`,
      [req.userId],
    );
    res.json({
      metas: rows.map((row) => ({
        id: String(row.id),
        nome: String(row.nome),
        objetivo: Number(row.objetivo),
        atual: Number(row.atual),
        status: String(row.status),
      })),
    });
  } catch (error) {
    next(error);
  }
});

dataRoutes.post('/metas', async (req: AuthenticatedRequest, res, next) => {
  try {
    const name = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
    const target = parseMoney(req.body.objetivo);
    const current = parseMoney(req.body.atual ?? 0);
    if (name.length < 2 || name.length > 150)
      return res
        .status(400)
        .json({ mensagem: 'O nome da meta deve ter entre 2 e 150 caracteres.' });
    if (!Number.isFinite(target) || target <= 0 || target > 9999999999.99)
      return res.status(400).json({ mensagem: 'Informe um objetivo válido.' });
    if (!Number.isFinite(current) || current < 0 || current > 9999999999.99)
      return res.status(400).json({ mensagem: 'Informe um valor atual válido.' });

    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO metas (id_usuario, nome, valor_objetivo, data_inicio, status) VALUES (?, ?, ?, CURDATE(), ?)',
        [req.userId!, name, target, current >= target ? 'concluida' : 'em_andamento'],
      );
      if (current > 0) {
        await connection.execute(
          "INSERT INTO movimentacoes_metas (id_meta, tipo, valor, data_movimentacao, descricao) VALUES (?, 'deposito', ?, CURDATE(), 'Valor inicial')",
          [result.insertId, current],
        );
      }
      await connection.commit();
      res.status(201).json({ mensagem: 'Meta salva com sucesso.', id: result.insertId });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    next(error);
  }
});

dataRoutes.get('/notificacoes', async (req: AuthenticatedRequest, res, next) => {
  try {
    const [rows] = await database.query<DataRow[]>(
      `SELECT n.id_notificacao AS id, n.titulo, n.descricao, n.lida, n.criado_em, tn.nome AS tipo
       FROM notificacoes n INNER JOIN tipos_notificacao tn ON tn.id_tipo_notificacao = n.id_tipo_notificacao
       WHERE n.id_usuario = ? ORDER BY n.criado_em DESC LIMIT 50`,
      [req.userId],
    );
    res.json({
      notificacoes: rows.map((row) => ({ ...row, id: String(row.id), lida: Boolean(row.lida) })),
    });
  } catch (error) {
    next(error);
  }
});

dataRoutes.patch('/notificacoes/:id/lida', async (req: AuthenticatedRequest, res, next) => {
  try {
    await database.execute(
      'UPDATE notificacoes SET lida = TRUE WHERE id_notificacao = ? AND id_usuario = ?',
      [String(req.params.id), req.userId!],
    );
    res.json({ mensagem: 'Notificação marcada como lida.' });
  } catch (error) {
    next(error);
  }
});

dataRoutes.get('/usuarios/me', async (req: AuthenticatedRequest, res, next) => {
  try {
    const [rows] = await database.query<DataRow[]>(
      `SELECT u.nome, u.email, u.telefone,
        DATE_FORMAT(u.data_nascimento, '%Y-%m-%d') AS dataNascimento,
        e.cep, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.estado
       FROM usuarios u LEFT JOIN enderecos e ON e.id_usuario = u.id_usuario
       WHERE u.id_usuario = ? LIMIT 1`,
      [req.userId],
    );
    if (!rows.length) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    res.json({ usuario: rows[0] });
  } catch (error) {
    next(error);
  }
});

dataRoutes.put('/usuarios/me', async (req: AuthenticatedRequest, res, next) => {
  try {
    const name = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
    const email = normalizeEmail(req.body.email);
    const birthDate = normalizeDate(req.body.dataNascimento);
    const phone = typeof req.body.telefone === 'string' ? req.body.telefone.trim() : null;
    if (name.length < 3) return res.status(400).json({ mensagem: 'Informe o nome completo.' });
    if (!isValidEmail(email)) return res.status(400).json({ mensagem: 'E-mail inválido.' });
    if (!isValidBirthDate(birthDate))
      return res.status(400).json({ mensagem: 'Data de nascimento inválida.' });

    await database.execute(
      'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, data_nascimento = ? WHERE id_usuario = ?',
      [name, email, phone, birthDate, req.userId!],
    );
    res.json({ mensagem: 'Cadastro atualizado com sucesso.' });
  } catch (error) {
    next(error);
  }
});
