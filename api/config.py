"""
Configuración de la aplicación Flask
Maneja diferentes entornos (development, production) con variables de entorno
"""
import os


class Config:
    """Configuración base compartida por todos los entornos"""
    # Clave secreta para sesiones y cookies (cambiar en producción)
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
    
    # URI de conexión a PostgreSQL (formato: postgresql://user:pass@host:port/db)
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql://postgres:root@db:5432/colegio_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Desactiva señales de modificación (mejor performance)
    
    # Configuración JWT (autenticación con tokens Bearer en headers - SIN CSRF)
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    JWT_TOKEN_LOCATION = ["headers"]  # Solo tokens en Authorization header
    # IMPORTANTE: Al usar solo "headers" (no cookies), CSRF debe estar deshabilitado
    # pero Flask-JWT-Extended requiere estas configuraciones explícitas:
    JWT_COOKIE_CSRF_PROTECT = False  # No proteger cookies con CSRF (no usamos cookies)
    JWT_CSRF_METHODS = []  # Lista vacía = no verificar CSRF en ningún método
    
    # Orígenes permitidos para CORS (separados por comas)
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")
    
    # Validación: JWT_SECRET_KEY es obligatorio en producción
    if not JWT_SECRET_KEY and os.environ.get("FLASK_ENV") == "production":
        raise ValueError("JWT_SECRET_KEY must be set in production!")


class DevelopmentConfig(Config):
    """Configuración para desarrollo local (debug activo, logs verbose)"""
    DEBUG = True
    FLASK_ENV = "development"


class ProductionConfig(Config):
    """Configuración para producción (debug off, optimizaciones activas)"""
    DEBUG = False
    FLASK_ENV = "production"
    # Opciones avanzadas de BD para producción (descomentar si necesitas):
    # SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True, "pool_recycle": 300}


# Diccionario de configuraciones disponibles
config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}

# Seleccionar configuración activa según variable FLASK_ENV (por defecto: development)
env = os.environ.get("FLASK_ENV", "development")
ActiveConfig = config_by_name.get(env, DevelopmentConfig)
