import { Router } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import path from 'node:path';
import { RequisicaoAutenticada } from "../middlewares/autenticacao";
import { bancoDados } from "../bancoDados/bancoDados";
import { ErroApi } from "../middlewares/erros";
import { identificadorPositivo } from "../servicos/transacoes";
import { diretorioAnexos } from "../servicos/anexos";
export const rotasOpcoesFinanceiras = Router();
rotasOpcoesFinanceiras.get('/financeiro/opcoes', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const tipo = requisicao.query.tipo;
    if (tipo !== 'Receita' && tipo !== 'Despesa') throw new ErroApi(400, 'Tipo de transação inválido.');
    const [categorias] = await bancoDados.query<RowDataPacket[]>(`SELECT c.id_categoria AS id, c.nome, c.padrao FROM categorias c
       INNER JOIN tipos_transacao tt ON tt.id_tipo_transacao = c.id_tipo_transacao
       WHERE tt.nome = ? AND c.ativa = TRUE AND (c.id_usuario IS NULL OR c.id_usuario = ?)
       ORDER BY c.padrao DESC, c.nome, c.id_categoria`, [tipo, requisicao.userId]);
    const [tiposConta] = await bancoDados.query<RowDataPacket[]>('SELECT id_tipo_conta AS id, nome FROM tipos_conta ORDER BY id_tipo_conta');
    resposta.json({
      categorias: categorias.map(linha => ({
        id: String(linha.id),
        nome: linha.nome,
        padrao: Boolean(linha.padrao)
      })),
      tiposConta: tiposConta.map(linha => ({
        id: String(linha.id),
        nome: linha.nome
      }))
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasOpcoesFinanceiras.post('/financeiro/categorias', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const nome = typeof requisicao.body.nome === 'string' ? requisicao.body.nome.trim().replace(/\s+/g, ' ') : '';
    const tipo = requisicao.body.tipo;
    if (nome.length < 2 || nome.length > 100) throw new ErroApi(400, 'O nome da categoria deve ter entre 2 e 100 caracteres.');
    if (tipo !== 'Receita' && tipo !== 'Despesa') throw new ErroApi(400, 'Tipo de transação inválido.');
    const conexao = await bancoDados.getConnection();
    try {
      await conexao.beginTransaction();
      const [[usuario]] = await conexao.query<RowDataPacket[]>('SELECT id_usuario FROM usuarios WHERE id_usuario = ? FOR UPDATE', [requisicao.userId]);
      if (!usuario) throw new ErroApi(401, 'Usuário não encontrado.');
      const [[tipoAuxiliar]] = await conexao.query<RowDataPacket[]>('SELECT id_tipo_transacao AS id FROM tipos_transacao WHERE nome = ?', [tipo]);
      if (!tipoAuxiliar) throw new ErroApi(409, 'Tipo de transação não configurado no banco.');
      const [[existente]] = await conexao.query<RowDataPacket[]>('SELECT id_categoria AS id, nome, padrao FROM categorias WHERE id_tipo_transacao = ? AND nome = ? AND ativa = TRUE AND (id_usuario IS NULL OR id_usuario = ?) ORDER BY padrao DESC LIMIT 1', [tipoAuxiliar.id, nome, requisicao.userId]);
      if (existente) {
        await conexao.commit();
        resposta.json({
          categoria: {
            id: String(existente.id),
            nome: existente.nome,
            padrao: Boolean(existente.padrao)
          }
        });
        return;
      }
      const [resultado] = await conexao.execute<ResultSetHeader>('INSERT INTO categorias (id_usuario, id_tipo_transacao, nome) VALUES (?, ?, ?)', [requisicao.userId, tipoAuxiliar.id, nome]);
      await conexao.commit();
      resposta.status(201).json({
        categoria: {
          id: String(resultado.insertId),
          nome,
          padrao: false
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
rotasOpcoesFinanceiras.get('/financeiro/anexos/:id', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const id = identificadorPositivo(requisicao.params.id);
    if (!id) throw new ErroApi(400, 'Anexo inválido.');
    const [[anexo]] = await bancoDados.query<RowDataPacket[]>(`SELECT a.nome_arquivo, a.caminho_arquivo FROM anexos_transacao a
       INNER JOIN transacoes t ON t.id_transacao = a.id_transacao WHERE a.id_anexo = ? AND t.id_usuario = ?`, [id, requisicao.userId]);
    if (!anexo || !/^[0-9a-f-]{36}$/i.test(anexo.caminho_arquivo)) throw new ErroApi(404, 'Anexo não encontrado.');
    resposta.setHeader('X-Content-Type-Options', 'nosniff');
    resposta.setHeader('Cache-Control', 'private, no-store');
    resposta.download(path.join(diretorioAnexos, anexo.caminho_arquivo), anexo.nome_arquivo, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }, falha => {
      if (falha && !resposta.headersSent) proximo(new ErroApi(404, 'Arquivo não encontrado.'));
    });
  } catch (falha) {
    proximo(falha);
  }
});
