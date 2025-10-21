"""
Rutas API para Galería (imágenes y videos)
Endpoints: GET /api/galeria, POST /api/galeria (con upload), PUT/DELETE /api/galeria/<id>
Soporta Cloudinary (CDN) y almacenamiento local

Permisos:
- GET (list, detail): Público
- POST, PUT, DELETE: Solo admins (@admin_required)
"""
from flask import Blueprint, request, jsonify
from extensions import db
from models.gallery_item import GalleryItem
from utils.decorators import admin_required, public_endpoint
import os

bp = Blueprint("galeria", __name__, url_prefix="/api/galeria")

# Método de upload configurado por variable de entorno
UPLOAD_METHOD = os.environ.get("UPLOAD_METHOD", "local")  # "cloudinary" o "local"


@bp.route("", methods=["GET"])
def list_galeria():
    """GET /api/galeria - Lista todos los items de galería"""
    items = GalleryItem.query.all()
    data = [
        {
            "id": g.id,
            "title": g.title,
            "url": g.url,
            "caption": g.caption,
            "category": g.category,
            "created_at": g.created_at.isoformat() if g.created_at else None
        }
        for g in items
    ]
    return jsonify(data)


@bp.route("/<int:item_id>", methods=["GET"])
def get_galeria_item(item_id):
    """GET /api/galeria/<id> - Obtiene un item de galería por ID"""
    item = GalleryItem.query.get_or_404(item_id)
    data = {
        "id": item.id,
        "title": item.title,
        "url": item.url,
        "caption": item.caption,
        "category": item.category,
        "created_at": item.created_at.isoformat() if item.created_at else None
    }
    return jsonify(data)


@bp.route("", methods=["POST"])
@admin_required
def create_galeria_item():
    """
    POST /api/galeria - Crea un nuevo item de galería (requiere JWT)
    
    Soporta 2 métodos:
    1. Upload de archivo (multipart/form-data): sube imagen/video
    2. URL externa (application/json): guarda URL directa
    
    Form-data fields:
    - file: archivo a subir (requerido si no hay 'url')
    - title: título del item
    - caption: descripción
    - category: categoría (opcional)
    
    JSON fields (alternativo):
    - url: URL externa del archivo
    - title, caption, category
    """
    # CASO 1: Upload de archivo (multipart/form-data)
    if 'file' in request.files:
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"msg": "No se seleccionó archivo"}), 400
        
        try:
            # Importar upload utilities
            from utils.upload import upload_to_cloudinary, upload_to_local, allowed_file
            
            # Validar extensión
            if not allowed_file(file.filename):
                return jsonify({"msg": "Tipo de archivo no permitido. Usa: png, jpg, jpeg, gif, webp, mp4, mov, avi"}), 400
            
            # Upload según método configurado
            if UPLOAD_METHOD == "cloudinary":
                upload_result = upload_to_cloudinary(file, folder="colegio/galeria")
                url = upload_result["url"]
                metadata = {
                    "public_id": upload_result.get("public_id"),
                    "width": upload_result.get("width"),
                    "height": upload_result.get("height")
                }
            else:  # local
                upload_result = upload_to_local(file, subfolder="galeria")
                url = upload_result["url"]
                metadata = {
                    "filename": upload_result.get("filename"),
                    "path": upload_result.get("path")
                }
            
            # Crear item con datos del form
            g = GalleryItem(
                title=request.form.get("title", file.filename),
                url=url,
                caption=request.form.get("caption"),
                category=request.form.get("category")
            )
            
            db.session.add(g)
            db.session.commit()
            
            return jsonify({
                "id": g.id,
                "title": g.title,
                "url": g.url,
                "upload_method": UPLOAD_METHOD,
                "metadata": metadata,
                "msg": "item de galería creado con upload"
            }), 201
            
        except ValueError as e:
            return jsonify({"msg": str(e)}), 400
        except Exception as e:
            return jsonify({"msg": f"Error subiendo archivo: {str(e)}"}), 500
    
    # CASO 2: URL externa (application/json)
    else:
        data = request.json or {}
        
        # Validaciones
        title = data.get("title")
        url = data.get("url")
        
        if not title or not url:
            return jsonify({"msg": "title y url son requeridos"}), 400
        
        # Crear item
        g = GalleryItem(
            title=title,
            url=url,
            caption=data.get("caption"),
            category=data.get("category")
        )
        
        db.session.add(g)
        db.session.commit()
        
        return jsonify({
            "id": g.id,
            "title": g.title,
            "url": g.url,
            "msg": "item de galería creado con URL externa"
        }), 201


@bp.route("/<int:item_id>", methods=["PUT"])
@admin_required
def update_galeria_item(item_id):
    """PUT /api/galeria/<id> - Actualiza un item de galería (solo admins)"""
    item = GalleryItem.query.get_or_404(item_id)
    data = request.json or {}
    
    # Actualizar campos si vienen en el request
    if "title" in data:
        item.title = data["title"]
    if "url" in data:
        item.url = data["url"]
    if "caption" in data:
        item.caption = data["caption"]
    if "category" in data:
        item.category = data["category"]
    
    db.session.commit()
    
    return jsonify({
        "id": item.id,
        "title": item.title,
        "url": item.url,
        "msg": "item de galería actualizado"
    })


@bp.route("/<int:item_id>", methods=["DELETE"])
@admin_required
def delete_galeria_item(item_id):
    """
    DELETE /api/galeria/<id> - Elimina un item de galería (solo admins)
    
    Si el archivo fue subido al servidor (no es URL externa),
    también elimina el archivo físico
    """
    item = GalleryItem.query.get_or_404(item_id)
    
    # Si es archivo local (no URL externa), eliminarlo del disco
    if item.url and item.url.startswith("/uploads/"):
        try:
            from utils.upload import delete_from_local
            import os
            from flask import current_app
            
            # Construir path completo
            filepath = os.path.join(current_app.root_path, item.url.lstrip("/"))
            delete_from_local(filepath)
        except Exception as e:
            # Log error pero continúa eliminando el registro
            print(f"Warning: No se pudo eliminar archivo: {e}")
    
    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "item de galería eliminado"})
