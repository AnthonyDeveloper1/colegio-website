"""
Rutas API para Mensajes de Contacto (formulario web)
Endpoints: POST /api/mensajes_contacto (crear mensaje - público), GET /api/mensajes_contacto (listar - admin)

Permisos:
- POST (enviar mensaje): Público (cualquiera puede contactar)
- GET (list, detail), DELETE: Solo admins (@admin_required)

Notificaciones:
- Al recibir mensaje, envía email al admin configurado
"""
from flask import Blueprint, request, jsonify
from extensions import db
from models.contact_message import ContactMessage
from utils.decorators import admin_required, public_endpoint
from utils.email import send_contact_notification
import os

bp = Blueprint("mensajes_contacto", __name__, url_prefix="/api/mensajes_contacto")


@bp.route("", methods=["POST"])
@public_endpoint
def enviar_mensaje():
    """POST /api/mensajes_contacto - Envía un mensaje de contacto (PÚBLICO - sin JWT)"""
    data = request.json or {}
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")
    
    # Validaciones
    if not name or not email or not message:
        return jsonify({"msg": "name, email y message son requeridos"}), 400
    
    # Crear mensaje
    m = ContactMessage(
        name=name,
        email=email,
        phone=data.get("phone"),
        subject=data.get("subject", "Sin asunto"),
        message=message
    )
    
    db.session.add(m)
    db.session.commit()
    
    # Enviar notificación por email al admin
    email_result = send_contact_notification(
        contact_name=name,
        contact_email=email,
        contact_phone=data.get("phone"),
        subject=data.get("subject", "Sin asunto"),
        message=message,
        admin_email=os.environ.get("ADMIN_EMAIL", "delacruzantony32@gmail.com")
    )
    
    # Respuesta al usuario
    response = {
        "id": m.id,
        "msg": "mensaje enviado correctamente"
    }
    
    # Agregar info del email si fue enviado (solo para debug)
    if email_result.get("success"):
        response["email_sent"] = True
    else:
        # Email falló pero el mensaje se guardó en BD
        response["email_sent"] = False
        response["email_note"] = "Mensaje guardado, pero notificación por email falló"
    
    return jsonify(response), 201


@bp.route("", methods=["GET"])
@admin_required
def list_mensajes():
    """GET /api/mensajes_contacto - Lista todos los mensajes (requiere JWT - admin)"""
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    data = [
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "phone": m.phone,
            "subject": m.subject,
            "message": m.message,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in messages
    ]
    return jsonify(data)


@bp.route("/<int:msg_id>", methods=["GET"])
@admin_required
def get_mensaje(msg_id):
    """GET /api/mensajes_contacto/<id> - Obtiene un mensaje por ID (requiere JWT - admin)"""
    msg = ContactMessage.query.get_or_404(msg_id)
    data = {
        "id": msg.id,
        "name": msg.name,
        "email": msg.email,
        "phone": msg.phone,
        "subject": msg.subject,
        "message": msg.message,
        "created_at": msg.created_at.isoformat() if msg.created_at else None
    }
    return jsonify(data)


@bp.route("/<int:msg_id>", methods=["DELETE"])
@admin_required
def delete_mensaje(msg_id):
    """DELETE /api/mensajes_contacto/<id> - Elimina un mensaje (requiere JWT - admin)"""
    msg = ContactMessage.query.get_or_404(msg_id)
    db.session.delete(msg)
    db.session.commit()
    return jsonify({"msg": "mensaje eliminado"})

