"""
Test endpoint para verificar creación de categoría sin JWT
"""
from flask import Blueprint, request, jsonify
from extensions import db
from models.category import Category

bp = Blueprint("test", __name__, url_prefix="/api/test")


@bp.route("/categorias", methods=["POST"])
def test_create_categoria():
    """POST /api/test/categorias - Crear categoría SIN JWT (solo prueba)"""
    data = request.json or {}
    slug = data.get("slug")
    name = data.get("name")
    
    if not slug or not name:
        return jsonify({"msg": "slug y name son requeridos"}), 400
    
    if Category.query.filter_by(slug=slug).first():
        return jsonify({"msg": "slug ya existe"}), 400
    
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
        "msg": "categoría creada (TEST)"
    }), 201
