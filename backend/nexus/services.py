from calendar import monthrange
from datetime import date, timedelta
from decimal import Decimal

import sqlalchemy as sa
from fastapi import HTTPException

from .clock import today
from .models import (
    categorias,
    contas,
    metas,
    movimentacoes_metas,
    notificacoes,
    ocorrencias_recorrencia,
    recorrencias,
    transacoes,
)
from .models import tables as T

ZERO = Decimal("0.00")


def row(conn, table, key):
    return (
        conn.execute(sa.select(table).where(list(table.primary_key)[0] == key)).mappings().first()
    )


def own(conn, table, key, user_id, lock=False):
    query = sa.select(table).where(list(table.primary_key)[0] == key, table.c.id_usuario == user_id)
    if lock:
        query = query.with_for_update()
    found = conn.execute(query).mappings().first()
    if not found:
        raise HTTPException(404, "Registro não encontrado.")
    return found


def lookup(conn, name, value):
    table = T[name]
    found = conn.execute(sa.select(table).where(table.c.nome == value)).mappings().first()
    if not found:
        raise HTTPException(503, "Execute as migrações do banco.")
    return found[list(table.primary_key)[0].name]


def valid_fk(conn, name, key):
    if not row(conn, T[name], key):
        raise HTTPException(422, "Referência inválida: " + name)


def notify(conn, user_id, title, description, kind="Financeira"):
    prefs = T["configuracoes"]
    enabled = conn.execute(
        sa.select(prefs.c.notificacoes_ativas).where(prefs.c.id_usuario == user_id)
    ).scalar()
    if enabled is False:
        return
    conn.execute(
        notificacoes.insert().values(
            id_usuario=user_id,
            id_tipo_notificacao=lookup(conn, "tipos_notificacao", kind),
            titulo=title,
            descricao=description,
        )
    )


def validate_transaction(conn, data, user_id):
    account = own(conn, contas, data["id_conta"], user_id)
    if not account["ativa"]:
        raise HTTPException(422, "Conta arquivada.")
    category = row(conn, categorias, data["id_categoria"])
    if not category or category["id_usuario"] not in (None, user_id) or not category["ativa"]:
        raise HTTPException(422, "Categoria indisponível.")
    if category["id_tipo_transacao"] != data["id_tipo_transacao"]:
        raise HTTPException(422, "Categoria incompatível com o tipo de transação.")
    valid_fk(conn, "tipos_transacao", data["id_tipo_transacao"])
    valid_fk(conn, "status_transacao", data["id_status_transacao"])


def tx_query(user_id):
    kinds = T["tipos_transacao"]
    states = T["status_transacao"]
    return (
        sa.select(
            transacoes,
            contas.c.nome.label("conta"),
            categorias.c.nome.label("categoria"),
            categorias.c.cor.label("cor"),
            kinds.c.nome.label("tipo"),
            states.c.nome.label("status"),
        )
        .join(contas, transacoes.c.id_conta == contas.c.id_conta)
        .join(categorias, transacoes.c.id_categoria == categorias.c.id_categoria)
        .join(kinds, transacoes.c.id_tipo_transacao == kinds.c.id_tipo_transacao)
        .join(states, transacoes.c.id_status_transacao == states.c.id_status_transacao)
        .where(transacoes.c.id_usuario == user_id)
    )


def transaction_rows(conn, user_id, start=None, end=None):
    q = tx_query(user_id)
    if start:
        q = q.where(transacoes.c.data_transacao >= start)
    if end:
        q = q.where(transacoes.c.data_transacao <= end)
    return [
        dict(x)
        for x in conn.execute(
            q.order_by(transacoes.c.data_transacao.desc(), transacoes.c.id_transacao.desc())
        ).mappings()
    ]


def goal_balance(conn, key):
    delta = sa.case(
        (movimentacoes_metas.c.tipo == "deposito", movimentacoes_metas.c.valor),
        else_=-movimentacoes_metas.c.valor,
    )
    return conn.execute(
        sa.select(sa.func.coalesce(sa.func.sum(delta), 0)).where(
            movimentacoes_metas.c.id_meta == key
        )
    ).scalar_one()


def goal_view(conn, goal):
    result = dict(goal)
    balance = goal_balance(conn, goal["id_meta"])
    result["valor_atual"] = balance
    result["percentual"] = min(Decimal("100"), balance / goal["valor_objetivo"] * 100)
    return result


def sync_goal(conn, key):
    current = row(conn, metas, key)
    if current["status"] == "cancelada":
        return
    status = "concluida" if goal_balance(conn, key) >= current["valor_objetivo"] else "em_andamento"
    conn.execute(metas.update().where(metas.c.id_meta == key).values(status=status))


def add_movement(conn, key, data, user_id):
    goal = own(conn, metas, key, user_id, lock=True)
    if goal["status"] == "cancelada":
        raise HTTPException(409, "Meta cancelada.")
    if data.get("id_transacao"):
        own(conn, transacoes, data["id_transacao"], user_id)
    if data["tipo"] == "retirada" and data["valor"] > goal_balance(conn, key):
        raise HTTPException(422, "Retirada maior que o saldo da meta.")
    result = conn.execute(movimentacoes_metas.insert().values(id_meta=key, **data))
    sync_goal(conn, key)
    notify(
        conn,
        user_id,
        "Meta atualizada",
        "Sua meta " + goal["nome"] + " recebeu uma movimentação.",
        "Meta",
    )
    return row(conn, movimentacoes_metas, result.inserted_primary_key[0])


def summary(conn, user_id, start, end):
    if end < start:
        raise HTTPException(422, "Período inválido.")
    if (end - start).days > 3660:
        raise HTTPException(422, "Período máximo de 10 anos.")
    entries = transaction_rows(conn, user_id, start, end)
    confirmed = [x for x in entries if x["status"] == "Confirmada"]
    income = sum((x["valor"] for x in confirmed if x["tipo"] == "Receita"), ZERO)
    expense = sum((x["valor"] for x in confirmed if x["tipo"] == "Despesa"), ZERO)
    # Saldo inclui saldos iniciais e todo o histórico confirmado até o fim do período.
    opening = conn.execute(
        sa.select(sa.func.coalesce(sa.func.sum(contas.c.saldo_inicial), 0)).where(
            contas.c.id_usuario == user_id
        )
    ).scalar_one()
    historical = transaction_rows(conn, user_id, end=end)
    balance = opening + sum(
        (
            x["valor"] if x["tipo"] == "Receita" else -x["valor"]
            for x in historical
            if x["status"] == "Confirmada"
        ),
        ZERO,
    )
    groups = {}
    evolution = {}
    for x in confirmed:
        month = x["data_transacao"].strftime("%Y-%m")
        bucket = evolution.setdefault(month, {"mes": month, "receitas": ZERO, "despesas": ZERO})
        bucket["receitas" if x["tipo"] == "Receita" else "despesas"] += x["valor"]
        if x["tipo"] == "Despesa":
            group = groups.setdefault(
                x["id_categoria"],
                {
                    "id_categoria": x["id_categoria"],
                    "nome": x["categoria"],
                    "cor": x["cor"] or "#5145FF",
                    "valor": ZERO,
                },
            )
            group["valor"] += x["valor"]
    return {
        "data_inicio": start,
        "data_fim": end,
        "total_receitas": income,
        "total_despesas": expense,
        "saldo": balance,
        "economia": income - expense,
        "pendentes": sum((x["valor"] for x in entries if x["status"] == "Pendente"), ZERO),
        "categorias": list(groups.values()),
        "evolucao": [evolution[k] for k in sorted(evolution)],
        "quantidade": len(entries),
    }


def occurrence_date(anchor, frequency, index):
    if frequency == "diaria":
        return anchor + timedelta(days=index)
    if frequency == "semanal":
        return anchor + timedelta(weeks=index)
    months = index * (12 if frequency == "anual" else 1)
    year = anchor.year + (anchor.month - 1 + months) // 12
    month = (anchor.month - 1 + months) % 12 + 1
    return date(year, month, min(anchor.day, monthrange(year, month)[1]))


def process_recurrences(conn, user_id, until=None):
    until = min(until or today(), today())
    created = 0
    # Locks prevent two workers creating the same occurrence. Unique index is an additional guard.
    rules = (
        conn.execute(
            sa.select(recorrencias)
            .where(recorrencias.c.id_usuario == user_id, recorrencias.c.ativa.is_(True))
            .with_for_update()
        )
        .mappings()
        .all()
    )
    for rule in rules:
        origin = own(conn, transacoes, rule["id_transacao_origem"], user_id)
        account = own(conn, contas, origin["id_conta"], user_id)
        category = row(conn, categorias, origin["id_categoria"])
        if not account["ativa"] or not category["ativa"]:
            continue
        stop = min(until, rule["data_fim"] or until)
        for index in range(10000):
            due = occurrence_date(rule["data_inicio"], rule["frequencia"], index)
            if due > stop:
                break
            if due <= origin["data_transacao"]:
                continue
            exists = conn.execute(
                sa.select(ocorrencias_recorrencia.c.id_ocorrencia).where(
                    ocorrencias_recorrencia.c.id_recorrencia == rule["id_recorrencia"],
                    ocorrencias_recorrencia.c.data_prevista == due,
                )
            ).first()
            if exists:
                continue
            if created >= 500:
                return created
            values = {
                key: origin[key]
                for key in (
                    "id_usuario",
                    "id_conta",
                    "id_categoria",
                    "id_tipo_transacao",
                    "descricao",
                    "valor",
                    "observacao",
                )
            }
            values.update(
                data_transacao=due, id_status_transacao=lookup(conn, "status_transacao", "Pendente")
            )
            tx_id = conn.execute(transacoes.insert().values(**values)).inserted_primary_key[0]
            conn.execute(
                ocorrencias_recorrencia.insert().values(
                    id_recorrencia=rule["id_recorrencia"], data_prevista=due, id_transacao=tx_id
                )
            )
            created += 1
    if created:
        notify(
            conn,
            user_id,
            "Lançamentos recorrentes",
            str(created) + " lançamentos pendentes foram criados.",
            "Lembrete",
        )
    return created
