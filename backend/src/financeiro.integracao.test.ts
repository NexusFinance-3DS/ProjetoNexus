import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import mysql, { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { readFile, mkdtemp, readdir, unlink, rmdir } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { Server } from 'node:http';

// Ative explicitamente: estes testes criam e removem apenas seu banco isolado.
describe.skipIf(process.env.NEXUS_MYSQL_TEST !== '1')("API financeira com MySQL e arquivos reais", () => {
  const nomeBanco = `nexus_test_${process.pid}_${Date.now()}`;
  let admin: Connection;
  let servidor: Server;
  let fecharConexoes: () => Promise<void>;
  let diretorioUpload: string;
  let base: string;
  let token: string;
  let tokenOutroUsuario: string;
  let categoriaPropria: string;
  let categoriaDespesa: string;
  let tipoConta: string;
  beforeAll(async () => {
    admin = await mysql.createConnection({
      host: '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });
    if (!/^nexus_test_\d+_\d+$/.test(nomeBanco)) throw new Error("Nome de banco de testes inv\xE1lido");
    await admin.query(`CREATE DATABASE ${nomeBanco} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await admin.changeUser({
      database: nomeBanco
    });
    const estruturaBanco = (await readFile(path.resolve(__dirname, '../../SQL.txt'), 'utf8')).replace(/DROP DATABASE[^;]+;/i, '').replace(/CREATE DATABASE[\s\S]+?;/i, '').replace(/USE nexus_finance;/i, '');
    await admin.query(estruturaBanco);
    const [primeiro] = await admin.execute<ResultSetHeader>("INSERT INTO usuarios (nome, email, senha_hash) VALUES ('Teste', 'one@test.invalid', 'test')");
    const [segundo] = await admin.execute<ResultSetHeader>("INSERT INTO usuarios (nome, email, senha_hash) VALUES ('Outro', 'two@test.invalid', 'test')");
    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_NAME = nomeBanco;
    diretorioUpload = await mkdtemp(path.join(os.tmpdir(), 'nexus-upload-test-'));
    process.env.UPLOAD_DIR = diretorioUpload;
    const {
      bancoDados
    } = await import("./bancoDados");
    fecharConexoes = () => bancoDados.end();
    const {
      aplicativo
    } = await import("./aplicativo");
    const {
      criarToken
    } = await import("./autenticacao");
    token = criarToken(primeiro.insertId);
    tokenOutroUsuario = criarToken(segundo.insertId);
    servidor = await new Promise<Server>(resolve => {
      const s = aplicativo.listen(0, '127.0.0.1', () => resolve(s));
    });
    base = `http://127.0.0.1:${(servidor.address() as {
      port: number;
    }).port}`;
  }, 30000);
  afterAll(async () => {
    if (servidor) await new Promise<void>(resolve => {
      servidor.close(() => resolve());
      servidor.closeAllConnections();
    });
    if (fecharConexoes) await fecharConexoes();
    if (admin) {
      if (/^nexus_test_\d+_\d+$/.test(nomeBanco)) await admin.query(`DROP DATABASE IF EXISTS ${nomeBanco}`);
      await admin.end();
    }
    if (diretorioUpload && path.dirname(diretorioUpload) === path.resolve(os.tmpdir()) && path.basename(diretorioUpload).startsWith('nexus-upload-test-')) {
      for (const arquivo of await readdir(diretorioUpload)) await unlink(path.join(diretorioUpload, arquivo));
      await rmdir(diretorioUpload);
    }
  });
  const requisicao = (rota: string, corpo?: unknown, autenticacao = token) => fetch(base + rota, {
    method: corpo ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${autenticacao}`,
      ...(corpo instanceof FormData ? {} : {
        'Content-Type': 'application/json'
      })
    },
    body: corpo instanceof FormData ? corpo : corpo ? JSON.stringify(corpo) : undefined
  });
  const conteudo = () => ({
    tipo: 'Receita',
    valor: '100,25',
    descricao: 'Serviço de teste',
    data: '2026-09-08',
    categoriaId: categoriaPropria,
    tipoContaId: tipoConta,
    recorrente: false
  });
  it('requires authentication and returns database options filtered by transaction type', async () => {
    expect((await fetch(base + '/financeiro/opcoes?tipo=Receita')).status).toBe(401);
    const resposta = await requisicao('/financeiro/opcoes?tipo=Receita');
    expect(resposta.status).toBe(200);
    const dados = await resposta.json();
    expect(dados.categorias.some((c: {
      nome: string;
    }) => c.nome === 'Salário')).toBe(true);
    expect(dados.categorias.some((c: {
      nome: string;
    }) => c.nome === 'Alimentação')).toBe(false);
    tipoConta = dados.tiposConta.find((c: {
      nome: string;
    }) => c.nome === 'Poupança').id;
    categoriaDespesa = (await (await requisicao('/financeiro/opcoes?tipo=Despesa')).json()).categorias[0].id;
  });
  it('persists a new category, reuses duplicates, and keeps it private', async () => {
    const respostas = await Promise.all([requisicao('/financeiro/categorias', {
      tipo: 'Receita',
      nome: 'Consultoria'
    }), requisicao('/financeiro/categorias', {
      tipo: 'Receita',
      nome: ' Consultoria '
    })]);
    const dados = await Promise.all(respostas.map(r => r.json()));
    expect(dados[0].categoria.id).toBe(dados[1].categoria.id);
    categoriaPropria = dados[0].categoria.id;
    const [armazenado] = await admin.query<RowDataPacket[]>("SELECT id_usuario FROM categorias WHERE nome = 'Consultoria'");
    expect(armazenado).toHaveLength(1);
    expect(armazenado[0].id_usuario).toBe(1);
    const meu = await (await requisicao('/financeiro/opcoes?tipo=Receita')).json();
    const outro = await (await requisicao('/financeiro/opcoes?tipo=Receita', undefined, tokenOutroUsuario)).json();
    expect(meu.categorias.some((c: {
      id: string;
    }) => c.id === categoriaPropria)).toBe(true);
    expect(outro.categorias.some((c: {
      id: string;
    }) => c.id === categoriaPropria)).toBe(false);
  });
  it('rejects categories belonging to someone else or to the wrong type, and invalid account types', async () => {
    expect((await requisicao('/financeiro/transacoes', conteudo(), tokenOutroUsuario)).status).toBe(400);
    expect((await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      categoriaId: categoriaDespesa
    })).status).toBe(400);
    expect((await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      tipoContaId: '99999'
    })).status).toBe(400);
    const [[linha]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM transacoes');
    expect(linha.n).toBe(0);
  });
  it('saves selected account type and category without an attachment', async () => {
    const resposta = await requisicao('/financeiro/transacoes', conteudo());
    expect(resposta.status).toBe(201);
    const [[linha]] = await admin.query<RowDataPacket[]>('SELECT tc.nome AS tipo, t.id_categoria, t.valor FROM transacoes t JOIN contas c ON c.id_conta=t.id_conta JOIN tipos_conta tc ON tc.id_tipo_conta=c.id_tipo_conta');
    expect(linha.tipo).toBe('Poupança');
    expect(String(linha.id_categoria)).toBe(categoriaPropria);
    expect(Number(linha.valor)).toBe(100.25);
    const [[quantidade]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM recorrencias');
    expect(quantidade.n).toBe(0);
  });
  it('persists multipart bytes and recurrence, lists the attachment and protects downloads', async () => {
    const formulario = new FormData();
    Object.entries({
      ...conteudo(),
      recorrente: true
    }).forEach(([k, v]) => formulario.append(k, String(v)));
    formulario.append('arquivo', new Blob(['comprovante de teste'], {
      type: 'text/plain'
    }), 'comprovante-ação.txt');
    const resposta = await requisicao('/financeiro/transacoes', formulario);
    expect(resposta.status).toBe(201);
    const salvo = await resposta.json();
    const [[anexo]] = await admin.query<RowDataPacket[]>('SELECT * FROM anexos_transacao WHERE id_anexo = ?', [salvo.anexoId]);
    expect(await readFile(path.join(diretorioUpload, anexo.caminho_arquivo), 'utf8')).toBe('comprovante de teste');
    const [[quantidade]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM recorrencias WHERE id_transacao_origem = ?', [salvo.id]);
    expect(quantidade.n).toBe(1);
    const listagem = await (await requisicao('/financeiro/transacoes')).json();
    expect(listagem.transacoes.find((t: {
      id: string;
    }) => t.id === String(salvo.id)).anexos[0].nome).toBe('comprovante-ação.txt');
    const baixarArquivo = await requisicao(`/financeiro/anexos/${salvo.anexoId}`);
    expect(baixarArquivo.status).toBe(200);
    expect(await baixarArquivo.text()).toBe('comprovante de teste');
    expect((await requisicao(`/financeiro/anexos/${salvo.anexoId}`, undefined, tokenOutroUsuario)).status).toBe(404);
    expect((await fetch(base + `/financeiro/anexos/${salvo.anexoId}`)).status).toBe(401);
  });
  it('rejects empty/oversized files and impossible dates without creating a transaction', async () => {
    for (const bytes of [0, 10 * 1024 * 1024 + 1]) {
      const formulario = new FormData();
      Object.entries(conteudo()).forEach(([k, v]) => formulario.append(k, String(v)));
      formulario.append('arquivo', new Blob([new Uint8Array(bytes)]), 'test.bin');
      expect((await requisicao('/financeiro/transacoes', formulario)).status).toBe(400);
    }
    expect((await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      data: '2026-02-30'
    })).status).toBe(400);
    const [[quantidade]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM transacoes');
    expect(quantidade.n).toBe(2);
  });
  it('rolls back both the transaction and file when a later database insert fails', async () => {
    const arquivosAntes = await readdir(diretorioUpload);
    await admin.query("CREATE TRIGGER test_notification_failure BEFORE INSERT ON notificacoes FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Test rollback'");
    try {
      const formulario = new FormData();
      Object.entries(conteudo()).forEach(([k, v]) => formulario.append(k, String(v)));
      formulario.append('arquivo', new Blob(['rollback']), 'rollback.txt');
      expect((await requisicao('/financeiro/transacoes', formulario)).status).toBe(500);
      expect(await readdir(diretorioUpload)).toEqual(arquivosAntes);
      const [[quantidade]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM transacoes');
      expect(quantidade.n).toBe(2);
    } finally {
      await admin.query('DROP TRIGGER test_notification_failure');
    }
  });
  it('persists notification preferences per user and honors them when saving', async () => {
    const atualizar = await fetch(base + '/configuracoes', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notificacoes: false
      })
    });
    expect(atualizar.status).toBe(200);
    expect((await (await requisicao('/configuracoes')).json()).notificacoes).toBe(false);
    expect((await (await requisicao('/configuracoes', undefined, tokenOutroUsuario)).json()).notificacoes).toBe(true);
    const [[before]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM notificacoes');
    expect((await requisicao('/financeiro/transacoes', conteudo())).status).toBe(201);
    const [[after]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM notificacoes');
    expect(after.n).toBe(before.n);
  });
  it('keeps future months out of the six-month financial report', async () => {
    expect((await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      data: '2099-12-01'
    })).status).toBe(201);
    const resumo = await (await requisicao('/financeiro/resumo')).json();
    expect(resumo.historico.some((m: {
      periodo: string;
    }) => m.periodo === '2099-12')).toBe(false);
  });
  it('persists the theme per account and preserves independently updated preferences', async () => {
    const atualizar = (corpo: unknown) => fetch(base + '/configuracoes', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(corpo)
    });
    expect((await atualizar({
      tema: 'claro'
    })).status).toBe(200);
    expect(await (await requisicao('/configuracoes')).json()).toEqual({
      tema: 'claro',
      notificacoes: false
    });
    expect(await (await requisicao('/configuracoes', undefined, tokenOutroUsuario)).json()).toEqual({
      tema: 'escuro',
      notificacoes: true
    });
    const resultados = await Promise.all([atualizar({
      tema: 'escuro'
    }), atualizar({
      notificacoes: true
    })]);
    expect(resultados.every(r => r.status === 200)).toBe(true);
    expect(await (await requisicao('/configuracoes')).json()).toEqual({
      tema: 'escuro',
      notificacoes: true
    });
    const [[linha]] = await admin.query<RowDataPacket[]>('SELECT tema FROM configuracoes WHERE id_usuario = 1');
    expect(linha.tema).toBe('escuro');
  });
  it('rejects invalid themes without overwriting the existing settings', async () => {
    for (const corpo of [{
      tema: 'invalid'
    }, {
      tema: null
    }, {
      notificacoes: 'false',
      tema: 'claro'
    }, {}]) {
      const resposta = await fetch(base + '/configuracoes', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(corpo)
      });
      expect(resposta.status).toBe(400);
    }
    expect(await (await requisicao('/configuracoes')).json()).toEqual({
      tema: 'escuro',
      notificacoes: true
    });
  });
  it('separates accumulated cash, realized results, forecasts and empty history', async () => {
    const [usuario] = await admin.execute<ResultSetHeader>("INSERT INTO usuarios (nome,email,senha_hash) VALUES ('Saldo','balance@test.invalid','test')");
    const {
      criarToken
    } = await import("./autenticacao");
    const autenticacao = criarToken(usuario.insertId);
    const [[datas]] = await admin.query<RowDataPacket[]>("SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS today, DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-%d') AS previous, DATE_FORMAT(LAST_DAY(CURDATE()), '%Y-%m-%d') AS future");
    const vazio = await (await requisicao('/financeiro/resumo', undefined, autenticacao)).json();
    expect(vazio.historico).toHaveLength(6);
    expect(vazio.historico.every((m: {
      saldo: number;
    }) => m.saldo === 0)).toBe(true);
    expect(vazio.economia.percentual).toBeNull();
    const save = async (tipo: string, valor: number, dados: string, status = 'Confirmada') => {
      const resposta = await requisicao('/financeiro/transacoes', {
        tipo,
        valor,
        data: dados,
        status,
        descricao: 'Teste saldo',
        categoria: tipo === 'Receita' ? 'Salário' : 'Alimentação'
      }, autenticacao);
      expect(resposta.status).toBe(201);
      return (await resposta.json()).id;
    };
    await save('Receita', 100, datas.previous);
    await save('Receita', 50.3, datas.today);
    await save('Despesa', 20.2, datas.today);
    await save('Despesa', 10, datas.today, 'Pendente');
    await save('Receita', 5, datas.previous, 'Pendente');
    const cancelada = await save('Despesa', 900, datas.today);
    await admin.execute("UPDATE transacoes SET id_status_transacao = (SELECT id_status_transacao FROM status_transacao WHERE nome='Cancelada') WHERE id_transacao=?", [cancelada]);
    await admin.execute('UPDATE contas SET saldo_inicial = 200 WHERE id_usuario=?', [usuario.insertId]);
    const temFuturo = datas.future > datas.today;
    if (temFuturo) await save('Receita', 70, datas.future);
    const resumo = await (await requisicao('/financeiro/resumo', undefined, autenticacao)).json();
    expect(resumo.saldoDisponivel).toBe(330.1);
    expect(resumo.atual).toEqual({
      totalReceitas: 50.3,
      totalDespesas: 20.2,
      saldo: 30.1
    });
    expect(resumo.anterior.saldo).toBe(100);
    expect(resumo.previsao.totalDespesas).toBe(30.2);
    expect(resumo.previsao.totalReceitas).toBe(temFuturo ? 120.3 : 50.3);
    expect(resumo.saldoPrevisto).toBe(temFuturo ? 395.1 : 325.1);
    expect(resumo.categorias).toEqual([{
      nome: 'Alimentação',
      valor: 20.2
    }]);
    expect(resumo.historico).toHaveLength(6);
    expect(resumo.historico.slice(0, 4).every((m: {
      saldo: number;
    }) => m.saldo === 0)).toBe(true);
  });
  it('protects goal deposits, completes initialized goals and accepts full descriptions', async () => {
    const respostaMeta = await requisicao('/metas', {
      nome: 'Meta completa',
      objetivo: 10,
      atual: 10
    });
    expect(respostaMeta.status).toBe(201);
    const complete = await respostaMeta.json();
    const [[armazenado]] = await admin.query<RowDataPacket[]>('SELECT status FROM metas WHERE id_meta=?', [complete.id]);
    expect(armazenado.status).toBe('concluida');
    const meta = await (await requisicao('/metas', {
      nome: 'Meta aportes',
      objetivo: 100.25
    })).json();
    const [[hoje]] = await admin.query<RowDataPacket[]>("SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS data");
    const corpo = {
      ...conteudo(),
      metaId: meta.id,
      data: hoje.data,
      descricao: 'a'.repeat(255)
    };
    expect((await requisicao('/financeiro/transacoes', {
      ...corpo,
      status: 'Pendente'
    })).status).toBe(400);
    expect((await requisicao('/financeiro/transacoes', {
      ...corpo,
      data: '2099-12-01'
    })).status).toBe(400);
    expect((await requisicao('/financeiro/transacoes', {
      ...corpo,
      valor: 1.001
    })).status).toBe(400);
    const [[before]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM movimentacoes_metas WHERE id_meta=?', [meta.id]);
    expect(before.n).toBe(0);
    expect((await requisicao('/financeiro/transacoes', corpo)).status).toBe(201);
    const [[deposito]] = await admin.query<RowDataPacket[]>('SELECT m.status, mm.descricao, mm.valor FROM metas m JOIN movimentacoes_metas mm USING(id_meta) WHERE id_meta=?', [meta.id]);
    expect(deposito.status).toBe('concluida');
    expect(deposito.descricao).toHaveLength(255);
    expect(Number(deposito.valor)).toBe(100.25);
    expect((await requisicao('/metas', {
      nome: 'Precisão',
      objetivo: 10.001
    })).status).toBe(400);
  });
  it('generates pending monthly occurrences exactly once under concurrency and respects end dates', async () => {
    const original = await (await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      descricao: 'Recorrência mensal teste',
      data: '2024-01-31',
      recorrente: true
    })).json();
    await admin.execute("UPDATE recorrencias SET data_fim='2024-04-30' WHERE id_transacao_origem=?", [original.id]);
    const {
      gerarRecorrencias
    } = await import("./recorrencias");
    await Promise.all([gerarRecorrencias(1), gerarRecorrencias(1)]);
    await gerarRecorrencias(1);
    const [linhas] = await admin.query<RowDataPacket[]>("SELECT DATE_FORMAT(t.data_transacao,'%Y-%m-%d') AS data, s.nome AS status FROM transacoes t JOIN status_transacao s USING(id_status_transacao) WHERE descricao='Recorrência mensal teste' ORDER BY data_transacao");
    expect(linhas.map(r => r.data)).toEqual(['2024-01-31', '2024-02-29', '2024-03-31', '2024-04-30']);
    expect(linhas.slice(1).every(r => r.status === 'Pendente')).toBe(true);
  });
  it('confirms pending entries once, updates balances and protects ownership and future dates', async () => {
    const [[hoje]] = await admin.query<RowDataPacket[]>("SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS data");
    const transacao = await (await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      status: 'Pendente',
      data: hoje.data,
      valor: 25.15
    })).json();
    const confirmar = (id: unknown, autenticacao = token) => fetch(base + '/financeiro/transacoes/' + id + '/confirmar', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + autenticacao
      }
    });
    const before = await (await requisicao('/financeiro/resumo')).json();
    expect((await confirmar(transacao.id, tokenOutroUsuario)).status).toBe(404);
    expect((await confirmar('invalid')).status).toBe(400);
    expect((await fetch(base + '/financeiro/transacoes/' + transacao.id + '/confirmar', {
      method: 'PATCH'
    })).status).toBe(401);
    const listagem = await (await requisicao('/financeiro/transacoes')).json();
    expect(listagem.transacoes.find((t: {
      id: string;
    }) => t.id === String(transacao.id)).podeConfirmar).toBe(true);
    const respostas = await Promise.all([confirmar(transacao.id), confirmar(transacao.id)]);
    expect(respostas.every(r => r.status === 200)).toBe(true);
    const after = await (await requisicao('/financeiro/resumo')).json();
    expect(Math.round((after.saldoDisponivel - before.saldoDisponivel) * 100)).toBe(2515);
    expect(after.saldoPrevisto).toBe(before.saldoPrevisto);
    const futura = await (await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      status: 'Pendente',
      data: '2099-12-01'
    })).json();
    expect((await confirmar(futura.id)).status).toBe(409);
    const cancelada = await (await requisicao('/financeiro/transacoes', {
      ...conteudo(),
      data: hoje.data
    })).json();
    await admin.execute("UPDATE transacoes SET id_status_transacao=(SELECT id_status_transacao FROM status_transacao WHERE nome='Cancelada') WHERE id_transacao=?", [cancelada.id]);
    expect((await confirmar(cancelada.id)).status).toBe(409);
  });
  it('rejects goal names beyond the database field size', async () => {
    expect((await requisicao('/metas', {
      nome: 'a'.repeat(151),
      objetivo: 100
    })).status).toBe(400);
  });
  it('registers multiple users without CPF and validates directly entered birth dates', async () => {
    const signup = (email: string, data = '31/12/2000') => requisicao('/auth/cadastro', {
      nome: 'Cadastro sem documento',
      email,
      dataNascimento: data,
      senha: 'SenhaTeste123',
      confirmarSenha: 'SenhaTeste123'
    });
    expect((await signup('nocpf1@test.invalid')).status).toBe(201);
    expect((await signup('nocpf2@test.invalid', '2000-12-31')).status).toBe(201);
    expect((await signup('nocpf1@test.invalid')).status).toBe(409);
    expect((await signup('invaliddate@test.invalid', '31/02/2000')).status).toBe(400);
    const [usuarios] = await admin.query<RowDataPacket[]>("SELECT cpf, DATE_FORMAT(data_nascimento,'%Y-%m-%d') AS data FROM usuarios WHERE email IN ('nocpf1@test.invalid','nocpf2@test.invalid')");
    expect(usuarios).toHaveLength(2);
    expect(usuarios.every(usuario => usuario.cpf === null && usuario.data === '2000-12-31')).toBe(true);
    const login = await (await requisicao('/auth/login', {
      email: 'nocpf1@test.invalid',
      senha: 'SenhaTeste123'
    })).json();
    const perfil = await (await requisicao('/usuarios/me', undefined, login.token)).json();
    expect(perfil.usuario).not.toHaveProperty('cpf');
    const atualizar = await fetch(base + '/usuarios/me', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + login.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: 'Cadastro atualizado',
        email: 'nocpf1@test.invalid',
        dataNascimento: '29/02/2000'
      })
    });
    expect(atualizar.status).toBe(200);
    const salvo = await requisicao('/financeiro/transacoes', {
      tipo: 'Receita',
      categoria: 'Salário',
      descricao: 'Data digitada',
      valor: '10,00',
      data: '31/12/2025'
    }, login.token);
    expect(salvo.status).toBe(201);
    const transacoes = await (await requisicao('/financeiro/transacoes', undefined, login.token)).json();
    expect(transacoes.transacoes[0].data).toBe('2025-12-31');
  });
});
