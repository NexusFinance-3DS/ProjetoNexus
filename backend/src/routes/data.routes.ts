import { Router } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { authenticate, AuthenticatedRequest } from "../auth";
import { database } from "../database";
import { isValidBirthDate, isValidEmail, normalizeDate, normalizeEmail } from "../validations";

interface DataRow extends RowDataPacket {
  [key: string]: unknown;
}

export const dataRoutes = Router();
dataRoutes.use(authenticate);

dataRoutes.get("/financeiro/resumo", async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId!;
    const [currentRows] = await database.query<DataRow[]>(
      `SELECT
        COALESCE(SUM(CASE WHEN tt.nome = 'Receita' THEN t.valor ELSE 0 END), 0) AS totalReceitas,
        COALESCE(SUM(CASE WHEN tt.nome = 'Despesa' THEN t.valor ELSE 0 END), 0) AS totalDespesas
       FROM transacoes t
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = t.id_tipo_transacao
       INNER JOIN status_transacao st ON st.id_status_transacao = t.id_status_transacao
       WHERE t.id_usuario = ? AND st.nome <> 'Cancelada'
       AND YEAR(t.data_transacao) = YEAR(CURDATE()) AND MONTH(t.data_transacao) = MONTH(CURDATE())`,
      [userId],
    );
    const [previousRows] = await database.query<DataRow[]>(
      `SELECT
        COALESCE(SUM(CASE WHEN tt.nome = 'Receita' THEN t.valor ELSE 0 END), 0) AS totalReceitas,
        COALESCE(SUM(CASE WHEN tt.nome = 'Despesa' THEN t.valor ELSE 0 END), 0) AS totalDespesas
       FROM transacoes t
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = t.id_tipo_transacao
       INNER JOIN status_transacao st ON st.id_status_transacao = t.id_status_transacao
       WHERE t.id_usuario = ? AND st.nome <> 'Cancelada'
       AND YEAR(t.data_transacao) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND MONTH(t.data_transacao) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`,
      [userId],
    );
    const [categories] = await database.query<DataRow[]>(
      `SELECT c.nome, COALESCE(SUM(t.valor), 0) AS valor
       FROM transacoes t
       INNER JOIN categorias c ON c.id_categoria = t.id_categoria
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = t.id_tipo_transacao
       INNER JOIN status_transacao st ON st.id_status_transacao = t.id_status_transacao
       WHERE t.id_usuario = ? AND tt.nome = 'Despesa' AND st.nome <> 'Cancelada'
       AND YEAR(t.data_transacao) = YEAR(CURDATE()) AND MONTH(t.data_transacao) = MONTH(CURDATE())
       GROUP BY c.id_categoria, c.nome ORDER BY valor DESC`,
      [userId],
    );
    const [history] = await database.query<DataRow[]>(
      `SELECT DATE_FORMAT(t.data_transacao, '%Y-%m') AS periodo,
        COALESCE(SUM(CASE WHEN tt.nome = 'Receita' THEN t.valor ELSE 0 END), 0) AS receitas,
        COALESCE(SUM(CASE WHEN tt.nome = 'Despesa' THEN t.valor ELSE 0 END), 0) AS despesas
       FROM transacoes t
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = t.id_tipo_transacao
       INNER JOIN status_transacao st ON st.id_status_transacao = t.id_status_transacao
       WHERE t.id_usuario = ? AND st.nome <> 'Cancelada'
       AND t.data_transacao >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 5 MONTH)
       GROUP BY DATE_FORMAT(t.data_transacao, '%Y-%m') ORDER BY periodo`,
      [userId],
    );
    const [goals] = await database.query<DataRow[]>(
      `SELECT m.id_meta AS id, m.nome, m.valor_objetivo AS objetivo,
        COALESCE(SUM(CASE WHEN mm.tipo = 'deposito' THEN mm.valor ELSE -mm.valor END), 0) AS atual
       FROM metas m LEFT JOIN movimentacoes_metas mm ON mm.id_meta = m.id_meta
       WHERE m.id_usuario = ? AND m.status = 'em_andamento'
       GROUP BY m.id_meta ORDER BY m.criada_em DESC LIMIT 1`,
      [userId],
    );

    const current = toTotals(currentRows[0]);
    const previous = toTotals(previousRows[0]);
    const currentEconomy = current.saldo;
    const previousEconomy = previous.saldo;
    const difference = currentEconomy - previousEconomy;
    const percent = previousEconomy === 0 ? 0 : (difference / Math.abs(previousEconomy)) * 100;

    res.json({
      atual: current,
      anterior: previous,
      economia: { diferenca: difference, percentual: percent },
      categorias: categories.map((row) => ({ nome: String(row.nome), valor: Number(row.valor) })),
      historico: history.map((row) => ({
        periodo: String(row.periodo),
        receitas: Number(row.receitas),
        despesas: Number(row.despesas),
        saldo: Number(row.receitas) - Number(row.despesas),
      })),
      meta: goals[0] ? {
        id: Number(goals[0].id),
        nome: String(goals[0].nome),
        objetivo: Number(goals[0].objetivo),
        atual: Number(goals[0].atual),
      } : null,
    });
  } catch (error) {
    next(error);
  }
});

dataRoutes.get("/financeiro/transacoes", async (req: AuthenticatedRequest, res, next) => {
  try {
    const [rows] = await database.query<DataRow[]>(
      `SELECT t.id_transacao AS id, t.descricao, t.valor,
        DATE_FORMAT(t.data_transacao, '%Y-%m-%d') AS data,
        c.nome AS categoria, tt.nome AS tipo, st.nome AS status, t.observacao
       FROM transacoes t
       INNER JOIN categorias c ON c.id_categoria = t.id_categoria
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = t.id_tipo_transacao
       INNER JOIN status_transacao st ON st.id_status_transacao = t.id_status_transacao
       WHERE t.id_usuario = ? ORDER BY t.data_transacao DESC, t.id_transacao DESC`,
      [req.userId],
    );
    res.json({
      transacoes: rows.map((row) => ({
        id: String(row.id),
        descricao: String(row.descricao),
        categoria: String(row.categoria),
        tipo: row.tipo === "Receita" ? "Receitas" : "Despesas",
        valor: Number(row.valor),
        data: String(row.data),
        status: String(row.status),
        observacao: row.observacao ? String(row.observacao) : "",
      })),
    });
  } catch (error) {
    next(error);
  }
});

dataRoutes.post("/financeiro/transacoes", async (req: AuthenticatedRequest, res, next) => {
  try {
    const typeName = req.body.tipo === "Receita" ? "Receita" : req.body.tipo === "Despesa" ? "Despesa" : "";
    const description = typeof req.body.descricao === "string" ? req.body.descricao.trim() : "";
    const categoryName = typeof req.body.categoria === "string" ? req.body.categoria.trim() : "";
    const value = parseMoney(req.body.valor);
    const date = normalizeDate(req.body.data);
    const statusName = req.body.status === "Pendente" ? "Pendente" : "Confirmada";
    const notes = typeof req.body.observacao === "string" ? req.body.observacao.trim() : null;

    if (!typeName) return res.status(400).json({ mensagem: "Tipo de transação inválido." });
    if (description.length < 2) return res.status(400).json({ mensagem: "Informe a descrição." });
    if (!categoryName) return res.status(400).json({ mensagem: "Informe a categoria." });
    if (!Number.isFinite(value) || value <= 0) return res.status(400).json({ mensagem: "Informe um valor válido." });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ mensagem: "Informe uma data válida." });

    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      const [[type]] = await connection.query<DataRow[]>("SELECT id_tipo_transacao AS id FROM tipos_transacao WHERE nome = ? LIMIT 1", [typeName]);
      const [[status]] = await connection.query<DataRow[]>("SELECT id_status_transacao AS id FROM status_transacao WHERE nome = ? LIMIT 1", [statusName]);
      if (!type || !status) throw new Error("Dados iniciais do banco não foram encontrados.");

      let [[account]] = await connection.query<DataRow[]>("SELECT id_conta AS id FROM contas WHERE id_usuario = ? AND ativa = TRUE LIMIT 1", [req.userId]);
      if (!account) {
        const [[accountType]] = await connection.query<DataRow[]>("SELECT id_tipo_conta AS id FROM tipos_conta ORDER BY id_tipo_conta LIMIT 1");
        const [accountResult] = await connection.execute<ResultSetHeader>(
          "INSERT INTO contas (id_usuario, id_tipo_conta, nome) VALUES (?, ?, 'Conta principal')",
          [req.userId!, Number(accountType.id)],
        );
        account = { id: accountResult.insertId } as DataRow;
      }

      let [[category]] = await connection.query<DataRow[]>(
        "SELECT id_categoria AS id FROM categorias WHERE nome = ? AND id_tipo_transacao = ? AND (id_usuario IS NULL OR id_usuario = ?) ORDER BY padrao DESC LIMIT 1",
        [categoryName, type.id, req.userId],
      );
      if (!category) {
        const [categoryResult] = await connection.execute<ResultSetHeader>(
          "INSERT INTO categorias (id_usuario, id_tipo_transacao, nome) VALUES (?, ?, ?)",
          [req.userId!, Number(type.id), categoryName],
        );
        category = { id: categoryResult.insertId } as DataRow;
      }

      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO transacoes
         (id_usuario, id_conta, id_categoria, id_tipo_transacao, id_status_transacao, descricao, valor, data_transacao, observacao)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.userId!, Number(account.id), Number(category.id), Number(type.id), Number(status.id), description, value, date, notes],
      );

      if (req.body.recorrente === true) {
        await connection.execute(
          "INSERT INTO recorrencias (id_usuario, id_transacao_origem, frequencia, data_inicio) VALUES (?, ?, 'mensal', ?)",
          [req.userId!, result.insertId, date],
        );
      }

      const [[notificationType]] = await connection.query<DataRow[]>("SELECT id_tipo_notificacao AS id FROM tipos_notificacao WHERE nome = 'Financeira' LIMIT 1");
      if (notificationType) {
        await connection.execute(
          "INSERT INTO notificacoes (id_usuario, id_tipo_notificacao, titulo, descricao) VALUES (?, ?, ?, ?)",
          [req.userId!, Number(notificationType.id), `${typeName} adicionada`, `${description} no valor de R$ ${value.toFixed(2)}`],
        );
      }

      await connection.commit();
      res.status(201).json({ mensagem: `${typeName} salva com sucesso.`, id: result.insertId });
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

dataRoutes.get("/metas", async (req: AuthenticatedRequest, res, next) => {
  try {
    const [rows] = await database.query<DataRow[]>(
      `SELECT m.id_meta AS id, m.nome, m.valor_objetivo AS objetivo, m.status,
        COALESCE(SUM(CASE WHEN mm.tipo = 'deposito' THEN mm.valor ELSE -mm.valor END), 0) AS atual
       FROM metas m LEFT JOIN movimentacoes_metas mm ON mm.id_meta = m.id_meta
       WHERE m.id_usuario = ? GROUP BY m.id_meta ORDER BY m.criada_em DESC`,
      [req.userId],
    );
    res.json({ metas: rows.map((row) => ({ id: String(row.id), nome: String(row.nome), objetivo: Number(row.objetivo), atual: Number(row.atual), status: String(row.status) })) });
  } catch (error) {
    next(error);
  }
});

dataRoutes.post("/metas", async (req: AuthenticatedRequest, res, next) => {
  try {
    const name = typeof req.body.nome === "string" ? req.body.nome.trim() : "";
    const target = parseMoney(req.body.objetivo);
    const current = parseMoney(req.body.atual || 0);
    if (name.length < 2) return res.status(400).json({ mensagem: "Informe o nome da meta." });
    if (!Number.isFinite(target) || target <= 0) return res.status(400).json({ mensagem: "Informe um objetivo válido." });
    if (!Number.isFinite(current) || current < 0) return res.status(400).json({ mensagem: "Informe um valor atual válido." });

    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO metas (id_usuario, nome, valor_objetivo, data_inicio) VALUES (?, ?, ?, CURDATE())",
        [req.userId!, name, target],
      );
      if (current > 0) {
        await connection.execute(
          "INSERT INTO movimentacoes_metas (id_meta, tipo, valor, data_movimentacao, descricao) VALUES (?, 'deposito', ?, CURDATE(), 'Valor inicial')",
          [result.insertId, current],
        );
      }
      await connection.commit();
      res.status(201).json({ mensagem: "Meta salva com sucesso.", id: result.insertId });
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

dataRoutes.get("/notificacoes", async (req: AuthenticatedRequest, res, next) => {
  try {
    const [rows] = await database.query<DataRow[]>(
      `SELECT n.id_notificacao AS id, n.titulo, n.descricao, n.lida, n.criado_em, tn.nome AS tipo
       FROM notificacoes n INNER JOIN tipos_notificacao tn ON tn.id_tipo_notificacao = n.id_tipo_notificacao
       WHERE n.id_usuario = ? ORDER BY n.criado_em DESC LIMIT 50`,
      [req.userId],
    );
    res.json({ notificacoes: rows.map((row) => ({ ...row, id: String(row.id), lida: Boolean(row.lida) })) });
  } catch (error) {
    next(error);
  }
});

dataRoutes.patch("/notificacoes/:id/lida", async (req: AuthenticatedRequest, res, next) => {
  try {
    await database.execute("UPDATE notificacoes SET lida = TRUE WHERE id_notificacao = ? AND id_usuario = ?", [String(req.params.id), req.userId!]);
    res.json({ mensagem: "Notificação marcada como lida." });
  } catch (error) {
    next(error);
  }
});

dataRoutes.get("/usuarios/me", async (req: AuthenticatedRequest, res, next) => {
  try {
    const [rows] = await database.query<DataRow[]>(
      `SELECT u.nome, u.email, u.cpf, u.telefone,
        DATE_FORMAT(u.data_nascimento, '%Y-%m-%d') AS dataNascimento,
        e.cep, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.estado
       FROM usuarios u LEFT JOIN enderecos e ON e.id_usuario = u.id_usuario
       WHERE u.id_usuario = ? LIMIT 1`,
      [req.userId],
    );
    if (!rows.length) return res.status(404).json({ mensagem: "Usuário não encontrado." });
    res.json({ usuario: rows[0] });
  } catch (error) {
    next(error);
  }
});

dataRoutes.put("/usuarios/me", async (req: AuthenticatedRequest, res, next) => {
  try {
    const name = typeof req.body.nome === "string" ? req.body.nome.trim() : "";
    const email = normalizeEmail(req.body.email);
    const birthDate = normalizeDate(req.body.dataNascimento);
    const phone = typeof req.body.telefone === "string" ? req.body.telefone.trim() : null;
    if (name.length < 3) return res.status(400).json({ mensagem: "Informe o nome completo." });
    if (!isValidEmail(email)) return res.status(400).json({ mensagem: "E-mail inválido." });
    if (!isValidBirthDate(birthDate)) return res.status(400).json({ mensagem: "Data de nascimento inválida." });

    await database.execute(
      "UPDATE usuarios SET nome = ?, email = ?, telefone = ?, data_nascimento = ? WHERE id_usuario = ?",
      [name, email, phone, birthDate, req.userId!],
    );
    res.json({ mensagem: "Cadastro atualizado com sucesso." });
  } catch (error) {
    next(error);
  }
});

function toTotals(row: DataRow | undefined) {
  const receitas = Number(row?.totalReceitas || 0);
  const despesas = Number(row?.totalDespesas || 0);
  return { totalReceitas: receitas, totalDespesas: despesas, saldo: receitas - despesas };
}

function parseMoney(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const clean = value.trim().replace(/\s/g, "").replace(/^R\$/, "");
  const normalized = clean.includes(",") ? clean.replace(/\./g, "").replace(",", ".") : clean;
  return Number(normalized);
}
