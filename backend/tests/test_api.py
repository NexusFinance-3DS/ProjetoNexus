from datetime import date
from decimal import Decimal
from io import BytesIO
from zipfile import ZipFile

import sqlalchemy as sa
from conftest import register

from nexus import db
from nexus.models import recuperacoes_senha, sessoes
from nexus.services import occurrence_date

BASE = "/api/v1"


def tx_data(client, auth, **changes):
    account = client.get(BASE + "/contas", headers=auth).json()[0]
    category = next(
        c for c in client.get(BASE + "/categorias", headers=auth).json() if c["nome"] == "Salário"
    )
    data = dict(
        id_conta=account["id_conta"],
        id_categoria=category["id_categoria"],
        id_tipo_transacao=1,
        id_status_transacao=2,
        descricao="Salário",
        valor="100.10",
        data_transacao=date.today().isoformat(),
    )
    return dict(data, **changes)


def create_tx(client, auth, **changes):
    res = client.post(BASE + "/transacoes", headers=auth, json=tx_data(client, auth, **changes))
    assert res.status_code == 201, res.text
    return res.json()


def test_auth_sessions_and_private_profile(client, auth):
    assert client.get(BASE + "/contas").status_code == 401
    me = client.get(BASE + "/usuarios/me", headers=auth).json()
    assert "senha_hash" not in me and me["nome"] == "Ana"
    with db.engine.connect() as conn:
        stored = conn.execute(sa.select(sessoes.c.token_hash)).scalar_one()
        assert stored != auth["Authorization"].split()[1]
    assert (
        client.post(
            BASE + "/auth/login", json={"email": "ana@example.com", "senha": "wrong"}
        ).status_code
        == 401
    )
    assert client.post(BASE + "/auth/sair", headers=auth).status_code == 204
    assert client.get(BASE + "/contas", headers=auth).status_code == 401


def test_duplicate_and_invalid_registration(client, auth):
    assert (
        client.post(
            BASE + "/auth/cadastro",
            json={"nome": "Ana", "email": "ana@example.com", "senha": "SenhaTeste123"},
        ).status_code
        == 409
    )
    assert (
        client.post(
            BASE + "/auth/cadastro", json={"nome": "A", "email": "b@example.com", "senha": "short"}
        ).status_code
        == 422
    )
    assert (
        client.post(
            BASE + "/auth/cadastro",
            json={
                "nome": "A",
                "email": "b@example.com",
                "senha": "SenhaTeste123",
                "cpf": "11111111111",
            },
        ).status_code
        == 422
    )


def test_money_status_filters_and_edit(client, auth):
    one = create_tx(client, auth, valor="0.10")
    create_tx(client, auth, valor="0.20")
    create_tx(client, auth, valor="999.00", id_status_transacao=1)
    summary = client.get(BASE + "/resumo", headers=auth).json()
    assert Decimal(str(summary["total_receitas"])) == Decimal("0.30")
    assert Decimal(str(summary["pendentes"])) == 999
    items = client.get(BASE + "/transacoes?limit=1&status=2", headers=auth).json()
    assert items["total"] == 2 and len(items["items"]) == 1
    assert (
        client.put(
            BASE + f"/transacoes/{one['id_transacao']}",
            headers=auth,
            json=tx_data(client, auth, valor="12.50"),
        ).status_code
        == 200
    )
    assert (
        client.delete(BASE + f"/transacoes/{one['id_transacao']}", headers=auth).status_code == 204
    )
    assert Decimal(
        str(client.get(BASE + "/resumo", headers=auth).json()["total_receitas"])
    ) == Decimal("0.20")
    for value in ["-1", "0", "1.001", "NaN", "10000000000.00"]:
        assert (
            client.post(
                BASE + "/transacoes", headers=auth, json=tx_data(client, auth, valor=value)
            ).status_code
            == 422
        )


def test_cross_user_access_and_category_type(client, auth):
    other = register(client, "bruno@example.com")
    tx = create_tx(client, auth)
    assert client.get(BASE + f"/transacoes/{tx['id_transacao']}", headers=other).status_code == 404
    assert (
        client.delete(BASE + f"/transacoes/{tx['id_transacao']}", headers=other).status_code == 404
    )
    assert (
        client.post(BASE + "/transacoes", headers=other, json=tx_data(client, auth)).status_code
        == 404
    )
    assert (
        client.post(
            BASE + "/transacoes", headers=auth, json=tx_data(client, auth, id_tipo_transacao=2)
        ).status_code
        == 422
    )
    shared = client.get(BASE + "/categorias", headers=auth).json()[0]
    assert (
        client.delete(BASE + f"/categorias/{shared['id_categoria']}", headers=auth).status_code
        == 404
    )


def test_goal_deposits_withdrawals_and_ownership(client, auth):
    response = client.post(
        BASE + "/metas",
        headers=auth,
        json={"nome": "Viagem", "valor_objetivo": "100", "valor_inicial": "30"},
    )
    assert response.status_code == 201, response.text
    key = response.json()["id_meta"]
    assert (
        client.post(
            BASE + f"/metas/{key}/movimentacoes",
            headers=auth,
            json={"tipo": "retirada", "valor": "31"},
        ).status_code
        == 422
    )
    assert (
        client.post(
            BASE + f"/metas/{key}/movimentacoes",
            headers=auth,
            json={"tipo": "deposito", "valor": "70"},
        ).status_code
        == 201
    )
    goal = client.get(BASE + f"/metas/{key}", headers=auth).json()
    assert goal["status"] == "concluida" and Decimal(str(goal["valor_atual"])) == 100
    other = register(client, "b@example.com")
    assert (
        client.post(
            BASE + f"/metas/{key}/movimentacoes",
            headers=other,
            json={"tipo": "deposito", "valor": "1"},
        ).status_code
        == 404
    )


def test_recovery_consumes_token_revokes_sessions(client, auth, monkeypatch):
    from nexus import security

    sent = []
    monkeypatch.setattr(security, "send_recovery", lambda email, code: sent.append((email, code)))
    res = client.post(BASE + "/auth/recuperar-senha", json={"email": "ana@example.com"})
    missing = client.post(BASE + "/auth/recuperar-senha", json={"email": "missing@example.com"})
    assert res.json() == missing.json() and "codigo" not in res.json()
    code = sent[0][1]
    with db.engine.connect() as conn:
        assert conn.execute(sa.select(recuperacoes_senha.c.token)).scalar_one() != code
    data = {"email": "ana@example.com", "codigo": code, "senha": "NovaSenhaTeste123"}
    assert client.post(BASE + "/auth/redefinir-senha", json=data).status_code == 204
    assert client.post(BASE + "/auth/redefinir-senha", json=data).status_code == 400
    assert client.get(BASE + "/usuarios/me", headers=auth).status_code == 401
    assert (
        client.post(
            BASE + "/auth/login", json={"email": "ana@example.com", "senha": "NovaSenhaTeste123"}
        ).status_code
        == 200
    )


def test_login_rate_limit_survives_failures(client, auth):
    for _ in range(20):
        assert (
            client.post(
                BASE + "/auth/login", json={"email": "ana@example.com", "senha": "wrong"}
            ).status_code
            == 401
        )
    assert (
        client.post(
            BASE + "/auth/login", json={"email": "ana@example.com", "senha": "SenhaTeste123"}
        ).status_code
        == 429
    )


def test_recurrence_idempotent_and_month_end(client, auth):
    tx = create_tx(client, auth, data_transacao="2024-01-31")
    res = client.post(
        BASE + "/recorrencias",
        headers=auth,
        json={
            "id_transacao_origem": tx["id_transacao"],
            "frequencia": "mensal",
            "data_inicio": "2024-01-31",
            "data_fim": "2024-03-31",
        },
    )
    assert res.status_code == 201, res.text
    assert client.post(BASE + "/recorrencias/processar", headers=auth).json()["criadas"] == 2
    assert client.post(BASE + "/recorrencias/processar", headers=auth).json()["criadas"] == 0
    dates = {
        x["data_transacao"] for x in client.get(BASE + "/transacoes", headers=auth).json()["items"]
    }
    assert {"2024-02-29", "2024-03-31"} <= dates
    assert occurrence_date(date(2024, 2, 29), "anual", 1) == date(2025, 2, 28)


def test_private_attachments_reports_and_backup(client, auth):
    tx = create_tx(client, auth, descricao="=HYPERLINK(evil)")
    res = client.post(
        BASE + f"/transacoes/{tx['id_transacao']}/anexos",
        headers=auth,
        files={"arquivo": ("../teste.pdf", b"%PDF-1.4\ntest", "application/pdf")},
    )
    assert res.status_code == 201, res.text
    key = res.json()["id_anexo"]
    other = register(client, "other@example.com")
    assert client.get(BASE + f"/anexos/{key}/download", headers=other).status_code == 404
    assert client.get(BASE + f"/anexos/{key}/download", headers=auth).content.startswith(b"%PDF")
    assert (
        client.post(
            BASE + f"/transacoes/{tx['id_transacao']}/anexos",
            headers=auth,
            files={"arquivo": ("a.html", b"<script/>", "text/html")},
        ).status_code
        == 415
    )
    today = date.today().isoformat()
    for fmt in ["csv", "xlsx", "pdf"]:
        response = client.post(
            BASE + "/relatorios",
            headers=auth,
            json={"data_inicio": today, "data_fim": today, "formato": fmt},
        )
        assert response.status_code == 201, response.text
        url = BASE + f"/relatorios/{response.json()['id_relatorio']}/download"
        assert client.get(url, headers=other).status_code == 404
        content = client.get(url, headers=auth).content
        if fmt == "csv":
            assert "'=HYPERLINK" in content.decode("utf-8-sig")
        elif fmt == "pdf":
            assert content.startswith(b"%PDF")
        else:
            from openpyxl import load_workbook

            book = load_workbook(BytesIO(content))
            assert book.active["B2"].data_type == "s"
    archive = ZipFile(BytesIO(client.get(BASE + "/backup", headers=auth).content))
    text = archive.read("nexus-dados.json").decode()
    assert "senha_hash" not in text and "token_hash" not in text and "other@example.com" not in text


def test_preferences_notifications_and_address(client, auth):
    create_tx(client, auth)
    notes = client.get(BASE + "/notificacoes", headers=auth).json()
    assert (
        notes
        and client.patch(
            BASE + f"/notificacoes/{notes[0]['id_notificacao']}", headers=auth, json={"lida": True}
        ).json()["lida"]
    )
    assert (
        client.put(
            BASE + "/configuracoes",
            headers=auth,
            json={"notificacoes_ativas": False, "tema": "escuro", "moeda": "BRL"},
        ).status_code
        == 200
    )
    create_tx(client, auth)
    assert len(client.get(BASE + "/notificacoes", headers=auth).json()) == len(notes)
    address = client.post(
        BASE + "/enderecos", headers=auth, json={"logradouro": "Rua A", "estado": "SP"}
    )
    assert address.status_code == 201
    assert (
        client.delete(
            BASE + f"/enderecos/{address.json()['id_endereco']}", headers=auth
        ).status_code
        == 204
    )


def test_mysql_schema_compiles():
    from sqlalchemy.dialects.mysql import dialect
    from sqlalchemy.schema import CreateTable

    from nexus.models import metadata

    ddl = "\n".join(str(CreateTable(t).compile(dialect=dialect())) for t in metadata.sorted_tables)
    assert "DECIMAL" in ddl or "NUMERIC(12, 2)" in ddl
    assert "UNSIGNED" in ddl and "uq_recorrencia_data" in ddl
