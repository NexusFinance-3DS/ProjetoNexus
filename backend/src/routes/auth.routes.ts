import { randomInt } from "crypto";
import { Router } from "express";
import bcrypt from "bcryptjs";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { authenticate, AuthenticatedRequest, createToken } from "../auth";
import { database } from "../database";
import { sendRecoveryCode } from "../email";
import {
  isValidBirthDate,
  isValidCpf,
  isValidEmail,
  normalizeDate,
  normalizeEmail,
  onlyNumbers,
  passwordError,
} from "../validations";

interface UserRow extends RowDataPacket {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string | null;
  data_nascimento: string | null;
  senha_hash: string;
  ativo: number;
}

interface RecoveryRow extends RowDataPacket {
  id_recuperacao: number;
  id_usuario: number;
  token: string;
  expira_em: Date;
  utilizado: number;
}

export const authRoutes = Router();

authRoutes.post("/cadastro", async (req, res, next) => {
  try {
    const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : "";
    const email = normalizeEmail(req.body.email);
    const cpf = onlyNumbers(req.body.cpf);
    const dataNascimento = normalizeDate(req.body.dataNascimento);
    const senha = req.body.senha;
    const confirmarSenha = req.body.confirmarSenha;

    if (nome.length < 3) return res.status(400).json({ mensagem: "Informe o nome completo." });
    if (!isValidEmail(email)) return res.status(400).json({ mensagem: "E-mail inválido." });
    if (!isValidCpf(cpf)) return res.status(400).json({ mensagem: "CPF inválido." });
    if (!isValidBirthDate(dataNascimento)) return res.status(400).json({ mensagem: "Data de nascimento inválida." });
    const senhaErro = passwordError(senha);
    if (senhaErro) return res.status(400).json({ mensagem: senhaErro });
    if (senha !== confirmarSenha) return res.status(400).json({ mensagem: "As senhas não coincidem." });

    const [existing] = await database.query<UserRow[]>(
      "SELECT id_usuario FROM usuarios WHERE email = ? OR cpf = ? LIMIT 1",
      [email, cpf],
    );
    if (existing.length) return res.status(409).json({ mensagem: "E-mail ou CPF já cadastrado." });

    const senhaHash = await bcrypt.hash(senha, 10);
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO usuarios (nome, email, cpf, data_nascimento, senha_hash) VALUES (?, ?, ?, ?, ?)",
        [nome, email, cpf, dataNascimento, senhaHash],
      );
      await connection.execute(
        "INSERT INTO configuracoes (id_usuario) VALUES (?)",
        [result.insertId],
      );
      const [[accountType]] = await connection.query<RowDataPacket[]>(
        "SELECT id_tipo_conta FROM tipos_conta WHERE nome = 'Conta Corrente' LIMIT 1",
      );
      if (accountType) {
        await connection.execute(
          "INSERT INTO contas (id_usuario, id_tipo_conta, nome) VALUES (?, ?, 'Conta principal')",
          [result.insertId, accountType.id_tipo_conta],
        );
      }
      await connection.commit();
      res.status(201).json({
        mensagem: "Cadastro realizado com sucesso.",
        usuario: { id: result.insertId, nome, email },
      });
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

authRoutes.post("/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const senha = req.body.senha;
    if (!isValidEmail(email) || typeof senha !== "string" || !senha) {
      return res.status(400).json({ mensagem: "Informe e-mail e senha válidos." });
    }

    const [users] = await database.query<UserRow[]>(
      "SELECT id_usuario, nome, email, senha_hash, ativo FROM usuarios WHERE email = ? LIMIT 1",
      [email],
    );
    const user = users[0];
    if (!user || !user.ativo || !(await bcrypt.compare(senha, user.senha_hash))) {
      return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
    }

    res.json({
      mensagem: "Login realizado com sucesso.",
      token: createToken(user.id_usuario),
      usuario: { id: user.id_usuario, nome: user.nome, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

authRoutes.get("/sessao", authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const [users] = await database.query<UserRow[]>(
      "SELECT id_usuario, nome, email, cpf, data_nascimento FROM usuarios WHERE id_usuario = ? AND ativo = TRUE LIMIT 1",
      [req.userId],
    );
    if (!users.length) return res.status(404).json({ mensagem: "Usuário não encontrado." });
    const user = users[0];
    res.json({ usuario: { id: user.id_usuario, nome: user.nome, email: user.email, cpf: user.cpf, dataNascimento: user.data_nascimento } });
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/logout", authenticate, (_req, res) => {
  res.json({ mensagem: "Logout realizado. Remova o token salvo no aplicativo." });
});

authRoutes.post("/recuperar-senha", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) return res.status(400).json({ mensagem: "E-mail inválido." });

    const [users] = await database.query<UserRow[]>(
      "SELECT id_usuario, email FROM usuarios WHERE email = ? AND ativo = TRUE LIMIT 1",
      [email],
    );

    if (users.length) {
      const code = String(randomInt(100000, 1000000));
      const codeHash = await bcrypt.hash(code, 10);
      await database.execute(
        "UPDATE recuperacoes_senha SET utilizado = TRUE WHERE id_usuario = ? AND utilizado = FALSE",
        [users[0].id_usuario],
      );
      await database.execute(
        "INSERT INTO recuperacoes_senha (id_usuario, token, expira_em) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))",
        [users[0].id_usuario, codeHash],
      );
      await sendRecoveryCode(email, code);
    }

    res.json({ mensagem: "Se o e-mail estiver cadastrado, um código será enviado." });
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/validar-codigo", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const codigo = typeof req.body.codigo === "string" ? req.body.codigo.trim() : "";
    const recovery = await findValidRecovery(email, codigo);
    if (!recovery) return res.status(400).json({ mensagem: "Código inválido ou expirado." });
    res.json({ mensagem: "Código válido." });
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/nova-senha", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const codigo = typeof req.body.codigo === "string" ? req.body.codigo.trim() : "";
    const senha = req.body.senha;
    const confirmarSenha = req.body.confirmarSenha;
    const senhaErro = passwordError(senha);
    if (senhaErro) return res.status(400).json({ mensagem: senhaErro });
    if (senha !== confirmarSenha) return res.status(400).json({ mensagem: "As senhas não coincidem." });

    const recovery = await findValidRecovery(email, codigo);
    if (!recovery) return res.status(400).json({ mensagem: "Código inválido ou expirado." });

    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute("UPDATE usuarios SET senha_hash = ? WHERE id_usuario = ?", [await bcrypt.hash(senha, 10), recovery.id_usuario]);
      await connection.execute("UPDATE recuperacoes_senha SET utilizado = TRUE WHERE id_recuperacao = ?", [recovery.id_recuperacao]);
      await connection.commit();
      res.json({ mensagem: "Senha alterada com sucesso." });
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

async function findValidRecovery(email: string, code: string): Promise<RecoveryRow | null> {
  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) return null;
  const [rows] = await database.query<RecoveryRow[]>(
    `SELECT r.id_recuperacao, r.id_usuario, r.token, r.expira_em, r.utilizado
     FROM recuperacoes_senha r
     INNER JOIN usuarios u ON u.id_usuario = r.id_usuario
     WHERE u.email = ? AND r.utilizado = FALSE AND r.expira_em > NOW()
     ORDER BY r.criado_em DESC LIMIT 1`,
    [email],
  );
  return rows[0] && (await bcrypt.compare(code, rows[0].token)) ? rows[0] : null;
}
