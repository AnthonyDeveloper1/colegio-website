"""
Extensiones de Flask inicializadas globalmente
Se inicializan aquí para evitar importaciones circulares, luego se vinculan a la app en app.py
"""
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# SQLAlchemy: ORM para manejar modelos y base de datos PostgreSQL
db = SQLAlchemy()

# Flask-Migrate: maneja migraciones de esquema de BD (como Alembic)
migrate = Migrate()

# JWTManager: autenticación basada en tokens JWT
jwt = JWTManager()

# CORS: permite peticiones desde orígenes diferentes (frontend → API)
cors = CORS()
