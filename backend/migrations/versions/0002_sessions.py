"""Sessões revogáveis, limites de tentativas e deduplicação das recorrências."""

from alembic import op

from migrations.schema_v1 import metadata
from nexus.db import seed

revision = "0002_sessions"
down_revision = "0001_original"


def upgrade():
    metadata.create_all(
        op.get_bind(),
        tables=[
            metadata.tables[n] for n in ("sessoes", "limites_acesso", "ocorrencias_recorrencia")
        ],
        checkfirst=True,
    )
    seed(op.get_bind())


def downgrade():
    raise RuntimeError("Downgrade destrutivo desabilitado; restaure um backup explicitamente.")
