import os
import re
import uuid
from contextlib import contextmanager, nullcontext

import sqlalchemy as sa

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["ENVIRONMENT"] = "development"
import pytest
from fastapi.testclient import TestClient

from nexus import db
from nexus.config import settings
from nexus.main import app
from nexus.models import metadata


@pytest.fixture
def client(tmp_path, monkeypatch):
    context = (
        isolated_mysql()
        if os.environ.get("TEST_MYSQL_URL")
        else nullcontext(db.make_engine("sqlite:///" + str(tmp_path / "test.db")))
    )
    engine = context.__enter__()
    monkeypatch.setattr(db, "engine", engine)
    monkeypatch.setattr(settings, "storage_dir", tmp_path / "files")
    metadata.create_all(engine)
    with engine.begin() as conn:
        db.seed(conn)
    with TestClient(app) as client:
        yield client
    engine.dispose()
    context.__exit__(None, None, None)


def register(client, email="ana@example.com"):
    response = client.post(
        "/api/v1/auth/cadastro", json={"nome": "Ana", "email": email, "senha": "SenhaTeste123"}
    )
    assert response.status_code == 201, response.text
    return {"Authorization": "Bearer " + response.json()["access_token"]}


@pytest.fixture
def auth(client):
    return register(client)


@contextmanager
def isolated_mysql():
    url = sa.engine.make_url(os.environ["TEST_MYSQL_URL"])
    if url.host not in ("localhost", "127.0.0.1") or url.port != 3308:
        raise RuntimeError("Teste permitido apenas no servidor local isolado na porta 3308.")
    admin = db.make_engine(url.set(database="mysql").render_as_string(hide_password=False))
    name = "nexus_test_" + uuid.uuid4().hex[:12]
    assert re.fullmatch(r"nexus_test_[a-f0-9]{12}", name)
    with admin.begin() as conn:
        conn.exec_driver_sql(
            "CREATE DATABASE " + name + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
    engine = db.make_engine(url.set(database=name).render_as_string(hide_password=False))
    try:
        yield engine
    finally:
        engine.dispose()
        with admin.begin() as conn:
            conn.exec_driver_sql("DROP DATABASE " + name)
        admin.dispose()
