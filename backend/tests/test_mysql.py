import os
import re
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pytest
import sqlalchemy as sa
from alembic import command
from alembic.config import Config
from conftest import isolated_mysql

from nexus import db
from nexus.models import tables as T

pytestmark = pytest.mark.skipif(
    not os.environ.get("TEST_MYSQL_URL"), reason="Banco MySQL/MariaDB de teste não configurado."
)


def test_original_mysql_sql_adoption(monkeypatch):
    with isolated_mysql() as engine:
        sql = Path("database/original.sql").read_text(encoding="utf-8-sig")
        sql = re.sub(r"--[^\n]*", "", sql)
        with engine.begin() as conn:
            for statement in sql.split(";"):
                statement = statement.strip()
                if re.match(r"^(CREATE TABLE|CREATE INDEX|INSERT INTO)\b", statement, re.I):
                    conn.exec_driver_sql(statement)
            conn.execute(
                T["usuarios"]
                .insert()
                .values(nome="Original", email="old@example.com", senha_hash="preserved")
            )
        monkeypatch.setattr(db, "engine", engine)
        command.upgrade(Config("alembic.ini"), "head")
        command.upgrade(Config("alembic.ini"), "head")
        with engine.connect() as conn:
            assert conn.execute(sa.select(T["usuarios"].c.senha_hash)).scalar_one() == "preserved"
            assert len(conn.execute(sa.select(T["categorias"])).all()) == 15


def test_concurrent_goal_withdrawals(client, auth):
    goal = client.post(
        "/api/v1/metas",
        headers=auth,
        json={"nome": "Reserva", "valor_objetivo": "500", "valor_inicial": "100"},
    ).json()

    def withdraw(_):
        return client.post(
            f"/api/v1/metas/{goal['id_meta']}/movimentacoes",
            headers=auth,
            json={"tipo": "retirada", "valor": "70"},
        ).status_code

    with ThreadPoolExecutor(max_workers=2) as pool:
        codes = sorted(pool.map(withdraw, range(2)))
    assert codes == [201, 422]
    result = client.get(f"/api/v1/metas/{goal['id_meta']}", headers=auth).json()
    assert result["valor_atual"] == "30.00"


def test_decimal_serialization(client, auth):
    result = client.get("/api/v1/resumo", headers=auth).json()
    assert isinstance(result["saldo"], str)
