"""
Modelo Category (Categorías para publicaciones)
Tabla: categorias
Permite clasificar publicaciones (ej: Noticias, Eventos, Anuncios)
"""
from extensions import db


class Category(db.Model):
    """Modelo de categoría para organizar publicaciones"""
    __tablename__ = "categorias"
    
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)  # URL-friendly ID (ej: noticias)
    name = db.Column(db.String(150), nullable=False)  # Nombre mostrado (ej: Noticias)
    description = db.Column(db.String(500))  # Descripción opcional
