"""
Rutas API para gestión de Usuarios (CRUD completo)
Endpoints: GET /api/usuarios, POST /api/usuarios, PUT/DELETE /api/usuarios/<id>

Permisos:
- Todos los endpoints: Solo admins (@admin_required)
- No hay registro público de usuarios (solo admins crean usuarios)
"""
from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User
from werkzeug.security import generate_password_hash
from utils.decorators import admin_required, superadmin_required, public_endpoint

bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")


@bp.route("", methods=["GET"])
@admin_required
def list_usuarios():
    """GET /api/usuarios - Lista todos los usuarios (solo admins)"""
    users = User.query.all()
    data = [u.to_dict() for u in users]
    return jsonify(data)


@bp.route("/<int:user_id>", methods=["GET"])
def get_usuario(user_id):
    """GET /api/usuarios/<id> - Obtiene un usuario por ID"""
    u = User.query.get_or_404(user_id)
    return jsonify(u.to_dict())


@bp.route("", methods=["POST"])
@superadmin_required
def create_usuario(current_user):
    """POST /api/usuarios - Crea un nuevo usuario (requiere JWT superadmin)"""
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role", "admin")
    
    # Solo superadmin puede crear usuarios
    # Validación adicional: no se puede crear otro superadmin
    if role == "superadmin":
        return jsonify({"msg": "No se puede crear otro superadmin"}), 403
    
    # Validaciones
    if not email or not password:
        return jsonify({"msg": "email y password son requeridos"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "email ya registrado"}), 400
    
    # Crear usuario con password hasheada
    hashed = generate_password_hash(password)
    u = User(email=email, password_hash=hashed, name=name, role=role)
    db.session.add(u)
    db.session.commit()
    return jsonify(u.to_dict()), 201


@bp.route("/<int:user_id>", methods=["PUT"])
@admin_required
def update_usuario(user_id):
    """PUT /api/usuarios/<id> - Actualiza un usuario (requiere JWT)"""
    u = User.query.get_or_404(user_id)
    data = request.json or {}
    
    # Actualizar campos si vienen en el request
    if "email" in data:
        if data["email"] != u.email and User.query.filter_by(email=data["email"]).first():
            return jsonify({"msg": "email ya registrado"}), 400
        u.email = data["email"]
    if "password" in data and data.get("password"):
        u.password_hash = generate_password_hash(data.get("password"))
    if "name" in data:
        u.name = data.get("name")
    if "role" in data:
        u.role = data.get("role")
    
    db.session.commit()
    return jsonify(u.to_dict())


@bp.route("/<int:user_id>", methods=["DELETE"])
@superadmin_required
def delete_usuario(current_user, user_id):
    """DELETE /api/usuarios/<id> - Elimina un usuario (requiere JWT superadmin)"""
    u = User.query.get_or_404(user_id)
    
    # No se puede eliminar a sí mismo
    if u.id == current_user.id:
        return jsonify({"msg": "No puedes eliminarte a ti mismo"}), 400
    
    # No se puede eliminar a otro superadmin
    if u.role == "superadmin":
        return jsonify({"msg": "No se puede eliminar al superadmin"}), 403
    
    db.session.delete(u)
    db.session.commit()
    return jsonify({"msg": "usuario eliminado"})

