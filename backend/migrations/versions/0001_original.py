"""Adota o SQL original ou cria o mesmo schema em uma instalação nova."""

from alembic import op

from migrations.schema_v1 import metadata

revision = "0001_original"
down_revision = None


def upgrade():
    # Não executa DROP; checkfirst preserva instalações que já importaram SQL.txt.
    names = {"sessoes", "limites_acesso", "ocorrencias_recorrencia"}
    metadata.create_all(
        op.get_bind(),
        tables=[t for t in metadata.sorted_tables if t.name not in names],
        checkfirst=True,
    )


def downgrade():
    raise RuntimeError("Downgrade destrutivo desabilitado; restaure um backup explicitamente.")
