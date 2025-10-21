"""
Aplicación principal Flask (Application Factory Pattern)
Crea y configura la app con blueprints, extensiones y endpoints base
"""
from flask import Flask, jsonify, send_from_directory
from config import ActiveConfig
from extensions import db, migrate, jwt, cors
import os

def create_app(config_class=None):
    """
    Factory para crear la aplicación Flask
    Args:
        config_class: Clase de configuración (usa ActiveConfig si no se especifica)
    Returns:
        app: Instancia de Flask configurada
    """
    app = Flask(__name__)
    
    # Cargar configuración (development o production según FLASK_ENV)
    if config_class is None:
        config_class = ActiveConfig
    
    app.config.from_object(config_class)

    # Inicializar extensiones (base de datos, migraciones, JWT, CORS)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS").split(",")}})

    # Registrar blueprints (rutas organizadas por módulo)
    from routes.auth_routes import bp as auth_bp
    from routes.publication_routes import bp as pub_bp
    from routes.categorias_routes import bp as categorias_bp
    from routes.galeria_routes import bp as galeria_bp
    from routes.mensajes_routes import bp as mensajes_bp
    from routes.usuarios_routes import bp as usuarios_bp
    from routes.dashboard_routes import bp as dashboard_bp
    from routes.upload_routes import bp as upload_bp
    from routes.test_routes import bp as test_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(pub_bp)
    app.register_blueprint(categorias_bp)
    app.register_blueprint(galeria_bp)
    app.register_blueprint(mensajes_bp)
    app.register_blueprint(usuarios_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(upload_bp)
    app.register_blueprint(test_bp)

    @app.route("/api/")
    def index():
        """Endpoint raíz - devuelve info básica de la API"""
        return jsonify({
            "msg": "API running",
            "version": "1.0",
            "endpoints": {
                "auth": "/api/administracion/login",
                "dashboard": "/api/dashboard/stats",
                "upload": "/api/upload/image",
                "usuarios": "/api/usuarios",
                "publicaciones": "/api/publicaciones",
                "categorias": "/api/categorias",
                "galeria": "/api/galeria",
                "mensajes": "/api/mensajes_contacto"
            }
        })

    @app.route("/api/health")
    def health():
        """Health check endpoint - usado por Docker para verificar que el servicio está activo"""
        return jsonify({
            "status": "healthy",
            "environment": app.config.get("FLASK_ENV", "unknown")
        })
    
    @app.route("/uploads/<path:subpath>")
    def serve_uploads(subpath):
        """
        Sirve archivos estáticos subidos (solo para almacenamiento local)
        URL: /uploads/galeria/imagen_123456.jpg
        
        NOTA: En producción usar Nginx/Apache para servir archivos estáticos
        """
        uploads_dir = os.path.join(app.root_path, 'uploads')
        return send_from_directory(uploads_dir, subpath)

    return app


if __name__ == "__main__":
    # Modo desarrollo directo (no usar en producción, usar Gunicorn)
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
