"""Schema fiel ao SQL fornecido. Valores financeiros usam DECIMAL, nunca float."""

from datetime import datetime, timezone

import sqlalchemy as sa
from sqlalchemy.dialects import mysql

metadata = sa.MetaData()
tables = {}


def now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


INT = sa.Integer().with_variant(mysql.INTEGER(unsigned=True), "mysql")
BIG = sa.Integer().with_variant(mysql.BIGINT(unsigned=True), "mysql")
SMALL = sa.Integer().with_variant(mysql.TINYINT(unsigned=True), "mysql")
MONEY = sa.Numeric(12, 2)


def col(name, kind, nullable=False, **kw):
    return sa.Column(name, kind, nullable=nullable, **kw)


def fk(name, target, delete="CASCADE", nullable=False, big=False, small=False):
    return sa.Column(
        name,
        BIG if big else SMALL if small else INT,
        sa.ForeignKey(target, ondelete=delete, onupdate="CASCADE"),
        nullable=nullable,
    )


def stamp(name):
    return col(name, sa.DateTime, default=now, server_default=sa.func.current_timestamp())


def updated(name):
    return col(
        name, sa.DateTime, default=now, onupdate=now, server_default=sa.func.current_timestamp()
    )


def flag(name, value=True):
    return col(name, sa.Boolean, default=value, server_default=sa.true() if value else sa.false())


def enum(*values):
    return sa.Enum(*values, native_enum=True, create_constraint=True)


def entity(name, pk, *columns, keytype=INT):
    table = sa.Table(
        name,
        metadata,
        col(pk, keytype, primary_key=True, autoincrement=True),
        *columns,
        mysql_engine="InnoDB",
        mysql_charset="utf8mb4",
    )
    tables[name] = table
    return table


usuarios = entity(
    "usuarios",
    "id_usuario",
    col("nome", sa.String(150)),
    col("email", sa.String(150), unique=True),
    col("senha_hash", sa.String(255)),
    col("cpf", sa.String(14), True, unique=True),
    col("telefone", sa.String(20), True),
    col("data_nascimento", sa.Date, True),
    col("foto_perfil", sa.String(255), True),
    flag("ativo"),
    stamp("criado_em"),
    updated("atualizado_em"),
)
recuperacoes_senha = entity(
    "recuperacoes_senha",
    "id_recuperacao",
    fk("id_usuario", "usuarios.id_usuario"),
    col("token", sa.String(255), unique=True),
    col("expira_em", sa.DateTime),
    flag("utilizado", False),
    stamp("criado_em"),
)
enderecos = entity(
    "enderecos",
    "id_endereco",
    fk("id_usuario", "usuarios.id_usuario"),
    col("cep", sa.String(9), True),
    col("logradouro", sa.String(150), True),
    col("numero", sa.String(20), True),
    col("complemento", sa.String(100), True),
    col("bairro", sa.String(100), True),
    col("cidade", sa.String(100), True),
    col("estado", sa.String(2), True),
)
configuracoes = entity(
    "configuracoes",
    "id_configuracao",
    fk("id_usuario", "usuarios.id_usuario"),
    flag("notificacoes_ativas"),
    col("tema", enum("claro", "escuro", "sistema"), default="escuro", server_default="escuro"),
    col("moeda", sa.String(3), default="BRL", server_default="BRL"),
    updated("atualizado_em"),
    sa.UniqueConstraint("id_usuario", name="uq_configuracoes_usuario"),
)
for name, pk, length in [
    ("tipos_conta", "id_tipo_conta", 50),
    ("tipos_transacao", "id_tipo_transacao", 30),
    ("status_transacao", "id_status_transacao", 50),
    ("tipos_notificacao", "id_tipo_notificacao", 50),
]:
    entity(name, pk, col("nome", sa.String(length), unique=True), keytype=SMALL)
contas = entity(
    "contas",
    "id_conta",
    fk("id_usuario", "usuarios.id_usuario"),
    fk("id_tipo_conta", "tipos_conta.id_tipo_conta", "RESTRICT", small=True),
    col("nome", sa.String(100)),
    col("saldo_inicial", MONEY, default=0, server_default="0.00"),
    flag("ativa"),
    stamp("criado_em"),
    updated("atualizado_em"),
)
categorias = entity(
    "categorias",
    "id_categoria",
    fk("id_usuario", "usuarios.id_usuario", nullable=True),
    fk("id_tipo_transacao", "tipos_transacao.id_tipo_transacao", "RESTRICT", small=True),
    col("nome", sa.String(100)),
    col("icone", sa.String(100), True),
    col("cor", sa.String(20), True),
    flag("padrao", False),
    flag("ativa"),
    stamp("criado_em"),
)
transacoes = entity(
    "transacoes",
    "id_transacao",
    fk("id_usuario", "usuarios.id_usuario"),
    fk("id_conta", "contas.id_conta", "RESTRICT"),
    fk("id_categoria", "categorias.id_categoria", "RESTRICT"),
    fk("id_tipo_transacao", "tipos_transacao.id_tipo_transacao", "RESTRICT", small=True),
    fk("id_status_transacao", "status_transacao.id_status_transacao", "RESTRICT", small=True),
    col("descricao", sa.String(255)),
    col("valor", MONEY),
    col("data_transacao", sa.Date),
    col("observacao", sa.Text, True),
    stamp("criada_em"),
    updated("atualizada_em"),
    sa.CheckConstraint("valor > 0", name="chk_transacoes_valor"),
    keytype=BIG,
)
for suffix, columns in [
    ("usuario", ["id_usuario"]),
    ("conta", ["id_conta"]),
    ("categoria", ["id_categoria"]),
    ("data", ["data_transacao"]),
    ("usuario_data", ["id_usuario", "data_transacao"]),
]:
    sa.Index("idx_transacoes_" + suffix, *(transacoes.c[c] for c in columns))
anexos_transacao = entity(
    "anexos_transacao",
    "id_anexo",
    fk("id_transacao", "transacoes.id_transacao", big=True),
    col("nome_arquivo", sa.String(255)),
    col("caminho_arquivo", sa.String(500)),
    col("tipo_arquivo", sa.String(100), True),
    col("tamanho_arquivo", BIG, True),
    stamp("criado_em"),
)
recorrencias = entity(
    "recorrencias",
    "id_recorrencia",
    fk("id_usuario", "usuarios.id_usuario"),
    fk("id_transacao_origem", "transacoes.id_transacao", big=True),
    col("frequencia", enum("diaria", "semanal", "mensal", "anual")),
    col("data_inicio", sa.Date),
    col("data_fim", sa.Date, True),
    flag("ativa"),
    stamp("criado_em"),
)
metas = entity(
    "metas",
    "id_meta",
    fk("id_usuario", "usuarios.id_usuario"),
    col("nome", sa.String(150)),
    col("descricao", sa.Text, True),
    col("valor_objetivo", MONEY),
    col("data_inicio", sa.Date),
    col("data_prazo", sa.Date, True),
    col(
        "status",
        enum("em_andamento", "concluida", "cancelada"),
        default="em_andamento",
        server_default="em_andamento",
    ),
    stamp("criada_em"),
    updated("atualizada_em"),
    sa.CheckConstraint("valor_objetivo > 0", name="chk_metas_valor"),
)
movimentacoes_metas = entity(
    "movimentacoes_metas",
    "id_movimentacao_meta",
    fk("id_meta", "metas.id_meta"),
    fk("id_transacao", "transacoes.id_transacao", "SET NULL", nullable=True, big=True),
    col("tipo", enum("deposito", "retirada")),
    col("valor", MONEY),
    col("data_movimentacao", sa.Date),
    col("descricao", sa.String(255), True),
    stamp("criado_em"),
    sa.CheckConstraint("valor > 0", name="chk_movimentacoes_meta_valor"),
    keytype=BIG,
)
notificacoes = entity(
    "notificacoes",
    "id_notificacao",
    fk("id_usuario", "usuarios.id_usuario"),
    fk("id_tipo_notificacao", "tipos_notificacao.id_tipo_notificacao", "RESTRICT", small=True),
    col("titulo", sa.String(150)),
    col("descricao", sa.Text),
    flag("lida", False),
    stamp("criado_em"),
    keytype=BIG,
)
relatorios_gerados = entity(
    "relatorios_gerados",
    "id_relatorio",
    fk("id_usuario", "usuarios.id_usuario"),
    col("tipo", sa.String(100)),
    col("data_inicio", sa.Date),
    col("data_fim", sa.Date),
    col("formato", enum("pdf", "csv", "xlsx")),
    col("caminho_arquivo", sa.String(500), True),
    stamp("criado_em"),
    sa.CheckConstraint("data_fim >= data_inicio", name="chk_relatorios_periodo"),
    keytype=BIG,
)

# Acréscimos sem modificar ou apagar tabelas existentes.
sessoes = entity(
    "sessoes",
    "id_sessao",
    fk("id_usuario", "usuarios.id_usuario"),
    col("token_hash", sa.String(64), unique=True),
    col("expira_em", sa.DateTime),
    stamp("criado_em"),
)
limites_acesso = sa.Table(
    "limites_acesso",
    metadata,
    col("chave", sa.String(64), primary_key=True),
    col("inicio", sa.DateTime),
    col("tentativas", sa.Integer),
    mysql_engine="InnoDB",
)
ocorrencias_recorrencia = entity(
    "ocorrencias_recorrencia",
    "id_ocorrencia",
    fk("id_recorrencia", "recorrencias.id_recorrencia"),
    col("data_prevista", sa.Date),
    fk("id_transacao", "transacoes.id_transacao", "SET NULL", nullable=True, big=True),
    sa.UniqueConstraint("id_recorrencia", "data_prevista", name="uq_recorrencia_data"),
    keytype=BIG,
)
