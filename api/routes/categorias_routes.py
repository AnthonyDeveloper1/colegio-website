"""
Rutas API para Categorías (clasificación de publicaciones)
Endpoints: GET /api/categorias, POST /api/categorias, PUT/DELETE /api/categorias/<id>

Permisos:
- GET (list, detail): Público
- POST, PUT, DELETE: Solo admins (@admin_required)
"""
from flask import Blueprint, request, jsonify
from extensions import db
from models.category import Category
from utils.decorators import admin_required, public_endpoint

bp = Blueprint("categorias", __name__, url_prefix="/api/categorias")


@bp.route("", methods=["GET"])
def list_categorias():
    """GET /api/categorias - Lista todas las categorías"""
    items = Category.query.all()
    data = [
        {
            "id": c.id,
            "slug": c.slug,
            "name": c.name,
            "description": c.description
        }
        for c in items
    ]
    return jsonify(data)


@bp.route("/<int:cat_id>", methods=["GET"])
def get_categoria(cat_id):
    """GET /api/categorias/<id> - Obtiene una categoría por ID"""
    cat = Category.query.get_or_404(cat_id)
    data = {
        "id": cat.id,
        "slug": cat.slug,
        "name": cat.name,
        "description": cat.description
    }
    return jsonify(data)


@bp.route("", methods=["POST"])
@admin_required
def create_categoria():
    """POST /api/categorias - Crea una nueva categoría (requiere JWT)"""
    data = request.json or {}
    slug = data.get("slug")
    name = data.get("name")
    
    # Validaciones
    if not slug or not name:
        return jsonify({"msg": "slug y name son requeridos"}), 400
    
    # Verificar slug único
    if Category.query.filter_by(slug=slug).first():
        return jsonify({"msg": "slug ya existe"}), 400
    
    # Crear categoría
    c = Category(
        slug=slug,
        name=name,
        description=data.get("description")
    )
    db.session.add(c)
    db.session.commit()
    
    return jsonify({
        "id": c.id,
        "slug": c.slug,
        "name": c.name,
        "msg": "categoría creada"
    }), 201


@bp.route("/<int:cat_id>", methods=["PUT"])
@admin_required
def update_categoria(cat_id):
    """PUT /api/categorias/<id> - Actualiza una categoría (requiere JWT)"""
    cat = Category.query.get_or_404(cat_id)
    data = request.json or {}
    
    # Actualizar campos si vienen en el request
    if "slug" in data:
        # Verificar que el nuevo slug no esté en uso (excepto por esta categoría)
        if data["slug"] != cat.slug and Category.query.filter_by(slug=data["slug"]).first():
            return jsonify({"msg": "slug ya existe"}), 400
        cat.slug = data["slug"]
    
    if "name" in data:
        cat.name = data["name"]
    
    if "description" in data:
        cat.description = data["description"]
    
    db.session.commit()
    
    return jsonify({
        "id": cat.id,
        "slug": cat.slug,
        "name": cat.name,
        "msg": "categoría actualizada"
    })


@bp.route("/<int:cat_id>", methods=["DELETE"])
@admin_required
def delete_categoria(cat_id):
    """DELETE /api/categorias/<id> - Elimina una categoría (requiere JWT)"""
    cat = Category.query.get_or_404(cat_id)
    db.session.delete(cat)
    db.session.commit()
    return jsonify({"msg": "categoría eliminada"})
