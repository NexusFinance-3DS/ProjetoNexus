import { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "./database";
import { ApiError } from "./errors";
import { normalizeDate } from "./validations";
import { attachmentName, removeAttachment, storeAttachment } from "./uploads";

export function positiveId(value: unknown): number | null {
  if ((typeof value !== "string" && typeof value !== "number") || !/^\d+$/.test(String(value))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function parseMoney(value: unknown): number {
  if (typeof value === "number") return roundMoney(value);
  if (typeof value !== "string") return Number.NaN;
  const clean = value.trim().replace(/\s/g, "").replace(/^R\$/, "");
  if (!clean) return Number.NaN;
  if (clean.includes(",")) {
    if (!/^(?:\d{1,3}(?:\.\d{3})*|\d+),\d{1,2}$/.test(clean)) return Number.NaN;
    return roundMoney(Number(clean.replace(/\./g, "").replace(",", ".")));
  }
  return /^\d+(?:\.\d{1,2})?$/.test(clean) ? roundMoney(Number(clean)) : Number.NaN;
}

export function validTransactionDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number(date.slice(0, 4)) < 1000) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function sqlDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || "").slice(0, 10);
}

function addMonthsClamped(date: string, months: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const targetIndex = month - 1 + months;
  const targetYear = year + Math.floor(targetIndex / 12);
  const targetMonth = ((targetIndex % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDay);
  return `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

export async function materializeMonthlyRecurrences(userId: number): Promise<number> {
  const [[clock]] = await database.query<RowDataPacket[]>(
    "SELECT DATE_FORMAT(LAST_DAY(DATE_ADD(CURDATE(), INTERVAL 1 MONTH)), '%Y-%m-%d') AS horizon",
  );
  const horizon = String(clock?.horizon || "");
  if (!validTransactionDate(horizon)) return 0;

  // Backfill the recurrence id for records created before this rule existed.
  await database.execute(
    `UPDATE transacoes t
     INNER JOIN recorrencias r ON r.id_transacao_origem = t.id_transacao
     SET t.id_recorrencia = r.id_recorrencia
     WHERE t.id_usuario = ? AND t.id_recorrencia IS NULL`,
    [userId],
  );

  const [[pendingStatus]] = await database.query<RowDataPacket[]>(
    "SELECT id_status_transacao AS id FROM status_transacao WHERE nome = 'Pendente' LIMIT 1",
  );
  if (!pendingStatus) return 0;

  const [recurrences] = await database.query<RowDataPacket[]>(
    `SELECT r.id_recorrencia AS recurrenceId, r.data_inicio, r.data_fim,
            t.id_conta, t.id_categoria, t.id_tipo_transacao, t.id_meta,
            t.descricao, t.valor, t.observacao
     FROM recorrencias r
     INNER JOIN transacoes t ON t.id_transacao = r.id_transacao_origem
     WHERE r.id_usuario = ? AND r.ativa = TRUE AND r.frequencia = 'mensal'
       AND r.data_inicio <= ?`,
    [userId, horizon],
  );

  let generated = 0;
  for (const recurrence of recurrences) {
    const start = sqlDate(recurrence.data_inicio);
    const end = recurrence.data_fim ? sqlDate(recurrence.data_fim) : null;
    if (!validTransactionDate(start)) continue;

    // A rolling horizon avoids filling the account with years of future entries.
    for (let offset = 1; offset <= 600; offset += 1) {
      const occurrence = addMonthsClamped(start, offset);
      if (occurrence > horizon || (end && occurrence > end)) break;

      const [created] = await database.execute<ResultSetHeader>(
        `INSERT IGNORE INTO transacoes
          (id_usuario, id_conta, id_categoria, id_tipo_transacao, id_status_transacao,
           id_recorrencia, id_meta, descricao, valor, data_transacao, observacao)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          recurrence.id_conta,
          recurrence.id_categoria,
          recurrence.id_tipo_transacao,
          pendingStatus.id,
          recurrence.recurrenceId,
          recurrence.id_meta || null,
          recurrence.descricao,
          roundMoney(Number(recurrence.valor)),
          occurrence,
          recurrence.observacao || null,
        ],
      );
      generated += created.affectedRows;
    }
  }

  return generated;
}

export async function createTransaction(userId: number, body: Record<string, unknown>, file?: Express.Multer.File) {
  const typeName = body.tipo === "Receita" || body.tipo === "Despesa" ? body.tipo : "";
  const description = typeof body.descricao === "string" ? body.descricao.trim() : "";
  const categoryName = typeof body.categoria === "string" ? body.categoria.trim() : "";
  const categoryId = body.categoriaId === undefined ? null : positiveId(body.categoriaId);
  const accountTypeId = body.tipoContaId === undefined ? null : positiveId(body.tipoContaId);
  const metaId = body.metaId === undefined || body.metaId === null || body.metaId === "" ? null : positiveId(body.metaId);
  const value = parseMoney(body.valor);
  const date = normalizeDate(body.data);
  const notes = typeof body.observacao === "string" ? body.observacao.trim() : null;
  const statusName = body.status === "Pendente" ? "Pendente" : "Confirmada";

  if (!typeName) throw new ApiError(400, "Tipo de transação inválido.");
  if (description.length < 2 || description.length > 255) throw new ApiError(400, "A descrição deve ter entre 2 e 255 caracteres.");
  if ((body.categoriaId !== undefined && !categoryId) || (!categoryId && (categoryName.length < 2 || categoryName.length > 100))) throw new ApiError(400, "Selecione uma categoria válida.");
  if (body.tipoContaId !== undefined && !accountTypeId) throw new ApiError(400, "Selecione um tipo de conta válido.");
  if (body.metaId !== undefined && body.metaId !== null && body.metaId !== "" && !metaId) throw new ApiError(400, "Selecione uma meta válida.");
  if (metaId && typeName !== "Receita") throw new ApiError(400, "Somente receitas podem ser enviadas para uma meta.");
  if (!Number.isFinite(value) || value <= 0 || value > 9999999999.99) throw new ApiError(400, "Informe um valor válido.");
  if (!validTransactionDate(date)) throw new ApiError(400, "Informe uma data válida.");
  if (notes && notes.length > 5000) throw new ApiError(400, "A observação deve ter até 5000 caracteres.");
  if (file && !file.size) throw new ApiError(400, "O arquivo está vazio.");

  const connection = await database.getConnection();
  let storedFile: string | undefined;

  try {
    await connection.beginTransaction();

    // Serialize creation of accounts/categories for the same user.
    const [[user]] = await connection.query<RowDataPacket[]>("SELECT id_usuario FROM usuarios WHERE id_usuario = ? FOR UPDATE", [userId]);
    if (!user) throw new ApiError(401, "Usuário não encontrado.");

    const [[type]] = await connection.query<RowDataPacket[]>("SELECT id_tipo_transacao AS id FROM tipos_transacao WHERE nome = ? LIMIT 1", [typeName]);
    const [[status]] = await connection.query<RowDataPacket[]>("SELECT id_status_transacao AS id FROM status_transacao WHERE nome = ? LIMIT 1", [statusName]);
    if (!type || !status) throw new ApiError(409, "Dados iniciais do banco não foram encontrados.");

    let goal: RowDataPacket | undefined;
    if (metaId) {
      [[goal]] = await connection.query<RowDataPacket[]>(
        `SELECT id_meta AS id, nome, valor_objetivo AS objetivo
         FROM metas
         WHERE id_meta = ? AND id_usuario = ? AND status = 'em_andamento'
         FOR UPDATE`,
        [metaId, userId],
      );
      if (!goal) throw new ApiError(400, "A meta selecionada não está disponível.");
    }

    let [[category]] = categoryId
      ? await connection.query<RowDataPacket[]>("SELECT id_categoria AS id FROM categorias WHERE id_categoria = ? AND id_tipo_transacao = ? AND ativa = TRUE AND (id_usuario IS NULL OR id_usuario = ?)", [categoryId, type.id, userId])
      : await connection.query<RowDataPacket[]>("SELECT id_categoria AS id FROM categorias WHERE nome = ? AND id_tipo_transacao = ? AND ativa = TRUE AND (id_usuario IS NULL OR id_usuario = ?) ORDER BY padrao DESC LIMIT 1", [categoryName, type.id, userId]);

    if (!category && categoryId) throw new ApiError(400, "Categoria indisponível para esta transação.");
    if (!category) {
      const [created] = await connection.execute<ResultSetHeader>("INSERT INTO categorias (id_usuario, id_tipo_transacao, nome) VALUES (?, ?, ?)", [userId, type.id, categoryName]);
      category = { id: created.insertId } as RowDataPacket;
    }

    const [[accountType]] = accountTypeId
      ? await connection.query<RowDataPacket[]>("SELECT id_tipo_conta AS id, nome FROM tipos_conta WHERE id_tipo_conta = ?", [accountTypeId])
      : await connection.query<RowDataPacket[]>("SELECT id_tipo_conta AS id, nome FROM tipos_conta ORDER BY id_tipo_conta LIMIT 1");

    if (!accountType) throw new ApiError(400, "Tipo de conta indisponível.");

    let [[account]] = await connection.query<RowDataPacket[]>(
      `SELECT id_conta AS id FROM contas WHERE id_usuario = ? AND ativa = TRUE ${accountTypeId ? "AND id_tipo_conta = ?" : ""} ORDER BY id_conta LIMIT 1`,
      accountTypeId ? [userId, accountTypeId] : [userId],
    );

    if (!account) {
      const [created] = await connection.execute<ResultSetHeader>("INSERT INTO contas (id_usuario, id_tipo_conta, nome) VALUES (?, ?, ?)", [userId, accountType.id, accountTypeId ? accountType.nome : "Conta principal"]);
      account = { id: created.insertId } as RowDataPacket;
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO transacoes
        (id_usuario, id_conta, id_categoria, id_tipo_transacao, id_status_transacao, id_meta, descricao, valor, data_transacao, observacao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, account.id, category.id, type.id, status.id, metaId, description, value, date, notes],
    );

    if (metaId && goal && statusName === "Confirmada") {
      await connection.execute(
        `INSERT INTO movimentacoes_metas (id_meta, id_transacao, tipo, valor, data_movimentacao, descricao)
         VALUES (?, ?, 'deposito', ?, ?, ?)`,
        [metaId, result.insertId, value, date, `Receita: ${description}`],
      );

      const [[goalTotal]] = await connection.query<RowDataPacket[]>(
        `SELECT COALESCE(SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END), 0) AS atual
         FROM movimentacoes_metas
         WHERE id_meta = ?`,
        [metaId],
      );

      if (Number(goalTotal?.atual || 0) >= Number(goal.objetivo)) {
        await connection.execute("UPDATE metas SET status = 'concluida' WHERE id_meta = ? AND id_usuario = ?", [metaId, userId]);
      }
    }

    if (body.recorrente === true || body.recorrente === "true") {
      const [recurrence] = await connection.execute<ResultSetHeader>(
        "INSERT INTO recorrencias (id_usuario, id_transacao_origem, frequencia, data_inicio) VALUES (?, ?, 'mensal', ?)",
        [userId, result.insertId, date],
      );
      await connection.execute(
        "UPDATE transacoes SET id_recorrencia = ? WHERE id_transacao = ? AND id_usuario = ?",
        [recurrence.insertId, result.insertId, userId],
      );
    }

    let attachmentId: number | undefined;
    if (file) {
      storedFile = await storeAttachment(file);
      const [attachment] = await connection.execute<ResultSetHeader>(
        "INSERT INTO anexos_transacao (id_transacao, nome_arquivo, caminho_arquivo, tipo_arquivo, tamanho_arquivo) VALUES (?, ?, ?, ?, ?)",
        [result.insertId, attachmentName(file.originalname), storedFile, file.mimetype.slice(0, 100), file.size],
      );
      attachmentId = attachment.insertId;
    }

    const [[notificationType]] = await connection.query<RowDataPacket[]>("SELECT id_tipo_notificacao AS id FROM tipos_notificacao WHERE nome = 'Financeira' LIMIT 1");
    const [[preferences]] = await connection.query<RowDataPacket[]>("SELECT notificacoes_ativas FROM configuracoes WHERE id_usuario = ?", [userId]);

    if (notificationType && (!preferences || preferences.notificacoes_ativas)) {
      await connection.execute(
        "INSERT INTO notificacoes (id_usuario, id_tipo_notificacao, titulo, descricao) VALUES (?, ?, ?, ?)",
        [userId, notificationType.id, `${typeName} adicionada`, `${description} no valor de R$ ${value.toFixed(2)}`],
      );
    }

    await connection.commit();

    const message = metaId && statusName === "Pendente"
      ? `${typeName} salva como pendente. A meta será atualizada quando a receita for confirmada.`
      : metaId
        ? `${typeName} salva e adicionada à meta com sucesso.`
        : `${typeName} salva com sucesso.`;

    return {
      mensagem: message,
      id: result.insertId,
      anexoId: attachmentId,
    };
  } catch (error) {
    try {
      await connection.rollback();
    } finally {
      if (storedFile) await removeAttachment(storedFile);
    }
    throw error;
  } finally {
    connection.release();
  }
}