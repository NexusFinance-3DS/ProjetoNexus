import { randomInt } from 'crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { autenticar, RequisicaoAutenticada, criarToken } from "../middlewares/autenticacao";
import { bancoDados } from "../bancoDados/bancoDados";
import { enviarCodigoRecuperacao } from '../servicos/email';
import { dataNascimentoValida, emailValido, normalizarData, normalizarEmail, erroSenha } from "../utilitarios/validacoes";
interface UserRow extends RowDataPacket {
  id_usuario: number;
  nome: string;
  email: string;
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
export const rotasAutenticacao = Router();
rotasAutenticacao.post('/cadastro', async (requisicao, resposta, proximo) => {
  try {
    const nome = typeof requisicao.body.nome === 'string' ? requisicao.body.nome.trim() : '';
    const email = normalizarEmail(requisicao.body.email);
    const dataNascimento = normalizarData(requisicao.body.dataNascimento);
    const senha = requisicao.body.senha;
    const confirmarSenha = requisicao.body.confirmarSenha;
    if (nome.length < 3) return resposta.status(400).json({
      mensagem: 'Informe o nome completo.'
    });
    if (!emailValido(email)) return resposta.status(400).json({
      mensagem: 'Informe um e-mail válido, como nome@exemplo.com.'
    });
    if (!dataNascimentoValida(dataNascimento)) return resposta.status(400).json({
      mensagem: 'Confira a data de nascimento. Use o formato DD/MM/AAAA.'
    });
    const senhaErro = erroSenha(senha);
    if (senhaErro) return resposta.status(400).json({
      mensagem: senhaErro
    });
    if (senha !== confirmarSenha) return resposta.status(400).json({
      mensagem: 'As senhas não coincidem.'
    });
    const [existente] = await bancoDados.query<UserRow[]>('SELECT id_usuario FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (existente.length) return resposta.status(409).json({
      mensagem: 'E-mail já cadastrado.'
    });
    const senhaHash = await bcrypt.hash(senha, 10);
    const conexao = await bancoDados.getConnection();
    try {
      await conexao.beginTransaction();
      const [resultado] = await conexao.execute<ResultSetHeader>('INSERT INTO usuarios (nome, email, data_nascimento, senha_hash) VALUES (?, ?, ?, ?)', [nome, email, dataNascimento, senhaHash]);
      await conexao.execute('INSERT INTO configuracoes (id_usuario) VALUES (?)', [resultado.insertId]);
      const [[tipoConta]] = await conexao.query<RowDataPacket[]>("SELECT id_tipo_conta FROM tipos_conta WHERE nome = 'Conta Corrente' LIMIT 1");
      if (tipoConta) {
        await conexao.execute("INSERT INTO contas (id_usuario, id_tipo_conta, nome) VALUES (?, ?, 'Conta principal')", [resultado.insertId, tipoConta.id_tipo_conta]);
      }
      await conexao.commit();
      resposta.status(201).json({
        mensagem: 'Cadastro realizado com sucesso.',
        usuario: {
          id: resultado.insertId,
          nome,
          email
        }
      });
    } catch (falha) {
      await conexao.rollback();
      throw falha;
    } finally {
      conexao.release();
    }
  } catch (falha) {
    proximo(falha);
  }
});
rotasAutenticacao.post('/login', async (requisicao, resposta, proximo) => {
  try {
    const email = normalizarEmail(requisicao.body.email);
    const senha = requisicao.body.senha;
    if (!emailValido(email) || typeof senha !== 'string' || !senha) {
      return resposta.status(400).json({
        mensagem: 'Informe e-mail e senha válidos.'
      });
    }
    const [usuarios] = await bancoDados.query<UserRow[]>('SELECT id_usuario, nome, email, senha_hash, ativo FROM usuarios WHERE email = ? LIMIT 1', [email]);
    const usuario = usuarios[0];
    if (!usuario || !usuario.ativo || !(await bcrypt.compare(senha, usuario.senha_hash))) {
      return resposta.status(401).json({
        mensagem: 'E-mail ou senha incorretos.'
      });
    }
    resposta.json({
      mensagem: 'Login realizado com sucesso.',
      token: criarToken(usuario.id_usuario),
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasAutenticacao.get('/sessao', autenticar, async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const [usuarios] = await bancoDados.query<UserRow[]>('SELECT id_usuario, nome, email, data_nascimento FROM usuarios WHERE id_usuario = ? AND ativo = TRUE LIMIT 1', [requisicao.userId]);
    if (!usuarios.length) return resposta.status(404).json({
      mensagem: 'Usuário não encontrado.'
    });
    const usuario = usuarios[0];
    resposta.json({
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        dataNascimento: usuario.data_nascimento
      }
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasAutenticacao.post('/logout', autenticar, (_requisicao, resposta) => {
  resposta.json({
    mensagem: 'Logout realizado. Remova o token salvo no aplicativo.'
  });
});
rotasAutenticacao.post('/recuperar-senha', async (requisicao, resposta, proximo) => {
  try {
    const email = normalizarEmail(requisicao.body.email);
    if (!emailValido(email)) return resposta.status(400).json({
      mensagem: 'Informe um e-mail válido, como nome@exemplo.com.'
    });
    const [usuarios] = await bancoDados.query<UserRow[]>('SELECT id_usuario, email FROM usuarios WHERE email = ? AND ativo = TRUE LIMIT 1', [email]);
    if (usuarios.length) {
      const codigo = String(randomInt(100000, 1000000));
      const hashCodigo = await bcrypt.hash(codigo, 10);
      await bancoDados.execute('UPDATE recuperacoes_senha SET utilizado = TRUE WHERE id_usuario = ? AND utilizado = FALSE', [usuarios[0].id_usuario]);
      await bancoDados.execute('INSERT INTO recuperacoes_senha (id_usuario, token, expira_em) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))', [usuarios[0].id_usuario, hashCodigo]);
      await enviarCodigoRecuperacao(email, codigo);
    }
    resposta.json({
      mensagem: 'Se o e-mail estiver cadastrado, um código será enviado.'
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasAutenticacao.post('/validar-codigo', async (requisicao, resposta, proximo) => {
  try {
    const email = normalizarEmail(requisicao.body.email);
    const codigo = typeof requisicao.body.codigo === 'string' ? requisicao.body.codigo.trim() : '';
    const recuperacao = await encontrarRecuperacaoValida(email, codigo);
    if (!recuperacao) return resposta.status(400).json({
      mensagem: 'O código não confere ou expirou. Solicite outro e tente novamente.'
    });
    resposta.json({
      mensagem: 'Código válido.'
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasAutenticacao.post('/nova-senha', async (requisicao, resposta, proximo) => {
  try {
    const email = normalizarEmail(requisicao.body.email);
    const codigo = typeof requisicao.body.codigo === 'string' ? requisicao.body.codigo.trim() : '';
    const senha = requisicao.body.senha;
    const confirmarSenha = requisicao.body.confirmarSenha;
    const senhaErro = erroSenha(senha);
    if (senhaErro) return resposta.status(400).json({
      mensagem: senhaErro
    });
    if (senha !== confirmarSenha) return resposta.status(400).json({
      mensagem: 'As senhas não coincidem.'
    });
    const conexao = await bancoDados.getConnection();
    try {
      await conexao.beginTransaction();
      // Lock the active code while consuming it. Concurrent password-reset
      // requests using the same code must not both succeed.
      const [linhas] = await conexao.query<RecoveryRow[]>(`SELECT r.id_recuperacao, r.id_usuario, r.token, r.expira_em, r.utilizado
         FROM recuperacoes_senha r
         INNER JOIN usuarios u ON u.id_usuario = r.id_usuario
         WHERE u.email = ? AND r.utilizado = FALSE AND r.expira_em > NOW()
         ORDER BY r.criado_em DESC LIMIT 1 FOR UPDATE`, [email]);
      const recuperacao = linhas[0] && await bcrypt.compare(codigo, linhas[0].token) ? linhas[0] : null;
      if (!recuperacao) {
        await conexao.rollback();
        return resposta.status(400).json({
          mensagem: 'O código não confere ou expirou. Solicite outro e tente novamente.'
        });
      }
      await conexao.execute('UPDATE usuarios SET senha_hash = ? WHERE id_usuario = ?', [await bcrypt.hash(senha, 10), recuperacao.id_usuario]);
      // Revoke other outstanding reset codes for the account as well.
      await conexao.execute('UPDATE recuperacoes_senha SET utilizado = TRUE WHERE id_usuario = ? AND utilizado = FALSE', [recuperacao.id_usuario]);
      await conexao.commit();
      resposta.json({
        mensagem: 'Senha alterada com sucesso.'
      });
    } catch (falha) {
      await conexao.rollback();
      throw falha;
    } finally {
      conexao.release();
    }
  } catch (falha) {
    proximo(falha);
  }
});
async function encontrarRecuperacaoValida(email: string, codigo: string): Promise<RecoveryRow | null> {
  if (!emailValido(email) || !/^\d{6}$/.test(codigo)) return null;
  const [linhas] = await bancoDados.query<RecoveryRow[]>(`SELECT r.id_recuperacao, r.id_usuario, r.token, r.expira_em, r.utilizado
     FROM recuperacoes_senha r
     INNER JOIN usuarios u ON u.id_usuario = r.id_usuario
     WHERE u.email = ? AND r.utilizado = FALSE AND r.expira_em > NOW()
     ORDER BY r.criado_em DESC LIMIT 1`, [email]);
  return linhas[0] && (await bcrypt.compare(codigo, linhas[0].token)) ? linhas[0] : null;
}
