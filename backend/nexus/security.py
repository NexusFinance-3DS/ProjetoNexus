import hashlib
import secrets
import smtplib
import ssl
from datetime import timedelta
from email.message import EmailMessage

import sqlalchemy as sa
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash

from . import db
from .config import settings
from .models import limites_acesso, now, sessoes, usuarios

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash(secrets.token_urlsafe(24))
bearer = HTTPBearer(auto_error=False)


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


def verify(password, hashed):
    try:
        return password_hash.verify(password, hashed)
    except (ValueError, TypeError):
        return False


def limit(request: Request, scope: str, maximum=20, window=900):
    # Not trusting forwarded headers: proxy trust must be configured explicitly in Uvicorn.
    key = digest(scope + "|" + (request.client.host if request.client else "unknown"))
    blocked = False
    # Commit independently so failed logins do not roll back their attempt counters.
    with db.engine.begin() as conn:
        conn.execute(
            sa.delete(limites_acesso).where(limites_acesso.c.inicio < now() - timedelta(days=1))
        )
        row = (
            conn.execute(
                sa.select(limites_acesso).where(limites_acesso.c.chave == key).with_for_update()
            )
            .mappings()
            .first()
        )
        if not row:
            try:
                with conn.begin_nested():
                    conn.execute(
                        limites_acesso.insert().values(chave=key, inicio=now(), tentativas=1)
                    )
            except sa.exc.IntegrityError:
                conn.execute(
                    limites_acesso.update()
                    .where(limites_acesso.c.chave == key)
                    .values(tentativas=limites_acesso.c.tentativas + 1)
                )
                count = conn.execute(
                    sa.select(limites_acesso.c.tentativas).where(limites_acesso.c.chave == key)
                ).scalar_one()
                blocked = count > maximum
        elif row["inicio"] < now() - timedelta(seconds=window):
            conn.execute(
                limites_acesso.update()
                .where(limites_acesso.c.chave == key)
                .values(inicio=now(), tentativas=1)
            )
        else:
            conn.execute(
                limites_acesso.update()
                .where(limites_acesso.c.chave == key)
                .values(tentativas=limites_acesso.c.tentativas + 1)
            )
            blocked = row["tentativas"] >= maximum
    if blocked:
        raise HTTPException(
            429, "Muitas tentativas. Aguarde alguns minutos.", headers={"Retry-After": str(window)}
        )


def public_user(row):
    return {k: v for k, v in dict(row).items() if k != "senha_hash"}


def create_session(conn, user):
    raw = secrets.token_urlsafe(48)
    expires = now() + timedelta(days=settings.session_days)
    conn.execute(
        sessoes.insert().values(
            id_usuario=user["id_usuario"], token_hash=digest(raw), expira_em=expires
        )
    )
    return {
        "access_token": raw,
        "token_type": "bearer",
        "expires_at": expires,
        "usuario": public_user(user),
    }


def current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer), conn=Depends(db.connection)
):
    if not credentials:
        raise HTTPException(401, "Entre na sua conta.", headers={"WWW-Authenticate": "Bearer"})
    user = (
        conn.execute(
            sa.select(usuarios)
            .join(sessoes, usuarios.c.id_usuario == sessoes.c.id_usuario)
            .where(
                sessoes.c.token_hash == digest(credentials.credentials),
                sessoes.c.expira_em > now(),
                usuarios.c.ativo.is_(True),
            )
        )
        .mappings()
        .first()
    )
    if not user:
        raise HTTPException(
            401, "Sessão inválida ou expirada.", headers={"WWW-Authenticate": "Bearer"}
        )
    return user


def send_recovery(email, code):
    message = EmailMessage()
    message["From"] = settings.smtp_from
    message["To"] = email
    message["Subject"] = "NexusFinance - recuperação de senha"
    message.set_content(
        "Cole este código no aplicativo para redefinir a senha. Expira em 15 minutos.\n\n" + code
    )
    if settings.smtp_host:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
            if settings.smtp_starttls:
                smtp.starttls(context=ssl.create_default_context())
            if settings.smtp_user:
                smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(message)
    elif settings.environment == "development":
        folder = settings.storage_dir / "outbox"
        folder.mkdir(parents=True, exist_ok=True)
        (folder / (secrets.token_hex(12) + ".eml")).write_text(
            message.as_string(), encoding="utf-8"
        )
    else:
        raise RuntimeError("SMTP não configurado")
