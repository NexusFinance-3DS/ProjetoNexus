import sqlalchemy as sa
from sqlalchemy import event

from .config import settings
from .models import tables


def make_engine(url):
    engine = sa.create_engine(
        url,
        pool_pre_ping=True,
        **({"isolation_level": "READ COMMITTED"} if not url.startswith("sqlite") else {}),
        connect_args={"check_same_thread": False, "timeout": 30}
        if url.startswith("sqlite")
        else {},
    )
    if engine.dialect.name == "sqlite":

        @event.listens_for(engine, "connect")
        def foreign_keys(connection, _):
            connection.execute("PRAGMA foreign_keys=ON")

    return engine


engine = make_engine(settings.database_url)


def connection():
    with engine.begin() as conn:
        yield conn


SEEDS = {
    "tipos_conta": ["Conta Corrente", "Poupança", "Carteira", "Investimento"],
    "tipos_transacao": ["Receita", "Despesa"],
    "status_transacao": ["Pendente", "Confirmada", "Cancelada"],
    "tipos_notificacao": ["Financeira", "Meta", "Sistema", "Lembrete"],
}


def seed(conn):
    for name, values in SEEDS.items():
        table = tables[name]
        for value in values:
            if conn.execute(sa.select(table).where(table.c.nome == value)).first() is None:
                conn.execute(table.insert().values(nome=value))
    cats = tables["categorias"]
    types = tables["tipos_transacao"]
    for kind, values in {
        "Receita": ["Salário", "Freelance", "Investimentos", "Presentes", "Outros"],
        "Despesa": [
            "Alimentação",
            "Transporte",
            "Moradia",
            "Saúde",
            "Educação",
            "Lazer",
            "Assinaturas",
            "Serviços",
            "Compras",
            "Outros",
        ],
    }.items():
        type_id = conn.execute(
            sa.select(types.c.id_tipo_transacao).where(types.c.nome == kind)
        ).scalar_one()
        for value in values:
            if not conn.execute(
                sa.select(cats.c.id_categoria).where(
                    cats.c.id_usuario.is_(None),
                    cats.c.id_tipo_transacao == type_id,
                    cats.c.nome == value,
                )
            ).first():
                conn.execute(
                    cats.insert().values(
                        nome=value,
                        id_tipo_transacao=type_id,
                        padrao=True,
                        cor="#5145FF",
                        icone="category",
                    )
                )
