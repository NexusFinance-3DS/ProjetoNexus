from alembic import command
from alembic.config import Config
from sqlalchemy import inspect, select

from migrations.schema_v1 import metadata
from nexus import db


def test_migration_adopts_existing_tables_and_is_repeatable(tmp_path, monkeypatch):
    engine = db.make_engine("sqlite:///" + str(tmp_path / "original.db"))
    monkeypatch.setattr(db, "engine", engine)
    additions = {"sessoes", "limites_acesso", "ocorrencias_recorrencia"}
    metadata.create_all(
        engine, tables=[x for x in metadata.sorted_tables if x.name not in additions]
    )
    with engine.begin() as conn:
        conn.execute(
            metadata.tables["usuarios"]
            .insert()
            .values(nome="Preservar", email="original@example.com", senha_hash="existing-hash")
        )
    command.upgrade(Config("alembic.ini"), "head")
    command.upgrade(Config("alembic.ini"), "head")
    assert additions <= set(inspect(engine).get_table_names())
    with engine.connect() as conn:
        assert conn.execute(select(metadata.tables["usuarios"].c.nome)).scalar_one() == "Preservar"
        assert len(conn.execute(select(metadata.tables["tipos_conta"])).all()) == 4
    engine.dispose()
