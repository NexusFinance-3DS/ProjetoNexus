from contextlib import asynccontextmanager
from decimal import Decimal

import sqlalchemy as sa
from fastapi import FastAPI, Request
from fastapi.encoders import ENCODERS_BY_TYPE, jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import db
from .api import router
from .config import settings

ENCODERS_BY_TYPE[Decimal] = str


class DecimalJSONResponse(JSONResponse):
    def render(self, content):
        return super().render(jsonable_encoder(content, custom_encoder={Decimal: str}))


@asynccontextmanager
async def lifespan(app):
    if settings.environment == "production" and settings.database_url.startswith("sqlite"):
        raise RuntimeError("Configure MySQL para produção.")
    settings.storage_dir.mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title="NexusFinance API",
    version="1.0.0",
    lifespan=lifespan,
    description="API privada por usuário. Autentique em /auth/login e use o access_token no botão Authorize.",
    default_response_class=DecimalJSONResponse,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(router)


@app.exception_handler(sa.exc.IntegrityError)
async def integrity_error(request: Request, exc):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Dados duplicados ou vínculo inválido. Confira email, CPF e referências."
        },
    )


@app.get("/health", tags=["Operação"])
def health():
    with db.engine.connect() as conn:
        conn.execute(sa.text("SELECT 1"))
    return {"status": "ok", "database": db.engine.dialect.name}
