"""
Script simple para crear un usuario admin en la base de datos.
Uso:
  # Con argumentos:
  python seed_admin.py --db-url "postgresql://postgres:postgres@db:5432/appdb" --email admin@example.com --password secret
  
  # Con variable de entorno DATABASE_URL:
  python seed_admin.py --email admin@example.com --password secret
  
  # Sin argumentos (usa defaults):
  python seed_admin.py

Este script asume que la tabla users ya existe. Para un flujo completo, usa flask-migrate para crear las tablas primero.
"""
import argparse
import os
from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData
from sqlalchemy.sql import select


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--db-url", default=os.getenv("DATABASE_URL"), help="Database URL (default: DATABASE_URL env var)")
    parser.add_argument("--email", default="admin@iejaqg.edu.pe", help="Admin email")
    parser.add_argument("--password", default="admin123", help="Admin password")
    args = parser.parse_args()
    
    if not args.db_url:
        print("Error: --db-url requerido o configurar DATABASE_URL en entorno")
        return

    engine = create_engine(args.db_url)
    meta = MetaData()

    users = Table(
        "usuarios", meta,
        Column("id", Integer, primary_key=True),
        Column("email", String),
        Column("password_hash", String),
        Column("name", String),
        Column("role", String),
    )

    conn = engine.connect()

    # comprobar si existe
    sel = select(users.c.id).where(users.c.email == args.email)
    res = conn.execute(sel).fetchone()
    if res:
        print(f"Usuario {args.email} ya existe (id={res[0]}). No se creó nada.")
        return

    ins = users.insert().values(
        email=args.email,
        password_hash=generate_password_hash(args.password),
        name="Admin",
        role="admin",
    )
    result = conn.execute(ins)
    conn.commit()
    print(f"✅ Admin creado exitosamente!")
    print(f"   Email: {args.email}")
    print(f"   ID: {result.inserted_primary_key}")
    conn.close()


if __name__ == "__main__":
    main()
