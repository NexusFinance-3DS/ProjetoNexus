import { resumoFinanceiro } from "../servicos/financeiro";
import { gerarRecorrencias } from "../servicos/recorrencias";
import { confirmarTransacao, criarTransacao, converterValorMonetario, identificadorPositivo } from "../servicos/transacoes";
import { upload } from "../servicos/anexos";
import { rotasOpcoesFinanceiras } from "./opcoesFinanceiras.rotas";
import { Router } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { autenticar, RequisicaoAutenticada } from "../middlewares/autenticacao";
import { bancoDados } from "../bancoDados/bancoDados";
import { dataNascimentoValida, emailValido, normalizarData, normalizarEmail } from "../utilitarios/validacoes";
interface DataRow extends RowDataPacket {
  [chave: string]: unknown;
}
export const rotasDados = Router();
rotasDados.use(autenticar);
rotasDados.use(rotasOpcoesFinanceiras);
rotasDados.get('/configuracoes', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const [[linha]] = await bancoDados.query<RowDataPacket[]>('SELECT notificacoes_ativas, tema FROM configuracoes WHERE id_usuario = ?', [requisicao.userId]);
    resposta.json({
      notificacoes: linha ? Boolean(linha.notificacoes_ativas) : true,
      tema: linha?.tema === 'claro' ? 'claro' : 'escuro'
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.put('/configuracoes', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const {
      notificacoes,
      tema
    } = requisicao.body || {};
    if (notificacoes === undefined && tema === undefined) return resposta.status(400).json({
      mensagem: 'Informe a preferência que deseja alterar.'
    });
    if (notificacoes !== undefined && typeof notificacoes !== 'boolean') return resposta.status(400).json({
      mensagem: 'Preferência de notificações inválida.'
    });
    if (tema !== undefined && tema !== 'claro' && tema !== 'escuro') return resposta.status(400).json({
      mensagem: 'Escolha tema claro ou escuro.'
    });
    // Update only supplied preferences so concurrent changes do not overwrite each other.
    const alteracoes = [notificacoes !== undefined ? 'notificacoes_ativas = VALUES(notificacoes_ativas)' : '', tema !== undefined ? 'tema = VALUES(tema)' : ''].filter(Boolean).join(', ');
    await bancoDados.execute(`INSERT INTO configuracoes (id_usuario, notificacoes_ativas, tema) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ${alteracoes}`, [requisicao.userId, notificacoes ?? true, tema ?? 'escuro']);
    const [[linha]] = await bancoDados.query<RowDataPacket[]>('SELECT notificacoes_ativas, tema FROM configuracoes WHERE id_usuario = ?', [requisicao.userId]);
    resposta.json({
      notificacoes: Boolean(linha.notificacoes_ativas),
      tema: linha.tema
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.get('/financeiro/resumo', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const idUsuario = requisicao.userId!;
    await gerarRecorrencias(idUsuario);
    const resumo = await resumoFinanceiro(idUsuario);
    const [metas] = await bancoDados.query<DataRow[]>(`SELECT m.id_meta AS id, m.nome, m.valor_objetivo AS objetivo,
        COALESCE(SUM(CASE WHEN mm.tipo = 'deposito' THEN mm.valor ELSE -mm.valor END), 0) AS atual
       FROM metas m LEFT JOIN movimentacoes_metas mm ON mm.id_meta = m.id_meta
       WHERE m.id_usuario = ? AND m.status = 'em_andamento'
       GROUP BY m.id_meta ORDER BY m.criada_em DESC LIMIT 1`, [idUsuario]);
    resposta.json({
      ...resumo,
      meta: metas[0] ? {
        id: Number(metas[0].id),
        nome: String(metas[0].nome),
        objetivo: Number(metas[0].objetivo),
        atual: Number(metas[0].atual)
      } : null
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.get('/financeiro/transacoes', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    await gerarRecorrencias(requisicao.userId!);
    const [linhas] = await bancoDados.query<DataRow[]>(`SELECT t.id_transacao AS id, t.descricao, t.valor,
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
       WHERE t.id_usuario = ? ORDER BY t.data_transacao DESC, t.id_transacao DESC`, [requisicao.userId]);
    const [anexos] = await bancoDados.query<DataRow[]>(`SELECT a.id_anexo AS id, a.id_transacao AS transacaoId, a.nome_arquivo AS nome, a.tamanho_arquivo AS tamanho
       FROM anexos_transacao a INNER JOIN transacoes t ON t.id_transacao = a.id_transacao
       WHERE t.id_usuario = ? ORDER BY a.id_anexo`, [requisicao.userId]);
    resposta.json({
      transacoes: linhas.map(linha => ({
        id: String(linha.id),
        descricao: String(linha.descricao),
        categoria: String(linha.categoria),
        tipo: linha.tipo === 'Receita' ? 'Receitas' : 'Despesas',
        valor: Number(linha.valor),
        data: String(linha.data),
        status: String(linha.status),
        futura: Boolean(linha.futura),
        podeConfirmar: linha.status === 'Pendente' && !linha.futura,
        observacao: linha.observacao ? String(linha.observacao) : '',
        conta: String(linha.conta),
        tipoConta: String(linha.tipoConta),
        anexos: anexos.filter(item => String(item.transacaoId) === String(linha.id)).map(item => ({
          id: String(item.id),
          nome: String(item.nome),
          tamanho: Number(item.tamanho),
          url: `/financeiro/anexos/${item.id}`
        }))
      }))
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.post('/financeiro/transacoes', upload.single('arquivo'), async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const resultado = await criarTransacao(requisicao.userId!, requisicao.body || {}, requisicao.file);
    resposta.status(201).json(resultado);
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.patch('/financeiro/transacoes/:id/confirmar', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    await confirmarTransacao(requisicao.userId!, requisicao.params.id);
    resposta.json({
      mensagem: 'Transação confirmada com sucesso.'
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.get('/metas', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const [linhas] = await bancoDados.query<DataRow[]>(`SELECT m.id_meta AS id, m.nome, m.valor_objetivo AS objetivo, m.status,
        COALESCE(SUM(CASE WHEN mm.tipo = 'deposito' THEN mm.valor ELSE -mm.valor END), 0) AS atual
       FROM metas m LEFT JOIN movimentacoes_metas mm ON mm.id_meta = m.id_meta
       WHERE m.id_usuario = ? GROUP BY m.id_meta ORDER BY m.criada_em DESC`, [requisicao.userId]);
    resposta.json({
      metas: linhas.map(linha => ({
        id: String(linha.id),
        nome: String(linha.nome),
        objetivo: Number(linha.objetivo),
        atual: Number(linha.atual),
        status: String(linha.status)
      }))
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.post('/metas', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const nome = typeof requisicao.body.nome === 'string' ? requisicao.body.nome.trim() : '';
    const alvo = converterValorMonetario(requisicao.body.objetivo);
    const atual = converterValorMonetario(requisicao.body.atual ?? 0);
    if (nome.length < 2 || nome.length > 150) return resposta.status(400).json({
      mensagem: 'O nome da meta deve ter entre 2 e 150 caracteres.'
    });
    if (!Number.isFinite(alvo) || alvo <= 0 || alvo > 9999999999.99) return resposta.status(400).json({
      mensagem: 'Informe um objetivo válido.'
    });
    if (!Number.isFinite(atual) || atual < 0 || atual > 9999999999.99) return resposta.status(400).json({
      mensagem: 'Informe um valor atual válido.'
    });
    const conexao = await bancoDados.getConnection();
    try {
      await conexao.beginTransaction();
      const [resultado] = await conexao.execute<ResultSetHeader>('INSERT INTO metas (id_usuario, nome, valor_objetivo, data_inicio, status) VALUES (?, ?, ?, CURDATE(), ?)', [requisicao.userId!, nome, alvo, atual >= alvo ? 'concluida' : 'em_andamento']);
      if (atual > 0) {
        await conexao.execute("INSERT INTO movimentacoes_metas (id_meta, tipo, valor, data_movimentacao, descricao) VALUES (?, 'deposito', ?, CURDATE(), 'Valor inicial')", [resultado.insertId, atual]);
      }
      await conexao.commit();
      resposta.status(201).json({
        mensagem: 'Meta salva com sucesso.',
        id: resultado.insertId
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
rotasDados.put('/metas/:id', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const id = identificadorPositivo(requisicao.params.id);
    const nome = typeof requisicao.body.nome === 'string' ? requisicao.body.nome.trim() : '';
    const alvo = converterValorMonetario(requisicao.body.objetivo);
    const atual = converterValorMonetario(requisicao.body.atual ?? 0);
    if (!id) return resposta.status(400).json({
      mensagem: 'Meta inválida.'
    });
    if (nome.length < 2 || nome.length > 150) return resposta.status(400).json({
      mensagem: 'O nome da meta deve ter entre 2 e 150 caracteres.'
    });
    if (!Number.isFinite(alvo) || alvo <= 0 || alvo > 9999999999.99) return resposta.status(400).json({
      mensagem: 'Informe um objetivo válido.'
    });
    if (!Number.isFinite(atual) || atual < 0 || atual > 9999999999.99) return resposta.status(400).json({
      mensagem: 'Informe um valor atual válido.'
    });
    const conexao = await bancoDados.getConnection();
    try {
      await conexao.beginTransaction();
      const [[meta]] = await conexao.query<RowDataPacket[]>('SELECT id_meta FROM metas WHERE id_meta = ? AND id_usuario = ? FOR UPDATE', [id, requisicao.userId!]);
      if (!meta) {
        await conexao.rollback();
        return resposta.status(404).json({
          mensagem: 'Meta não encontrada.'
        });
      }
      const [[linhaTotal]] = await conexao.query<RowDataPacket[]>(`SELECT COALESCE(SUM(CASE WHEN tipo = 'deposito' THEN valor ELSE -valor END), 0) AS atual
         FROM movimentacoes_metas WHERE id_meta = ?`, [id]);
      const atualAnterior = Number(linhaTotal?.atual || 0);
      const diferenca = Math.round((atual - atualAnterior) * 100) / 100;
      if (diferenca !== 0) {
        await conexao.execute(`INSERT INTO movimentacoes_metas (id_meta, tipo, valor, data_movimentacao, descricao)
           VALUES (?, ?, ?, CURDATE(), 'Ajuste manual da meta')`, [id, diferenca > 0 ? 'deposito' : 'retirada', Math.abs(diferenca)]);
      }
      await conexao.execute('UPDATE metas SET nome = ?, valor_objetivo = ?, status = ? WHERE id_meta = ? AND id_usuario = ?', [nome, alvo, atual >= alvo ? 'concluida' : 'em_andamento', id, requisicao.userId!]);
      await conexao.commit();
      resposta.json({
        mensagem: atual >= alvo ? 'Meta atualizada e concluída.' : 'Meta atualizada com sucesso.'
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
rotasDados.delete('/metas/:id', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const id = identificadorPositivo(requisicao.params.id);
    if (!id) return resposta.status(400).json({
      mensagem: 'Meta inválida.'
    });
    const [resultado] = await bancoDados.execute<ResultSetHeader>('DELETE FROM metas WHERE id_meta = ? AND id_usuario = ?', [id, requisicao.userId!]);
    if (!resultado.affectedRows) return resposta.status(404).json({
      mensagem: 'Meta não encontrada.'
    });
    resposta.json({
      mensagem: 'Meta excluída com sucesso.'
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.get('/notificacoes', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const [linhas] = await bancoDados.query<DataRow[]>(`SELECT n.id_notificacao AS id, n.titulo, n.descricao, n.lida, n.criado_em, tn.nome AS tipo
       FROM notificacoes n INNER JOIN tipos_notificacao tn ON tn.id_tipo_notificacao = n.id_tipo_notificacao
       WHERE n.id_usuario = ? ORDER BY n.criado_em DESC LIMIT 50`, [requisicao.userId]);
    resposta.json({
      notificacoes: linhas.map(linha => ({
        ...linha,
        id: String(linha.id),
        lida: Boolean(linha.lida)
      }))
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.patch('/notificacoes/:id/lida', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    await bancoDados.execute('UPDATE notificacoes SET lida = TRUE WHERE id_notificacao = ? AND id_usuario = ?', [String(requisicao.params.id), requisicao.userId!]);
    resposta.json({
      mensagem: 'Notificação marcada como lida.'
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.get('/usuarios/me', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const [linhas] = await bancoDados.query<DataRow[]>(`SELECT u.nome, u.email, u.telefone,
        DATE_FORMAT(u.data_nascimento, '%Y-%m-%d') AS dataNascimento,
        e.cep, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.estado
       FROM usuarios u LEFT JOIN enderecos e ON e.id_usuario = u.id_usuario
       WHERE u.id_usuario = ? LIMIT 1`, [requisicao.userId]);
    if (!linhas.length) return resposta.status(404).json({
      mensagem: 'Usuário não encontrado.'
    });
    resposta.json({
      usuario: linhas[0]
    });
  } catch (falha) {
    proximo(falha);
  }
});
rotasDados.put('/usuarios/me', async (requisicao: RequisicaoAutenticada, resposta, proximo) => {
  try {
    const nome = typeof requisicao.body.nome === 'string' ? requisicao.body.nome.trim() : '';
    const email = normalizarEmail(requisicao.body.email);
    const dataNascimento = normalizarData(requisicao.body.dataNascimento);
    const telefone = typeof requisicao.body.telefone === 'string' ? requisicao.body.telefone.trim() : null;
    if (nome.length < 3) return resposta.status(400).json({
      mensagem: 'Informe o nome completo.'
    });
    if (!emailValido(email)) return resposta.status(400).json({
      mensagem: 'E-mail inválido.'
    });
    if (!dataNascimentoValida(dataNascimento)) return resposta.status(400).json({
      mensagem: 'Data de nascimento inválida.'
    });
    await bancoDados.execute('UPDATE usuarios SET nome = ?, email = ?, telefone = ?, data_nascimento = ? WHERE id_usuario = ?', [nome, email, telefone, dataNascimento, requisicao.userId!]);
    resposta.json({
      mensagem: 'Cadastro atualizado com sucesso.'
    });
  } catch (falha) {
    proximo(falha);
  }
});
