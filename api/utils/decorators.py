# api/utils/decorators.py
"""
Decoradores personalizados para permisos y validaciones
"""

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from models.user import User
from extensions import db


def admin_required(fn):
    """
    Decorador que verifica que el usuario sea admin.
    
    Uso:
        @admin_required
        def mi_endpoint():
            # Solo admins pueden acceder aquí
            pass
    
    Funciona así:
    1. Verifica que haya JWT válido
    2. Obtiene el user_id del token
    3. Busca el usuario en BD
    4. Verifica que role == 'admin'
    5. Si todo OK, ejecuta la función
    6. Si falla, retorna 403 Forbidden
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # 1. Verificar JWT (igual que @jwt_required())
        verify_jwt_in_request()
        
        # 2. Obtener ID del usuario desde el token
        user_id = get_jwt_identity()
        
        # 3. Buscar usuario en base de datos
        user = User.query.get(int(user_id))
        
        # 4. Validar que existe y es admin
        if not user:
            return jsonify({
                "error": "Usuario no encontrado"
            }), 404
        
        if user.role not in ['admin', 'superadmin']:
            return jsonify({
                "error": "Acceso denegado",
                "message": "Solo administradores pueden acceder a este recurso"
            }), 403
        
        # 5. Todo OK, ejecutar función original pasando el usuario
        return fn(current_user=user, *args, **kwargs)
    
    return wrapper


def superadmin_required(fn):
    """
    Decorador que verifica que el usuario sea superadmin.
    
    Uso:
        @superadmin_required
        def mi_endpoint():
            # Solo superadmins pueden acceder aquí
            pass
    
    Funciona así:
    1. Verifica que haya JWT válido
    2. Obtiene el user_id del token
    3. Busca el usuario en BD
    4. Verifica que role == 'superadmin'
    5. Si todo OK, ejecuta la función
    6. Si falla, retorna 403 Forbidden
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # 1. Verificar JWT
        verify_jwt_in_request()
        
        # 2. Obtener ID del usuario desde el token
        user_id = get_jwt_identity()
        
        # 3. Buscar usuario en base de datos
        user = User.query.get(int(user_id))
        
        # 4. Validar que existe y es superadmin
        if not user:
            return jsonify({
                "error": "Usuario no encontrado"
            }), 404
        
        if user.role != 'superadmin':
            return jsonify({
                "error": "Acceso denegado",
                "message": "Solo super administradores pueden acceder a este recurso"
            }), 403
        
        # 5. Todo OK, ejecutar función
        return fn(current_user=user, *args, **kwargs)
    
    return wrapper


def public_endpoint(fn):
    """
    Decorador decorativo para endpoints públicos (sin JWT).
    
    Uso:
        @public_endpoint
        def mi_endpoint_publico():
            # Cualquiera puede acceder
            pass
    
    Nota: Este decorador es solo documentación.
    En realidad no hace nada, pero marca claramente
    qué endpoints son públicos.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper
