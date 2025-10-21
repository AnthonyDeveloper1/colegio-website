"""
Modelo ContactMessage (Mensajes del formulario de contacto)
Tabla: mensajes_contacto
Almacena consultas/mensajes enviados desde el sitio web
"""
from datetime import datetime
from extensions import db


class ContactMessage(db.Model):
    """Modelo de mensaje de contacto del formulario web"""
    __tablename__ = "mensajes_contacto"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)  # Nombre del remitente
    email = db.Column(db.String(200), nullable=False)  # Email de contacto
    phone = db.Column(db.String(60))  # Teléfono opcional
    subject = db.Column(db.String(250))  # Asunto del mensaje
    message = db.Column(db.Text, nullable=False)  # Contenido del mensaje
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de envío
    leido = db.Column(db.Boolean, default=False)  # Si el mensaje fue leído

    def to_dict(self):
        """Serializar mensaje a diccionario para JSON"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "subject": self.subject,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "leido": self.leido
        }
