"""
Modelo User (Usuarios del sistema)
Tabla: usuarios
Almacena credenciales y roles (admin, editor, etc)
"""
from datetime import datetime
from extensions import db


class User(db.Model):
    """Modelo de usuario para autenticación y autorización"""
    __tablename__ = "usuarios"
    
    # Campos
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(180), unique=True, nullable=False, index=True)  # Email único (login)
    password_hash = db.Column(db.String(256), nullable=False)  # Password hasheada (nunca en texto plano)
    name = db.Column(db.String(150))  # Nombre del usuario
    role = db.Column(db.String(50), default="admin")  # Rol: admin, editor, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de creación
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Última modificación

    def to_dict(self):
        """Serializa el usuario a diccionario (sin password_hash por seguridad)"""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role
        }
