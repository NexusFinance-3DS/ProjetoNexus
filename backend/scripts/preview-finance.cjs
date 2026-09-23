// Disposable browser-review fixture. Run from backend after building both apps.
require('dotenv/config');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const dbName = `nexus_preview_${process.pid}_${Date.now()}`;
let admin, pool, api, web;
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  for (const server of [api, web])
    if (server) {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
  if (pool) await pool.end();
  if (admin) {
    if (/^nexus_preview_\d+_\d+$/.test(dbName))
      await admin.query(`DROP DATABASE IF EXISTS ${dbName}`);
    await admin.end();
  }
  process.exit(process.exitCode || 0);
}
async function start() {
  admin = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });
  await admin.query(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await admin.changeUser({ database: dbName });
  const schema = fs
    .readFileSync(path.resolve(__dirname, '../../SQL.txt'), 'utf8')
    .replace(/DROP DATABASE[^;]+;/i, '')
    .replace(/CREATE DATABASE[\s\S]+?;/i, '')
    .replace(/USE nexus_finance;/i, '');
  await admin.query(schema);
  process.env.DB_NAME = dbName;
  const hash = await bcrypt.hash('NexusReview2026!', 10);
  for (const [name, email] of [
    ['Revisão Financeira', 'review@nexus.test'],
    ['Conta Vazia', 'empty@nexus.test'],
  ]) {
    await admin.execute('INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)', [
      name,
      email,
      hash,
    ]);
  }
  await admin.query(
    "INSERT INTO contas (id_usuario,id_tipo_conta,nome,saldo_inicial) VALUES (1,1,'Conta de teste',500)",
  );
  const { createTransaction } = require('../dist/transactions');
  const [[clock]] = await admin.query("SELECT DATE_FORMAT(CURDATE(),'%Y-%m-%d') AS today");
  for (const [offset, income, expense] of [
    [5, 3000, 1800],
    [4, 2500, 2700],
    [2, 4000, 2100],
    [1, 3800, 2400],
    [0, 4200, 1600],
  ]) {
    const date = new Date(clock.today + 'T00:00:00Z');
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() - offset);
    const data = date.toISOString().slice(0, 10);
    await createTransaction(1, {
      tipo: 'Receita',
      categoria: 'Salário',
      descricao: 'Salário de teste',
      valor: income,
      data,
    });
    await createTransaction(1, {
      tipo: 'Despesa',
      categoria: 'Moradia',
      descricao: 'Moradia de teste',
      valor: expense,
      data,
    });
  }
  await createTransaction(1, {
    tipo: 'Despesa',
    categoria: 'Alimentação',
    descricao: 'Mercado de teste',
    valor: 325.4,
    data: clock.today,
  });
  await createTransaction(1, {
    tipo: 'Despesa',
    categoria: 'Serviços',
    descricao: 'Internet pendente',
    valor: 99.9,
    data: clock.today,
    status: 'Pendente',
  });
  await createTransaction(1, {
    tipo: 'Receita',
    categoria: 'Freelance',
    descricao: 'Freelance pendente',
    valor: 600,
    data: clock.today,
    status: 'Pendente',
  });
  await admin.query(
    "INSERT INTO metas (id_usuario,nome,valor_objetivo,data_inicio) VALUES (1,'Reserva de emergência',10000,CURDATE())",
  );
  await admin.query(
    "INSERT INTO movimentacoes_metas (id_meta,tipo,valor,data_movimentacao) VALUES (1,'deposito',2500,CURDATE())",
  );
  pool = require('../dist/database').database;
  api = require('../dist/app').app.listen(3107, '127.0.0.1');
  const site = express();
  site.use(
    express.static(path.resolve(__dirname, '../../NexusFinance/dist'), { extensions: ['html'] }),
  );
  web = site.listen(8082, '127.0.0.1');
  console.log('Preview: http://127.0.0.1:8082 | API: 3107');
  console.log('Test logins: review@nexus.test / empty@nexus.test | Password: NexusReview2026!');
  console.log('Type exit to stop and remove the temporary database.');
  process.stdin.on('data', (chunk) => {
    if (String(chunk).trim() === 'exit') void close();
  });
}
process.on('SIGINT', close);
process.on('SIGTERM', close);
start().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
  await close();
});
