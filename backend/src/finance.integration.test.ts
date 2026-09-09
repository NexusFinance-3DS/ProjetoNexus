import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mysql, { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { readFile, mkdtemp, readdir, unlink, rmdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { Server } from "node:http";

// Opt in explicitly: this suite creates and drops only its own isolated database.
describe.skipIf(process.env.NEXUS_MYSQL_TEST !== "1")("finance API with real MySQL and files", () => {
  const dbName = `nexus_test_${process.pid}_${Date.now()}`;
  let admin: Connection;
  let server: Server;
  let closePool: () => Promise<void>;
  let uploadDir: string;
  let base: string;
  let token: string;
  let otherToken: string;
  let ownCategory: string;
  let expenseCategory: string;
  let accountType: string;

  beforeAll(async () => {
    admin = await mysql.createConnection({ host: "127.0.0.1", port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || "root", password: process.env.DB_PASSWORD || "", multipleStatements: true });
    if (!/^nexus_test_\d+_\d+$/.test(dbName)) throw new Error("Invalid test database name");
    await admin.query(`CREATE DATABASE ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await admin.changeUser({ database: dbName });
    const schema = (await readFile(path.resolve(__dirname, "../../SQL.txt"), "utf8")).replace(/DROP DATABASE[^;]+;/i, "").replace(/CREATE DATABASE[\s\S]+?;/i, "").replace(/USE nexus_finance;/i, "");
    await admin.query(schema);
    const [one] = await admin.execute<ResultSetHeader>("INSERT INTO usuarios (nome, email, senha_hash) VALUES ('Teste', 'one@test.invalid', 'test')");
    const [two] = await admin.execute<ResultSetHeader>("INSERT INTO usuarios (nome, email, senha_hash) VALUES ('Outro', 'two@test.invalid', 'test')");
    process.env.DB_HOST = "127.0.0.1";
    process.env.DB_NAME = dbName;
    uploadDir = await mkdtemp(path.join(os.tmpdir(), "nexus-upload-test-"));
    process.env.UPLOAD_DIR = uploadDir;
    const { database } = await import("./database");
    closePool = () => database.end();
    const { app } = await import("./app");
    const { createToken } = await import("./auth");
    token = createToken(one.insertId);
    otherToken = createToken(two.insertId);
    server = await new Promise<Server>((resolve) => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
    base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  }, 30000);

  afterAll(async () => {
    if (server) await new Promise<void>((resolve) => { server.close(() => resolve()); server.closeAllConnections(); });
    if (closePool) await closePool();
    if (admin) {
      if (/^nexus_test_\d+_\d+$/.test(dbName)) await admin.query(`DROP DATABASE IF EXISTS ${dbName}`);
      await admin.end();
    }
    if (uploadDir && path.dirname(uploadDir) === path.resolve(os.tmpdir()) && path.basename(uploadDir).startsWith("nexus-upload-test-")) {
      for (const file of await readdir(uploadDir)) await unlink(path.join(uploadDir, file));
      await rmdir(uploadDir);
    }
  });

  const request = (route: string, body?: unknown, auth = token) => fetch(base + route, { method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${auth}`, ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }) }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined });
  const payload = () => ({ tipo: "Receita", valor: "100,25", descricao: "Serviço de teste", data: "2026-09-08", categoriaId: ownCategory, tipoContaId: accountType, recorrente: false });

  it("requires authentication and returns database options filtered by transaction type", async () => {
    expect((await fetch(base + "/financeiro/opcoes?tipo=Receita")).status).toBe(401);
    const response = await request("/financeiro/opcoes?tipo=Receita");
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.categorias.some((c: { nome: string }) => c.nome === "Salário")).toBe(true);
    expect(data.categorias.some((c: { nome: string }) => c.nome === "Alimentação")).toBe(false);
    accountType = data.tiposConta.find((c: { nome: string }) => c.nome === "Poupança").id;
    expenseCategory = (await (await request("/financeiro/opcoes?tipo=Despesa")).json()).categorias[0].id;
  });

  it("persists a new category, reuses duplicates, and keeps it private", async () => {
    const responses = await Promise.all([request("/financeiro/categorias", { tipo: "Receita", nome: "Consultoria" }), request("/financeiro/categorias", { tipo: "Receita", nome: " Consultoria " })]);
    const data = await Promise.all(responses.map((r) => r.json()));
    expect(data[0].categoria.id).toBe(data[1].categoria.id);
    ownCategory = data[0].categoria.id;
    const [stored] = await admin.query<RowDataPacket[]>("SELECT id_usuario FROM categorias WHERE nome = 'Consultoria'");
    expect(stored).toHaveLength(1);
    expect(stored[0].id_usuario).toBe(1);
    const mine = await (await request("/financeiro/opcoes?tipo=Receita")).json();
    const other = await (await request("/financeiro/opcoes?tipo=Receita", undefined, otherToken)).json();
    expect(mine.categorias.some((c: { id: string }) => c.id === ownCategory)).toBe(true);
    expect(other.categorias.some((c: { id: string }) => c.id === ownCategory)).toBe(false);
  });

  it("rejects categories belonging to someone else or to the wrong type, and invalid account types", async () => {
    expect((await request("/financeiro/transacoes", payload(), otherToken)).status).toBe(400);
    expect((await request("/financeiro/transacoes", { ...payload(), categoriaId: expenseCategory })).status).toBe(400);
    expect((await request("/financeiro/transacoes", { ...payload(), tipoContaId: "99999" })).status).toBe(400);
    const [[row]] = await admin.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM transacoes");
    expect(row.n).toBe(0);
  });

  it("saves selected account type and category without an attachment", async () => {
    const response = await request("/financeiro/transacoes", payload());
    expect(response.status).toBe(201);
    const [[row]] = await admin.query<RowDataPacket[]>("SELECT tc.nome AS tipo, t.id_categoria, t.valor FROM transacoes t JOIN contas c ON c.id_conta=t.id_conta JOIN tipos_conta tc ON tc.id_tipo_conta=c.id_tipo_conta");
    expect(row.tipo).toBe("Poupança");
    expect(String(row.id_categoria)).toBe(ownCategory);
    expect(Number(row.valor)).toBe(100.25);
    const [[count]] = await admin.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM recorrencias");
    expect(count.n).toBe(0);
  });

  it("persists multipart bytes and recurrence, lists the attachment and protects downloads", async () => {
    const form = new FormData();
    Object.entries({ ...payload(), recorrente: true }).forEach(([k, v]) => form.append(k, String(v)));
    form.append("arquivo", new Blob(["comprovante de teste"], { type: "text/plain" }), "comprovante-ação.txt");
    const response = await request("/financeiro/transacoes", form);
    expect(response.status).toBe(201);
    const saved = await response.json();
    const [[attachment]] = await admin.query<RowDataPacket[]>("SELECT * FROM anexos_transacao WHERE id_anexo = ?", [saved.anexoId]);
    expect(await readFile(path.join(uploadDir, attachment.caminho_arquivo), "utf8")).toBe("comprovante de teste");
    const [[count]] = await admin.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM recorrencias WHERE id_transacao_origem = ?", [saved.id]);
    expect(count.n).toBe(1);
    const listing = await (await request("/financeiro/transacoes")).json();
    expect(listing.transacoes.find((t: { id: string }) => t.id === String(saved.id)).anexos[0].nome).toBe("comprovante-ação.txt");
    const download = await request(`/financeiro/anexos/${saved.anexoId}`);
    expect(download.status).toBe(200);
    expect(await download.text()).toBe("comprovante de teste");
    expect((await request(`/financeiro/anexos/${saved.anexoId}`, undefined, otherToken)).status).toBe(404);
    expect((await fetch(base + `/financeiro/anexos/${saved.anexoId}`)).status).toBe(401);
  });

  it("rejects empty/oversized files and impossible dates without creating a transaction", async () => {
    for (const bytes of [0, 10 * 1024 * 1024 + 1]) {
      const form = new FormData();
      Object.entries(payload()).forEach(([k, v]) => form.append(k, String(v)));
      form.append("arquivo", new Blob([new Uint8Array(bytes)]), "test.bin");
      expect((await request("/financeiro/transacoes", form)).status).toBe(400);
    }
    expect((await request("/financeiro/transacoes", { ...payload(), data: "2026-02-30" })).status).toBe(400);
    const [[count]] = await admin.query<RowDataPacket[]>("SELECT COUNT(*) AS n FROM transacoes");
    expect(count.n).toBe(2);
  });

  it("rolls back both the transaction and file when a later database insert fails", async () => {
    const filesBefore = await readdir(uploadDir);
    await admin.query("CREATE TRIGGER test_notification_failure BEFORE INSERT ON notificacoes FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Test rollback'");
    try {
      const form = new FormData();
      Object.entries(payload()).forEach(([k, v]) => form.append(k, String(v)));
      form.append('arquivo', new Blob(['rollback']), 'rollback.txt');
      expect((await request('/financeiro/transacoes', form)).status).toBe(500);
      expect(await readdir(uploadDir)).toEqual(filesBefore);
      const [[count]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM transacoes');
      expect(count.n).toBe(2);
    } finally { await admin.query('DROP TRIGGER test_notification_failure'); }
  });

  it("persists notification preferences per user and honors them when saving", async () => {
    const update = await fetch(base + '/configuracoes', { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ notificacoes: false }) });
    expect(update.status).toBe(200);
    expect((await (await request('/configuracoes')).json()).notificacoes).toBe(false);
    expect((await (await request('/configuracoes', undefined, otherToken)).json()).notificacoes).toBe(true);
    const [[before]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM notificacoes');
    expect((await request('/financeiro/transacoes', payload())).status).toBe(201);
    const [[after]] = await admin.query<RowDataPacket[]>('SELECT COUNT(*) AS n FROM notificacoes');
    expect(after.n).toBe(before.n);
  });

  it("keeps future months out of the six-month financial report", async () => {
    expect((await request('/financeiro/transacoes', { ...payload(), data: '2099-12-01' })).status).toBe(201);
    const summary = await (await request('/financeiro/resumo')).json();
    expect(summary.historico.some((m: { periodo: string }) => m.periodo === '2099-12')).toBe(false);
  });

  it('persists the theme per account and preserves independently updated preferences', async () => {
    const update = (body: unknown) => fetch(base + '/configuracoes', { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    expect((await update({ tema: 'claro' })).status).toBe(200);
    expect(await (await request('/configuracoes')).json()).toEqual({ tema: 'claro', notificacoes: false });
    expect(await (await request('/configuracoes', undefined, otherToken)).json()).toEqual({ tema: 'escuro', notificacoes: true });
    const results = await Promise.all([update({ tema: 'escuro' }), update({ notificacoes: true })]);
    expect(results.every((r) => r.status === 200)).toBe(true);
    expect(await (await request('/configuracoes')).json()).toEqual({ tema: 'escuro', notificacoes: true });
    const [[row]] = await admin.query<RowDataPacket[]>('SELECT tema FROM configuracoes WHERE id_usuario = 1');
    expect(row.tema).toBe('escuro');
  });

  it('rejects invalid themes without overwriting the existing settings', async () => {
    for (const body of [{ tema: 'invalid' }, { tema: null }, { notificacoes: 'false', tema: 'claro' }, {}]) {
      const response = await fetch(base + '/configuracoes', { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      expect(response.status).toBe(400);
    }
    expect(await (await request('/configuracoes')).json()).toEqual({ tema: 'escuro', notificacoes: true });
  });
});
