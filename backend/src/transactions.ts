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

export function parseMoney(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const clean = value.trim().replace(/\s/g, "").replace(/^R\$/, "");
  if (!clean) return Number.NaN;
  if (clean.includes(",")) {
    if (!/^(?:\d{1,3}(?:\.\d{3})*|\d+),\d{1,2}$/.test(clean)) return Number.NaN;
    return Number(clean.replace(/\./g, "").replace(",", "."));
  }
  return /^\d+(?:\.\d{1,2})?$/.test(clean) ? Number(clean) : Number.NaN;
}

export function validTransactionDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number(date.slice(0, 4)) < 1000) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export async function createTransaction(userId: number, body: Record<string, unknown>, file?: Express.Multer.File) {
  const typeName = body.tipo === "Receita" || body.tipo === "Despesa" ? body.tipo : "";
  const description = typeof body.descricao === "string" ? body.descricao.trim() : "";
  const categoryName = typeof body.categoria === "string" ? body.categoria.trim() : "";
  const categoryId = body.categoriaId === undefined ? null : positiveId(body.categoriaId);
  const accountTypeId = body.tipoContaId === undefined ? null : positiveId(body.tipoContaId);
  const value = parseMoney(body.valor);
  const date = normalizeDate(body.data);
  const notes = typeof body.observacao === "string" ? body.observacao.trim() : null;
  if (!typeName) throw new ApiError(400, "Tipo de transação inválido.");
  if (description.length < 2 || description.length > 255) throw new ApiError(400, "A descrição deve ter entre 2 e 255 caracteres.");
  if ((body.categoriaId !== undefined && !categoryId) || (!categoryId && (categoryName.length < 2 || categoryName.length > 100))) throw new ApiError(400, "Selecione uma categoria válida.");
  if (body.tipoContaId !== undefined && !accountTypeId) throw new ApiError(400, "Selecione um tipo de conta válido.");
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
    const [[status]] = await connection.query<RowDataPacket[]>("SELECT id_status_transacao AS id FROM status_transacao WHERE nome = ? LIMIT 1", [body.status === "Pendente" ? "Pendente" : "Confirmada"]);
    if (!type || !status) throw new ApiError(409, "Dados iniciais do banco não foram encontrados.");

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
      `INSERT INTO transacoes (id_usuario, id_conta, id_categoria, id_tipo_transacao, id_status_transacao, descricao, valor, data_transacao, observacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, account.id, category.id, type.id, status.id, description, value, date, notes],
    );
    if (body.recorrente === true || body.recorrente === "true") {
      await connection.execute("INSERT INTO recorrencias (id_usuario, id_transacao_origem, frequencia, data_inicio) VALUES (?, ?, 'mensal', ?)", [userId, result.insertId, date]);
    }
    let attachmentId: number | undefined;
    if (file) {
      storedFile = await storeAttachment(file);
      const [attachment] = await connection.execute<ResultSetHeader>("INSERT INTO anexos_transacao (id_transacao, nome_arquivo, caminho_arquivo, tipo_arquivo, tamanho_arquivo) VALUES (?, ?, ?, ?, ?)", [result.insertId, attachmentName(file.originalname), storedFile, file.mimetype.slice(0, 100), file.size]);
      attachmentId = attachment.insertId;
    }
    const [[notificationType]] = await connection.query<RowDataPacket[]>("SELECT id_tipo_notificacao AS id FROM tipos_notificacao WHERE nome = 'Financeira' LIMIT 1");
    const [[preferences]] = await connection.query<RowDataPacket[]>("SELECT notificacoes_ativas FROM configuracoes WHERE id_usuario = ?", [userId]);
    if (notificationType && (!preferences || preferences.notificacoes_ativas)) await connection.execute("INSERT INTO notificacoes (id_usuario, id_tipo_notificacao, titulo, descricao) VALUES (?, ?, ?, ?)", [userId, notificationType.id, `${typeName} adicionada`, `${description} no valor de R$ ${value.toFixed(2)}`]);
    await connection.commit();
    return { mensagem: `${typeName} salva com sucesso.`, id: result.insertId, anexoId: attachmentId };
  } catch (error) {
    try { await connection.rollback(); } finally { if (storedFile) await removeAttachment(storedFile); }
    throw error;
  } finally {
    connection.release();
  }
}
