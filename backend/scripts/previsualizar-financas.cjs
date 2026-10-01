// Disposable browser-review fixture. Run from backend after building both apps.
require('dotenv/config');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('node:fs');
const caminho = require('node:path');
const express = require('express');
const nomeBanco = `nexus_preview_${process.pid}_${Date.now()}`;
let admin, pool, api, web;
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  for (const servidor of [api, web]) if (servidor) {
    servidor.closeAllConnections();
    await new Promise(resolve => servidor.close(resolve));
  }
  if (pool) await pool.end();
  if (admin) {
    if (/^nexus_preview_\d+_\d+$/.test(nomeBanco)) await admin.query(`DROP DATABASE IF EXISTS ${nomeBanco}`);
    await admin.end();
  }
  process.exit(process.exitCode || 0);
}
async function iniciar() {
  admin = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });
  await admin.query(`CREATE DATABASE ${nomeBanco} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await admin.changeUser({
    database: nomeBanco
  });
  const estruturaBanco = fs.readFileSync(caminho.resolve(__dirname, '../../SQL.txt'), 'utf8').replace(/DROP DATABASE[^;]+;/i, '').replace(/CREATE DATABASE[\s\S]+?;/i, '').replace(/USE nexus_finance;/i, '');
  await admin.query(estruturaBanco);
  process.env.DB_NAME = nomeBanco;
  const hash = await bcrypt.hash('NexusReview2026!', 10);
  for (const [nome, email] of [['Revisão Financeira', 'review@nexus.test'], ['Conta Vazia', 'empty@nexus.test']]) {
    await admin.execute('INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)', [nome, email, hash]);
  }
  await admin.query("INSERT INTO contas (id_usuario,id_tipo_conta,nome,saldo_inicial) VALUES (1,1,'Conta de teste',500)");
  const {
    criarTransacao
  } = require("../dist/transacoes");
  const [[relogio]] = await admin.query("SELECT DATE_FORMAT(CURDATE(),'%Y-%m-%d') AS today");
  for (const [deslocamento, receita, despesa] of [[5, 3000, 1800], [4, 2500, 2700], [2, 4000, 2100], [1, 3800, 2400], [0, 4200, 1600]]) {
    const dataAuxiliar = new Date(relogio.today + 'T00:00:00Z');
    dataAuxiliar.setUTCDate(1);
    dataAuxiliar.setUTCMonth(dataAuxiliar.getUTCMonth() - deslocamento);
    const dados = dataAuxiliar.toISOString().slice(0, 10);
    await criarTransacao(1, {
      tipo: 'Receita',
      categoria: 'Salário',
      descricao: 'Salário de teste',
      valor: receita,
      data: dados
    });
    await criarTransacao(1, {
      tipo: 'Despesa',
      categoria: 'Moradia',
      descricao: 'Moradia de teste',
      valor: despesa,
      data: dados
    });
  }
  await criarTransacao(1, {
    tipo: 'Despesa',
    categoria: 'Alimentação',
    descricao: 'Mercado de teste',
    valor: 325.4,
    data: relogio.today
  });
  await criarTransacao(1, {
    tipo: 'Despesa',
    categoria: 'Serviços',
    descricao: 'Internet pendente',
    valor: 99.9,
    data: relogio.today,
    status: 'Pendente'
  });
  await criarTransacao(1, {
    tipo: 'Receita',
    categoria: 'Freelance',
    descricao: 'Freelance pendente',
    valor: 600,
    data: relogio.today,
    status: 'Pendente'
  });
  await admin.query("INSERT INTO metas (id_usuario,nome,valor_objetivo,data_inicio) VALUES (1,'Reserva de emergência',10000,CURDATE())");
  await admin.query("INSERT INTO movimentacoes_metas (id_meta,tipo,valor,data_movimentacao) VALUES (1,'deposito',2500,CURDATE())");
  pool = require("../dist/bancoDados").bancoDados;
  api = require("../dist/aplicativo").aplicativo.listen(3107, '127.0.0.1');
  const site = express();
  site.use(express.static(caminho.resolve(__dirname, '../../NexusFinance/dist'), {
    extensions: ['html']
  }));
  web = site.listen(8082, '127.0.0.1');
  console.log('Preview: http://127.0.0.1:8082 | API: 3107');
  console.log('Test logins: review@nexus.test / empty@nexus.test | Password: NexusReview2026!');
  console.log('Type exit to stop and remove the temporary database.');
  process.stdin.on('data', chunk => {
    if (String(chunk).trim() === 'exit') void close();
  });
}
process.on('SIGINT', close);
process.on('SIGTERM', close);
iniciar().catch(async falha => {
  console.error(falha);
  process.exitCode = 1;
  await close();
});
