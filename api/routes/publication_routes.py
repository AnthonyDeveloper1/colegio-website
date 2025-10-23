"""
Rutas API para Publicaciones (posts, artículos, noticias)
Endpoints: GET /api/publicaciones (con paginación)
CRUD completo disponible (GET by id, POST, PUT, DELETE)

Permisos:
- GET (list, detail): Público
- POST, PUT, DELETE: Solo admins (@admin_required)
"""
from flask import Blueprint, request, jsonify
from extensions import db
from models.publication import Publication
from utils.decorators import admin_required, public_endpoint

bp = Blueprint("publications", __name__, url_prefix="/api/publicaciones")


@bp.route("", methods=["GET"])
def list_publications():
    """GET /api/publicaciones - Lista publicaciones con paginación (solo publicadas para público)"""
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))
    q = request.args.get("q")
    category_id = request.args.get("category_id")
    status = request.args.get("status")  # Nuevo: filtro por status
    
    # Solo mostrar publicadas por defecto (público)
    # Si se pasa status explícitamente, respetar ese filtro (para admin)
    query = Publication.query
    
    if status:
        # Filtro específico (para admin)
        query = query.filter(Publication.status == status)
    else:
        # Por defecto: solo publicadas (para público)
        query = query.filter(Publication.status == "Publicado")

    if q:
        query = query.filter(Publication.title.ilike(f"%{q}%"))

    if category_id:
        try:
            category_id_int = int(category_id)
            query = query.filter(Publication.category_id == category_id_int)
        except ValueError:
            pass  # Ignore invalid category_id

    # Ordenar por fecha de publicación descendente
    query = query.order_by(Publication.published_at.desc(), Publication.created_at.desc())

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    items = [
        {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "excerpt": p.excerpt,
            "author_id": p.author_id,
            "category_id": p.category_id,
            "image_url": p.image_url,
            "status": p.status,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in pagination.items
    ]
    return jsonify({"items": items, "total": pagination.total, "page": page, "per_page": per_page})


@bp.route("/<int:pub_id>", methods=["GET"])
def get_publication(pub_id):
    """GET /api/publicaciones/<id> - Obtiene una publicación por ID"""
    pub = Publication.query.get_or_404(pub_id)
    data = {
        "id": pub.id,
        "title": pub.title,
        "slug": pub.slug,
        "content": pub.content,
        "excerpt": pub.excerpt,
        "author_id": pub.author_id,
        "category_id": pub.category_id,
        "image_url": pub.image_url,
        "created_at": pub.created_at.isoformat() if pub.created_at else None,
        "updated_at": pub.updated_at.isoformat() if pub.updated_at else None
    }
    return jsonify(data)


@bp.route("", methods=["POST"])
@admin_required
def create_publication(current_user):
    """POST /api/publicaciones - Crea una nueva publicación (solo admins)"""
    data = request.json or {}
    
    # Validaciones
    title = data.get("title")
    content = data.get("content")
    
    if not title or not content:
        return jsonify({"msg": "title y content son requeridos"}), 400
    
    # Usar el ID del usuario autenticado como autor
    author_id = current_user.id
    
    # Crear publicación
    pub = Publication(
        title=title,
        slug=data.get("slug", title.lower().replace(" ", "-")),
        content=content,
        excerpt=data.get("excerpt"),
        author_id=author_id,
        category_id=data.get("category_id"),
        image_url=data.get("image_url")
    )
    
    db.session.add(pub)
    db.session.commit()
    
    return jsonify({
        "id": pub.id,
        "title": pub.title,
        "slug": pub.slug,
        "msg": "publicación creada"
    }), 201


@bp.route("/<int:pub_id>", methods=["PUT"])
@admin_required
def update_publication(current_user, pub_id):
    """PUT /api/publicaciones/<id> - Actualiza una publicación (solo admins)"""
    pub = Publication.query.get_or_404(pub_id)
    data = request.json or {}
    
    # Actualizar campos si vienen en el request
    if "title" in data:
        pub.title = data["title"]
    if "slug" in data:
        pub.slug = data["slug"]
    if "content" in data:
        pub.content = data["content"]
    if "excerpt" in data:
        pub.excerpt = data["excerpt"]
    if "author_id" in data:
        pub.author_id = data["author_id"]
    if "category_id" in data:
        pub.category_id = data["category_id"]
    if "image_url" in data:
        pub.image_url = data["image_url"]
    
    db.session.commit()
    
    return jsonify({
        "id": pub.id,
        "title": pub.title,
        "slug": pub.slug,
        "msg": "publicación actualizada"
    })


@bp.route("/<int:pub_id>", methods=["DELETE"])
@admin_required
def delete_publication(current_user, pub_id):
    """DELETE /api/publicaciones/<id> - Elimina una publicación (solo admins)"""
    pub = Publication.query.get_or_404(pub_id)
    db.session.delete(pub)
    db.session.commit()
    return jsonify({"msg": "publicación eliminada"})
