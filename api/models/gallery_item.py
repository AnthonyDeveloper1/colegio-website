"""
Modelo GalleryItem (Galería de imágenes/videos)
Tabla: galeria
Almacena items multimedia organizados por categoría
"""
from datetime import datetime
from extensions import db


class GalleryItem(db.Model):
    """Modelo de item de galería (fotos, videos)"""
    __tablename__ = "galeria"
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))  # Título del item
    url = db.Column(db.String(500))  # URL de la imagen/video
    caption = db.Column(db.String(500))  # Descripción/pie de foto
    category = db.Column(db.String(120))  # Categoría de galería (ej: eventos, instalaciones)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Fecha de subida
