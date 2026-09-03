import argparse
import time

import sqlalchemy as sa
from alembic import command
from alembic.config import Config

from .db import engine
from .models import usuarios
from .services import process_recurrences


def run_jobs():
    with engine.connect() as conn:
        ids = (
            conn.execute(sa.select(usuarios.c.id_usuario).where(usuarios.c.ativo.is_(True)))
            .scalars()
            .all()
        )
    total = 0
    for user_id in ids:
        with engine.begin() as conn:
            total += process_recurrences(conn, user_id)
    return total


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["init-db", "recorrencias", "worker"])
    args = parser.parse_args()
    if args.command == "init-db":
        command.upgrade(Config("alembic.ini"), "head")
        print("Banco pronto; tabelas e dados existentes preservados.")
    elif args.command == "recorrencias":
        print(f"{run_jobs()} lançamentos criados.")
    else:
        while True:
            try:
                count = run_jobs()
                if count:
                    print(f"{count} lançamentos criados.", flush=True)
            except Exception:
                import logging

                logging.exception("Falha ao processar recorrências; nova tentativa em 60 segundos.")
            time.sleep(60)


if __name__ == "__main__":
    main()
