import { Router } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import path from "node:path";
import { AuthenticatedRequest } from "../auth";
import { database } from "../database";
import { ApiError } from "../errors";
import { positiveId } from "../transactions";
import { uploadDirectory } from "../uploads";

export const financeOptionsRoutes = Router();

financeOptionsRoutes.get("/financeiro/opcoes", async (req: AuthenticatedRequest, res, next) => {
  try {
    const tipo = req.query.tipo;
    if (tipo !== "Receita" && tipo !== "Despesa") throw new ApiError(400, "Tipo de transação inválido.");
    const [categories] = await database.query<RowDataPacket[]>(
      `SELECT c.id_categoria AS id, c.nome, c.padrao FROM categorias c
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = c.id_tipo_transacao
       WHERE tt.nome = ? AND c.ativa = TRUE AND (c.id_usuario IS NULL OR c.id_usuario = ?)
       ORDER BY c.padrao DESC, c.nome, c.id_categoria`, [tipo, req.userId],
    );
    const [accountTypes] = await database.query<RowDataPacket[]>("SELECT id_tipo_conta AS id, nome FROM tipos_conta ORDER BY id_tipo_conta");
    res.json({ categorias: categories.map((row) => ({ id: String(row.id), nome: row.nome, padrao: Boolean(row.padrao) })), tiposConta: accountTypes.map((row) => ({ id: String(row.id), nome: row.nome })) });
  } catch (error) { next(error); }
});

financeOptionsRoutes.post("/financeiro/categorias", async (req: AuthenticatedRequest, res, next) => {
  try {
    const nome = typeof req.body.nome === "string" ? req.body.nome.trim().replace(/\s+/g, " ") : "";
    const tipo = req.body.tipo;
    if (nome.length < 2 || nome.length > 100) throw new ApiError(400, "O nome da categoria deve ter entre 2 e 100 caracteres.");
    if (tipo !== "Receita" && tipo !== "Despesa") throw new ApiError(400, "Tipo de transação inválido.");
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      const [[user]] = await connection.query<RowDataPacket[]>("SELECT id_usuario FROM usuarios WHERE id_usuario = ? FOR UPDATE", [req.userId]);
      if (!user) throw new ApiError(401, "Usuário não encontrado.");
      const [[type]] = await connection.query<RowDataPacket[]>("SELECT id_tipo_transacao AS id FROM tipos_transacao WHERE nome = ?", [tipo]);
      if (!type) throw new ApiError(409, "Tipo de transação não configurado no banco.");
      const [[existing]] = await connection.query<RowDataPacket[]>("SELECT id_categoria AS id, nome, padrao FROM categorias WHERE id_tipo_transacao = ? AND nome = ? AND ativa = TRUE AND (id_usuario IS NULL OR id_usuario = ?) ORDER BY padrao DESC LIMIT 1", [type.id, nome, req.userId]);
      if (existing) {
        await connection.commit();
        res.json({ categoria: { id: String(existing.id), nome: existing.nome, padrao: Boolean(existing.padrao) } });
        return;
      }
      const [result] = await connection.execute<ResultSetHeader>("INSERT INTO categorias (id_usuario, id_tipo_transacao, nome) VALUES (?, ?, ?)", [req.userId, type.id, nome]);
      await connection.commit();
      res.status(201).json({ categoria: { id: String(result.insertId), nome, padrao: false } });
    } catch (error) { await connection.rollback(); throw error; }
    finally { connection.release(); }
  } catch (error) { next(error); }
});

financeOptionsRoutes.get("/financeiro/anexos/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = positiveId(req.params.id);
    if (!id) throw new ApiError(400, "Anexo inválido.");
    const [[attachment]] = await database.query<RowDataPacket[]>(
      `SELECT a.nome_arquivo, a.caminho_arquivo FROM anexos_transacao a
       INNER JOIN transacoes t ON t.id_transacao = a.id_transacao WHERE a.id_anexo = ? AND t.id_usuario = ?`, [id, req.userId],
    );
    if (!attachment || !/^[0-9a-f-]{36}$/i.test(attachment.caminho_arquivo)) throw new ApiError(404, "Anexo não encontrado.");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    res.download(path.join(uploadDirectory, attachment.caminho_arquivo), attachment.nome_arquivo, { headers: { "Content-Type": "application/octet-stream" } }, (error) => {
      if (error && !res.headersSent) next(new ApiError(404, "Arquivo não encontrado."));
    });
  } catch (error) { next(error); }
});
