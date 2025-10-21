# api/utils/email.py
"""
Utilidades para envío de emails
Usa Resend para notificaciones de mensajes de contacto
"""

import os
import requests
from typing import Optional


def send_contact_notification(
    contact_name: str,
    contact_email: str,
    contact_phone: Optional[str],
    subject: str,
    message: str,
    admin_email: str = None
) -> dict:
    """
    Envía notificación por email cuando llega un mensaje de contacto.
    
    Args:
        contact_name: Nombre de quien envió el mensaje
        contact_email: Email de quien envió el mensaje
        contact_phone: Teléfono (opcional)
        subject: Asunto del mensaje
        message: Contenido del mensaje
        admin_email: Email del admin que recibirá la notificación
    
    Returns:
        dict con status y mensaje de resultado
    
    Ejemplo de uso:
        result = send_contact_notification(
            contact_name="Juan Pérez",
            contact_email="juan@example.com",
            contact_phone="555-1234",
            subject="Consulta sobre matrícula",
            message="Quisiera información...",
            admin_email="delacruzantony32@gmail.com"
        )
    """
    
    # Email del admin (puede venir de variable de entorno o parámetro)
    recipient_email = admin_email or os.environ.get("ADMIN_EMAIL", "delacruzantony32@gmail.com")
    
    # API Key de Resend (desde variable de entorno)
    resend_api_key = os.environ.get("RESEND_API_KEY")
    
    if not resend_api_key:
        return {
            "success": False,
            "error": "RESEND_API_KEY no configurada. Email no enviado.",
            "note": "Configurar en .env: RESEND_API_KEY=re_xxxxx"
        }
    
    # Construir el HTML del email
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
            .field {{ margin-bottom: 15px; }}
            .label {{ font-weight: bold; color: #667eea; }}
            .value {{ margin-top: 5px; padding: 10px; background: white; 
                     border-left: 3px solid #667eea; }}
            .message-box {{ background: white; padding: 20px; margin-top: 20px; 
                           border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>📧 Nuevo Mensaje de Contacto</h2>
                <p>Has recibido un nuevo mensaje desde el formulario de contacto del sitio web.</p>
            </div>
            
            <div class="content">
                <div class="field">
                    <div class="label">👤 Nombre:</div>
                    <div class="value">{contact_name}</div>
                </div>
                
                <div class="field">
                    <div class="label">📧 Email:</div>
                    <div class="value">
                        <a href="mailto:{contact_email}">{contact_email}</a>
                    </div>
                </div>
                
                {f'''
                <div class="field">
                    <div class="label">📱 Teléfono:</div>
                    <div class="value">{contact_phone}</div>
                </div>
                ''' if contact_phone else ''}
                
                <div class="field">
                    <div class="label">📋 Asunto:</div>
                    <div class="value">{subject}</div>
                </div>
                
                <div class="message-box">
                    <div class="label">💬 Mensaje:</div>
                    <p style="margin-top: 10px; white-space: pre-wrap;">{message}</p>
                </div>
                
                <div class="footer">
                    <p>Este email fue enviado automáticamente desde el formulario de contacto.</p>
                    <p>Para responder, usa el email: <strong>{contact_email}</strong></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Payload para Resend API
    payload = {
        "from": "Formulario Contacto <onboarding@resend.dev>",  # Email por defecto de Resend
        "to": [recipient_email],
        "subject": f"Nuevo mensaje: {subject}",
        "html": html_content,
        "reply_to": contact_email  # Para que puedas responder directamente
    }
    
    # Headers
    headers = {
        "Authorization": f"Bearer {resend_api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        # Llamada a API de Resend
        response = requests.post(
            "https://api.resend.com/emails",
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return {
                "success": True,
                "message": f"Email enviado a {recipient_email}",
                "email_id": response.json().get("id")
            }
        else:
            return {
                "success": False,
                "error": f"Error al enviar email: {response.status_code}",
                "details": response.text
            }
    
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Error de conexión: {str(e)}"
        }


def send_test_email(admin_email: str = "delacruzantony32@gmail.com") -> dict:
    """
    Envía un email de prueba para verificar la configuración.
    
    Uso:
        python -c "from utils.email import send_test_email; print(send_test_email())"
    """
    return send_contact_notification(
        contact_name="Prueba del Sistema",
        contact_email="test@example.com",
        contact_phone="555-0000",
        subject="Email de prueba",
        message="Este es un email de prueba para verificar que el sistema de notificaciones funciona correctamente.",
        admin_email=admin_email
    )
