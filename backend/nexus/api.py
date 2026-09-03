import io
import json
import secrets
import zipfile
from datetime import date, timedelta
from decimal import Decimal
from pathlib import Path

import sqlalchemy as sa
from fastapi import APIRouter, Depends, File, HTTPException, Query, Request, Response, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import FileResponse

from . import db, reports
from . import schemas as S
from . import security as sec
from . import services as svc
from .clock import today
from .config import settings
from .models import now, recuperacoes_senha, sessoes
from .models import tables as T

router = APIRouter(prefix="/api/v1")
Conn = Depends(db.connection)
User = Depends(sec.current_user)


def uid(user):
    return user["id_usuario"]


def values(data):
    return data.model_dump()


def insert(conn, table, data):
    key = conn.execute(table.insert().values(**data)).inserted_primary_key[0]
    return svc.row(conn, table, key)


def owned(conn, name, key, user, lock=False):
    return svc.own(conn, T[name], key, uid(user), lock)


def account_view(conn, row):
    result = dict(row)
    tx = T["transacoes"]
    income = svc.lookup(conn, "tipos_transacao", "Receita")
    confirmed = svc.lookup(conn, "status_transacao", "Confirmada")
    delta = sa.case((tx.c.id_tipo_transacao == income, tx.c.valor), else_=-tx.c.valor)
    total = conn.execute(
        sa.select(sa.func.coalesce(sa.func.sum(delta), 0)).where(
            tx.c.id_conta == row["id_conta"], tx.c.id_status_transacao == confirmed
        )
    ).scalar_one()
    result["saldo_atual"] = row["saldo_inicial"] + total
    return result


@router.post("/auth/cadastro", status_code=201, tags=["Autenticação"])
def register(data: S.Register, request: Request, conn=Conn):
    sec.limit(request, "register", 10)
    user = insert(
        conn,
        T["usuarios"],
        {
            **data.model_dump(exclude={"senha"}),
            "email": str(data.email).lower(),
            "senha_hash": sec.password_hash.hash(data.senha),
        },
    )
    insert(conn, T["configuracoes"], {"id_usuario": uid(user)})
    insert(
        conn,
        T["contas"],
        {
            "id_usuario": uid(user),
            "id_tipo_conta": svc.lookup(conn, "tipos_conta", "Conta Corrente"),
            "nome": "Conta Corrente",
        },
    )
    return sec.create_session(conn, user)


@router.post("/auth/login", tags=["Autenticação"])
def login(data: S.Login, request: Request, conn=Conn):
    sec.limit(request, "login")
    user = (
        conn.execute(
            sa.select(T["usuarios"]).where(T["usuarios"].c.email == str(data.email).lower())
        )
        .mappings()
        .first()
    )
    valid = sec.verify(data.senha, user["senha_hash"] if user else sec.DUMMY_HASH)
    if not user or not valid or not user["ativo"]:
        raise HTTPException(401, "Email ou senha inválidos.")
    return sec.create_session(conn, user)


@router.post("/auth/sair", status_code=204, tags=["Autenticação"])
def logout(user=User, credentials=Depends(sec.bearer), conn=Conn):
    conn.execute(
        sessoes.delete().where(sessoes.c.token_hash == sec.digest(credentials.credentials))
    )


@router.post("/auth/recuperar-senha", status_code=202, tags=["Autenticação"])
def forgot(data: S.Forgot, request: Request, conn=Conn):
    sec.limit(request, "forgot", 5)
    # Production must have a delivery channel configured; no token is returned by this endpoint.
    if not settings.smtp_host and settings.environment != "development":
        raise HTTPException(503, "Recuperação temporariamente indisponível.")
    user = (
        conn.execute(
            sa.select(T["usuarios"]).where(
                T["usuarios"].c.email == str(data.email).lower(), T["usuarios"].c.ativo.is_(True)
            )
        )
        .mappings()
        .first()
    )
    if user:
        code = secrets.token_hex(24)
        conn.execute(
            recuperacoes_senha.update()
            .where(recuperacoes_senha.c.id_usuario == uid(user))
            .values(utilizado=True)
        )
        conn.execute(
            recuperacoes_senha.insert().values(
                id_usuario=uid(user),
                token=sec.digest(code),
                expira_em=now() + timedelta(minutes=15),
            )
        )
        try:
            sec.send_recovery(user["email"], code)
        except (OSError, RuntimeError):
            raise HTTPException(503, "Não foi possível enviar a recuperação.") from None
    return {
        "mensagem": "Se o email estiver cadastrado, você receberá as instruções de recuperação."
    }


def recovery(conn, data, lock=False):
    query = (
        sa.select(recuperacoes_senha)
        .join(T["usuarios"], T["usuarios"].c.id_usuario == recuperacoes_senha.c.id_usuario)
        .where(
            T["usuarios"].c.email == str(data.email).lower(),
            T["usuarios"].c.ativo.is_(True),
            recuperacoes_senha.c.token == sec.digest(data.codigo),
            recuperacoes_senha.c.expira_em > now(),
            recuperacoes_senha.c.utilizado.is_(False),
        )
    )
    if lock:
        query = query.with_for_update()
    row = conn.execute(query).mappings().first()
    if not row:
        raise HTTPException(400, "Código inválido ou expirado.")
    return row


@router.post("/auth/verificar-codigo", tags=["Autenticação"])
def verify_code(data: S.Recovery, request: Request, conn=Conn):
    sec.limit(request, "recovery")
    recovery(conn, data)
    return {"valido": True}


@router.post("/auth/redefinir-senha", status_code=204, tags=["Autenticação"])
def reset(data: S.Reset, request: Request, conn=Conn):
    sec.limit(request, "recovery")
    record = recovery(conn, data, True)
    conn.execute(
        T["usuarios"]
        .update()
        .where(T["usuarios"].c.id_usuario == record["id_usuario"])
        .values(senha_hash=sec.password_hash.hash(data.senha))
    )
    conn.execute(
        recuperacoes_senha.update()
        .where(recuperacoes_senha.c.id_usuario == record["id_usuario"])
        .values(utilizado=True)
    )
    conn.execute(sessoes.delete().where(sessoes.c.id_usuario == record["id_usuario"]))


@router.get("/usuarios/me", tags=["Perfil"])
def profile(user=User):
    return sec.public_user(user)


@router.put("/usuarios/me", tags=["Perfil"])
def update_profile(data: S.Profile, user=User, conn=Conn):
    if data.data_nascimento and data.data_nascimento > today():
        raise HTTPException(422, "Nascimento não pode ser futuro.")
    conn.execute(
        T["usuarios"].update().where(T["usuarios"].c.id_usuario == uid(user)).values(**values(data))
    )
    return sec.public_user(svc.row(conn, T["usuarios"], uid(user)))


@router.put("/usuarios/me/senha", status_code=204, tags=["Perfil"])
def change_password(data: S.ChangePassword, request: Request, user=User, conn=Conn):
    # Session is loaded before this function; rate-limiter uses an independent committed transaction.
    sec.limit(request, "change-password")
    if not sec.verify(data.senha_atual, user["senha_hash"]):
        raise HTTPException(400, "Senha atual incorreta.")
    conn.execute(
        T["usuarios"]
        .update()
        .where(T["usuarios"].c.id_usuario == uid(user))
        .values(senha_hash=sec.password_hash.hash(data.senha))
    )
    conn.execute(sessoes.delete().where(sessoes.c.id_usuario == uid(user)))


@router.delete("/usuarios/me", status_code=204, tags=["Perfil"])
def disable_user(data: S.Login, user=User, conn=Conn):
    if str(data.email).lower() != user["email"] or not sec.verify(data.senha, user["senha_hash"]):
        raise HTTPException(400, "Credenciais inválidas.")
    conn.execute(
        T["usuarios"].update().where(T["usuarios"].c.id_usuario == uid(user)).values(ativo=False)
    )
    conn.execute(sessoes.delete().where(sessoes.c.id_usuario == uid(user)))


@router.get("/enderecos", tags=["Perfil"])
def addresses(user=User, conn=Conn):
    return (
        conn.execute(sa.select(T["enderecos"]).where(T["enderecos"].c.id_usuario == uid(user)))
        .mappings()
        .all()
    )


@router.post("/enderecos", status_code=201, tags=["Perfil"])
def create_address(data: S.Address, user=User, conn=Conn):
    return insert(conn, T["enderecos"], dict(id_usuario=uid(user), **values(data)))


@router.put("/enderecos/{key}", tags=["Perfil"])
def update_address(key: int, data: S.Address, user=User, conn=Conn):
    owned(conn, "enderecos", key, user)
    conn.execute(
        T["enderecos"].update().where(T["enderecos"].c.id_endereco == key).values(**values(data))
    )
    return svc.row(conn, T["enderecos"], key)


@router.delete("/enderecos/{key}", status_code=204, tags=["Perfil"])
def delete_address(key: int, user=User, conn=Conn):
    owned(conn, "enderecos", key, user)
    conn.execute(T["enderecos"].delete().where(T["enderecos"].c.id_endereco == key))


@router.get("/configuracoes", tags=["Preferências"])
def preferences(user=User, conn=Conn):
    return (
        conn.execute(
            sa.select(T["configuracoes"]).where(T["configuracoes"].c.id_usuario == uid(user))
        )
        .mappings()
        .one()
    )


@router.put("/configuracoes", tags=["Preferências"])
def update_preferences(data: S.Preferences, user=User, conn=Conn):
    conn.execute(
        T["configuracoes"]
        .update()
        .where(T["configuracoes"].c.id_usuario == uid(user))
        .values(**values(data))
    )
    return preferences(user, conn)


@router.get("/catalogos", tags=["Catálogos"])
def catalogs(user=User, conn=Conn):
    return {name: conn.execute(sa.select(T[name])).mappings().all() for name in db.SEEDS}


@router.get("/contas", tags=["Contas"])
def accounts(user=User, conn=Conn):
    return [
        account_view(conn, x)
        for x in conn.execute(
            sa.select(T["contas"]).where(T["contas"].c.id_usuario == uid(user))
        ).mappings()
    ]


@router.post("/contas", status_code=201, tags=["Contas"])
def create_account(data: S.Account, user=User, conn=Conn):
    svc.valid_fk(conn, "tipos_conta", data.id_tipo_conta)
    return account_view(conn, insert(conn, T["contas"], dict(id_usuario=uid(user), **values(data))))


@router.get("/contas/{key}", tags=["Contas"])
def get_account(key: int, user=User, conn=Conn):
    return account_view(conn, owned(conn, "contas", key, user))


@router.put("/contas/{key}", tags=["Contas"])
def update_account(key: int, data: S.Account, user=User, conn=Conn):
    owned(conn, "contas", key, user)
    svc.valid_fk(conn, "tipos_conta", data.id_tipo_conta)
    conn.execute(T["contas"].update().where(T["contas"].c.id_conta == key).values(**values(data)))
    return get_account(key, user, conn)


@router.delete("/contas/{key}", status_code=204, tags=["Contas"])
def archive_account(key: int, user=User, conn=Conn):
    owned(conn, "contas", key, user)
    conn.execute(T["contas"].update().where(T["contas"].c.id_conta == key).values(ativa=False))


@router.get("/categorias", tags=["Categorias"])
def categories(user=User, conn=Conn):
    table = T["categorias"]
    return (
        conn.execute(
            sa.select(table).where(
                sa.or_(table.c.id_usuario == uid(user), table.c.id_usuario.is_(None))
            )
        )
        .mappings()
        .all()
    )


@router.post("/categorias", status_code=201, tags=["Categorias"])
def create_category(data: S.Category, user=User, conn=Conn):
    svc.valid_fk(conn, "tipos_transacao", data.id_tipo_transacao)
    return insert(conn, T["categorias"], dict(id_usuario=uid(user), padrao=False, **values(data)))


@router.put("/categorias/{key}", tags=["Categorias"])
def update_category(key: int, data: S.Category, user=User, conn=Conn):
    old = owned(conn, "categorias", key, user)
    svc.valid_fk(conn, "tipos_transacao", data.id_tipo_transacao)
    if (
        data.id_tipo_transacao != old["id_tipo_transacao"]
        and conn.execute(
            sa.select(T["transacoes"].c.id_transacao).where(T["transacoes"].c.id_categoria == key)
        ).first()
    ):
        raise HTTPException(409, "Categoria em uso: não é possível mudar seu tipo.")
    conn.execute(
        T["categorias"].update().where(T["categorias"].c.id_categoria == key).values(**values(data))
    )
    return svc.row(conn, T["categorias"], key)


@router.delete("/categorias/{key}", status_code=204, tags=["Categorias"])
def archive_category(key: int, user=User, conn=Conn):
    owned(conn, "categorias", key, user)
    conn.execute(
        T["categorias"].update().where(T["categorias"].c.id_categoria == key).values(ativa=False)
    )


@router.get("/transacoes", tags=["Transações"])
def transactions(
    data_inicio: date | None = None,
    data_fim: date | None = None,
    id_conta: int | None = None,
    id_categoria: int | None = None,
    tipo: int | None = None,
    status: int | None = None,
    busca: str = Query("", max_length=100),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    user=User,
    conn=Conn,
):
    tx = T["transacoes"]
    q = svc.tx_query(uid(user))
    if data_inicio and data_fim and data_fim < data_inicio:
        raise HTTPException(422, "Período inválido.")
    for value, column in [
        (id_conta, tx.c.id_conta),
        (id_categoria, tx.c.id_categoria),
        (tipo, tx.c.id_tipo_transacao),
        (status, tx.c.id_status_transacao),
    ]:
        if value is not None:
            q = q.where(column == value)
    if data_inicio:
        q = q.where(tx.c.data_transacao >= data_inicio)
    if data_fim:
        q = q.where(tx.c.data_transacao <= data_fim)
    if busca:
        q = q.where(tx.c.descricao.contains(busca, autoescape=True))
    total = conn.execute(sa.select(sa.func.count()).select_from(q.subquery())).scalar_one()
    return {
        "items": conn.execute(
            q.order_by(tx.c.data_transacao.desc(), tx.c.id_transacao.desc())
            .limit(limit)
            .offset(offset)
        )
        .mappings()
        .all(),
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.post("/transacoes", status_code=201, tags=["Transações"])
def create_transaction(data: S.Transaction, user=User, conn=Conn):
    svc.validate_transaction(conn, values(data), uid(user))
    result = insert(conn, T["transacoes"], dict(id_usuario=uid(user), **values(data)))
    svc.notify(conn, uid(user), "Transação registrada", data.descricao)
    return get_transaction(result["id_transacao"], user, conn)


@router.get("/transacoes/{key}", tags=["Transações"])
def get_transaction(key: int, user=User, conn=Conn):
    owned(conn, "transacoes", key, user)
    return (
        conn.execute(svc.tx_query(uid(user)).where(T["transacoes"].c.id_transacao == key))
        .mappings()
        .one()
    )


@router.put("/transacoes/{key}", tags=["Transações"])
def update_transaction(key: int, data: S.Transaction, user=User, conn=Conn):
    owned(conn, "transacoes", key, user, True)
    svc.validate_transaction(conn, values(data), uid(user))
    conn.execute(
        T["transacoes"].update().where(T["transacoes"].c.id_transacao == key).values(**values(data))
    )
    return get_transaction(key, user, conn)


@router.delete("/transacoes/{key}", status_code=204, tags=["Transações"])
def cancel_transaction(key: int, user=User, conn=Conn):
    owned(conn, "transacoes", key, user)
    conn.execute(
        T["transacoes"]
        .update()
        .where(T["transacoes"].c.id_transacao == key)
        .values(id_status_transacao=svc.lookup(conn, "status_transacao", "Cancelada"))
    )


@router.get("/transacoes/{key}/anexos", tags=["Anexos"])
def attachments(key: int, user=User, conn=Conn):
    owned(conn, "transacoes", key, user)
    rows = conn.execute(
        sa.select(T["anexos_transacao"]).where(T["anexos_transacao"].c.id_transacao == key)
    ).mappings()
    return [{k: v for k, v in r.items() if k != "caminho_arquivo"} for r in rows]


@router.post("/transacoes/{key}/anexos", status_code=201, tags=["Anexos"])
def upload(key: int, arquivo: UploadFile = File(...), user=User, conn=Conn):
    owned(conn, "transacoes", key, user)
    content = arquivo.file.read(10 * 1024 * 1024 + 1)
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(413, "Arquivo maior que 10 MB.")
    mime = None
    extension = None
    for signature, kind, suffix in [
        (b"%PDF-", "application/pdf", ".pdf"),
        (b"\x89PNG\r\n\x1a\n", "image/png", ".png"),
        (b"\xff\xd8\xff", "image/jpeg", ".jpg"),
    ]:
        if content.startswith(signature):
            mime = kind
            extension = suffix
            break
    if not mime:
        raise HTTPException(415, "Envie PDF, PNG ou JPEG.")
    name = Path((arquivo.filename or "anexo").replace("\\", "/")).name[:255]
    relative = Path("attachments") / (secrets.token_hex(24) + extension)
    target = settings.storage_dir / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)
    result = insert(
        conn,
        T["anexos_transacao"],
        dict(
            id_transacao=key,
            nome_arquivo=name,
            caminho_arquivo=str(relative),
            tipo_arquivo=mime,
            tamanho_arquivo=len(content),
        ),
    )
    return {k: v for k, v in result.items() if k != "caminho_arquivo"}


def private_file(relative):
    base = settings.storage_dir.resolve()
    target = (base / relative).resolve()
    if not target.is_relative_to(base) or not target.is_file():
        raise HTTPException(404, "Arquivo não encontrado.")
    return target


@router.get("/anexos/{key}/download", tags=["Anexos"])
def download_attachment(key: int, user=User, conn=Conn):
    record = svc.row(conn, T["anexos_transacao"], key)
    if not record:
        raise HTTPException(404, "Anexo não encontrado.")
    owned(conn, "transacoes", record["id_transacao"], user)
    return FileResponse(
        private_file(record["caminho_arquivo"]),
        media_type=record["tipo_arquivo"],
        filename=record["nome_arquivo"],
        headers={"X-Content-Type-Options": "nosniff"},
    )


@router.delete("/anexos/{key}", status_code=204, tags=["Anexos"])
def delete_attachment(key: int, user=User, conn=Conn):
    record = svc.row(conn, T["anexos_transacao"], key)
    if not record:
        raise HTTPException(404, "Anexo não encontrado.")
    owned(conn, "transacoes", record["id_transacao"], user)
    # Commit removes the reference; orphaned files can be cleaned by the maintenance command.
    conn.execute(T["anexos_transacao"].delete().where(T["anexos_transacao"].c.id_anexo == key))


@router.get("/metas", tags=["Metas"])
def goals(user=User, conn=Conn):
    return [
        svc.goal_view(conn, x)
        for x in conn.execute(
            sa.select(T["metas"]).where(T["metas"].c.id_usuario == uid(user))
        ).mappings()
    ]


@router.post("/metas", status_code=201, tags=["Metas"])
def create_goal(data: S.GoalCreate, user=User, conn=Conn):
    if data.status != "em_andamento":
        raise HTTPException(422, "Uma nova meta deve iniciar em andamento.")
    result = insert(
        conn, T["metas"], dict(id_usuario=uid(user), **data.model_dump(exclude={"valor_inicial"}))
    )
    if data.valor_inicial:
        svc.add_movement(
            conn,
            result["id_meta"],
            dict(
                tipo="deposito",
                valor=data.valor_inicial,
                data_movimentacao=data.data_inicio,
                descricao="Saldo inicial",
                id_transacao=None,
            ),
            uid(user),
        )
    return get_goal(result["id_meta"], user, conn)


@router.get("/metas/{key}", tags=["Metas"])
def get_goal(key: int, user=User, conn=Conn):
    return svc.goal_view(conn, owned(conn, "metas", key, user))


@router.put("/metas/{key}", tags=["Metas"])
def update_goal(key: int, data: S.Goal, user=User, conn=Conn):
    owned(conn, "metas", key, user, True)
    conn.execute(T["metas"].update().where(T["metas"].c.id_meta == key).values(**values(data)))
    svc.sync_goal(conn, key)
    return get_goal(key, user, conn)


@router.delete("/metas/{key}", status_code=204, tags=["Metas"])
def cancel_goal(key: int, user=User, conn=Conn):
    owned(conn, "metas", key, user)
    conn.execute(T["metas"].update().where(T["metas"].c.id_meta == key).values(status="cancelada"))


@router.get("/metas/{key}/movimentacoes", tags=["Metas"])
def movements(key: int, user=User, conn=Conn):
    owned(conn, "metas", key, user)
    return (
        conn.execute(
            sa.select(T["movimentacoes_metas"]).where(T["movimentacoes_metas"].c.id_meta == key)
        )
        .mappings()
        .all()
    )


@router.post("/metas/{key}/movimentacoes", status_code=201, tags=["Metas"])
def create_movement(key: int, data: S.Movement, user=User, conn=Conn):
    return svc.add_movement(conn, key, values(data), uid(user))


@router.get("/recorrencias", tags=["Recorrências"])
def recurrences(user=User, conn=Conn):
    return (
        conn.execute(
            sa.select(T["recorrencias"]).where(T["recorrencias"].c.id_usuario == uid(user))
        )
        .mappings()
        .all()
    )


@router.post("/recorrencias", status_code=201, tags=["Recorrências"])
def create_recurrence(data: S.Recurrence, user=User, conn=Conn):
    origin = owned(conn, "transacoes", data.id_transacao_origem, user, True)
    if data.data_inicio < origin["data_transacao"]:
        raise HTTPException(422, "Recorrência anterior à transação original.")
    active = conn.execute(
        sa.select(T["recorrencias"]).where(
            T["recorrencias"].c.id_transacao_origem == data.id_transacao_origem,
            T["recorrencias"].c.ativa.is_(True),
        )
    ).first()
    if active:
        raise HTTPException(409, "Esta transação já tem uma recorrência ativa.")
    return insert(conn, T["recorrencias"], dict(id_usuario=uid(user), **values(data)))


@router.delete("/recorrencias/{key}", status_code=204, tags=["Recorrências"])
def cancel_recurrence(key: int, user=User, conn=Conn):
    owned(conn, "recorrencias", key, user)
    conn.execute(
        T["recorrencias"]
        .update()
        .where(T["recorrencias"].c.id_recorrencia == key)
        .values(ativa=False)
    )


@router.post("/recorrencias/processar", tags=["Recorrências"])
def process(user=User, conn=Conn):
    return {"criadas": svc.process_recurrences(conn, uid(user))}


@router.get("/notificacoes", tags=["Notificações"])
def notifications(
    limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0), user=User, conn=Conn
):
    return (
        conn.execute(
            sa.select(T["notificacoes"])
            .where(T["notificacoes"].c.id_usuario == uid(user))
            .order_by(T["notificacoes"].c.id_notificacao.desc())
            .limit(limit)
            .offset(offset)
        )
        .mappings()
        .all()
    )


@router.patch("/notificacoes/{key}", tags=["Notificações"])
def mark_notification(key: int, data: S.NotificationRead, user=User, conn=Conn):
    owned(conn, "notificacoes", key, user)
    conn.execute(
        T["notificacoes"]
        .update()
        .where(T["notificacoes"].c.id_notificacao == key)
        .values(lida=data.lida)
    )
    return svc.row(conn, T["notificacoes"], key)


@router.delete("/notificacoes/{key}", status_code=204, tags=["Notificações"])
def delete_notification(key: int, user=User, conn=Conn):
    owned(conn, "notificacoes", key, user)
    conn.execute(T["notificacoes"].delete().where(T["notificacoes"].c.id_notificacao == key))


@router.get("/resumo", tags=["Relatórios"])
def totals(data_inicio: date | None = None, data_fim: date | None = None, user=User, conn=Conn):
    return svc.summary(conn, uid(user), data_inicio or today().replace(day=1), data_fim or today())


@router.get("/relatorios", tags=["Relatórios"])
def report_list(user=User, conn=Conn):
    return [
        {k: v for k, v in r.items() if k != "caminho_arquivo"}
        for r in conn.execute(
            sa.select(T["relatorios_gerados"])
            .where(T["relatorios_gerados"].c.id_usuario == uid(user))
            .order_by(T["relatorios_gerados"].c.id_relatorio.desc())
            .limit(100)
        ).mappings()
    ]


@router.post("/relatorios", status_code=201, tags=["Relatórios"])
def create_report(data: S.Report, user=User, conn=Conn):
    entries = svc.transaction_rows(conn, uid(user), data.data_inicio, data.data_fim)
    if len(entries) > 10000:
        raise HTTPException(422, "Reduza o período para até 10000 transações.")
    content, _ = reports.export(entries, data.formato)
    relative = Path("reports") / (secrets.token_hex(24) + "." + data.formato)
    target = settings.storage_dir / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)
    result = insert(
        conn,
        T["relatorios_gerados"],
        dict(
            id_usuario=uid(user), tipo="transacoes", caminho_arquivo=str(relative), **values(data)
        ),
    )
    return {k: v for k, v in result.items() if k != "caminho_arquivo"}


@router.get("/relatorios/{key}/download", tags=["Relatórios"])
def download_report(key: int, user=User, conn=Conn):
    result = owned(conn, "relatorios_gerados", key, user)
    return FileResponse(
        private_file(result["caminho_arquivo"]),
        filename="nexus-relatorio." + result["formato"],
        headers={"X-Content-Type-Options": "nosniff"},
    )


@router.get("/backup", tags=["Exportação"])
def backup(user=User, conn=Conn):
    content = {"usuario": sec.public_user(user)}
    for name in [
        "enderecos",
        "configuracoes",
        "contas",
        "categorias",
        "transacoes",
        "metas",
        "recorrencias",
        "notificacoes",
    ]:
        table = T[name]
        content[name] = [
            dict(x)
            for x in conn.execute(
                sa.select(table).where(table.c.id_usuario == uid(user))
            ).mappings()
        ]
    goal_ids = [x["id_meta"] for x in content["metas"]]
    content["movimentacoes_metas"] = [
        dict(x)
        for x in conn.execute(
            sa.select(T["movimentacoes_metas"]).where(
                T["movimentacoes_metas"].c.id_meta.in_(goal_ids)
            )
        ).mappings()
    ]
    archive = io.BytesIO()
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "nexus-dados.json",
            json.dumps(
                jsonable_encoder(content, custom_encoder={Decimal: str}),
                ensure_ascii=False,
                indent=2,
            ),
        )
        tx_ids = [x["id_transacao"] for x in content["transacoes"]]
        for attachment in conn.execute(
            sa.select(T["anexos_transacao"]).where(T["anexos_transacao"].c.id_transacao.in_(tx_ids))
        ).mappings():
            target = private_file(attachment["caminho_arquivo"])
            z.write(
                target,
                "anexos/"
                + str(attachment["id_anexo"])
                + "-"
                + Path(attachment["nome_arquivo"]).name,
            )
    return Response(
        archive.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="nexus-backup.zip"'},
    )


@router.put("/recorrencias/{key}", tags=["Recorrências"])
def update_recurrence(key: int, data: S.Recurrence, user=User, conn=Conn):
    old = owned(conn, "recorrencias", key, user, True)
    if data.id_transacao_origem != old["id_transacao_origem"]:
        raise HTTPException(422, "A transação de origem não pode ser trocada.")
    changed = data.frequencia != old["frequencia"] or data.data_inicio != old["data_inicio"]
    if changed and data.data_inicio <= today():
        raise HTTPException(422, "Ao alterar a frequência, escolha um início futuro.")
    conn.execute(
        T["recorrencias"]
        .update()
        .where(T["recorrencias"].c.id_recorrencia == key)
        .values(**values(data))
    )
    return svc.row(conn, T["recorrencias"], key)


@router.post("/usuarios/me/foto", tags=["Perfil"])
def upload_avatar(arquivo: UploadFile = File(...), user=User, conn=Conn):
    content = arquivo.file.read(5 * 1024 * 1024 + 1)
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(413, "Imagem maior que 5 MB.")
    if content.startswith(b"\x89PNG\r\n\x1a\n"):
        suffix = ".png"
    elif content.startswith(b"\xff\xd8\xff"):
        suffix = ".jpg"
    else:
        raise HTTPException(415, "Envie PNG ou JPEG.")
    relative = Path("avatars") / (secrets.token_hex(24) + suffix)
    target = settings.storage_dir / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)
    conn.execute(
        T["usuarios"]
        .update()
        .where(T["usuarios"].c.id_usuario == uid(user))
        .values(foto_perfil=str(relative))
    )
    return {"foto_url": "/api/v1/usuarios/me/foto"}


@router.get("/usuarios/me/foto", tags=["Perfil"])
def download_avatar(user=User):
    if not user["foto_perfil"]:
        raise HTTPException(404, "Foto não cadastrada.")
    target = private_file(user["foto_perfil"])
    return FileResponse(
        target, filename="perfil" + target.suffix, headers={"X-Content-Type-Options": "nosniff"}
    )


@router.delete("/usuarios/me/foto", status_code=204, tags=["Perfil"])
def remove_avatar(user=User, conn=Conn):
    conn.execute(
        T["usuarios"]
        .update()
        .where(T["usuarios"].c.id_usuario == uid(user))
        .values(foto_perfil=None)
    )
