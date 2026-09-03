from alembic import context

from nexus.db import engine
from nexus.models import metadata

if context.is_offline_mode():
    raise RuntimeError(
        "Execute a migração online para reconhecer tabelas existentes com segurança."
    )
with engine.connect() as connection:
    context.configure(connection=connection, target_metadata=metadata, compare_type=True)
    with context.begin_transaction():
        context.run_migrations()
