"""
Rutas de Autenticación (Login y obtener usuario actual)
Endpoints: POST /api/administracion/login, GET /api/administracion/auth-user
Genera tokens JWT para acceso protegido
"""
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

bp = Blueprint("auth", __name__, url_prefix="/api/administracion")


@bp.route("/login", methods=["POST"])
def login():
    """POST /api/administracion/login - Autenticación y generación de token JWT"""
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    
    # Validaciones
    if not email or not password:
        return jsonify({"msg": "Credenciales incompletas"}), 400
    
    # Buscar usuario y verificar password
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    # Crear token JWT con identity como STRING (fix para CSRF validation)
    token = create_access_token(identity=str(user.id), fresh=False)
    
    return jsonify({
        "access_token": token,
        "user": user.to_dict()
    })


@bp.route("/mi-perfil", methods=["GET"])
@jwt_required()
def me():
    """GET /api/administracion/mi-perfil - Obtiene el perfil del usuario autenticado"""
    user_id = get_jwt_identity()  # Ahora es string, convertir a int
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"msg": "No autorizado"}), 401
    return jsonify(user.to_dict())
