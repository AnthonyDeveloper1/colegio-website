"""
Modelo Publication (Publicaciones/Posts del sitio)
Tabla: publicaciones
Almacena artículos, noticias, eventos con autor y categoría
"""
from datetime import datetime
from extensions import db


class Publication(db.Model):
    """Modelo de publicación (posts, artículos, noticias)"""
    __tablename__ = "publicaciones"
    
    # Campos principales
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)  # Título de la publicación
    slug = db.Column(db.String(300), unique=True, nullable=False, index=True)  # URL-friendly (ej: mi-noticia-2025)
    excerpt = db.Column(db.String(500))  # Resumen corto
    content = db.Column(db.Text)  # Contenido completo (HTML/Markdown)
    status = db.Column(db.String(50), default="Publicado")  # Estado: Borrador, Publicado, Archivado
    published_at = db.Column(db.DateTime)  # Fecha de publicación
    
    # Relaciones (FK)
    author_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"))  # Autor de la publicación
    category_id = db.Column(db.Integer, db.ForeignKey("categorias.id"))  # Categoría
    
    # Multimedia
    image_url = db.Column(db.String(500))  # Imagen destacada (URL)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones ORM
    author = db.relationship("User", backref="publicaciones")  # publication.author → User
    category = db.relationship("Category", backref="publicaciones")  # publication.category → Category

    def to_dict(self):
        """Serializar publicación a diccionario para JSON"""
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "excerpt": self.excerpt,
            "content": self.content,
            "status": self.status,
            "image_url": self.image_url,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "author_id": self.author_id,
            "category_id": self.category_id,
            "author": {
                "id": self.author.id,
                "name": self.author.name,
                "email": self.author.email
            } if self.author else None,
            "category": {
                "id": self.category.id,
                "name": self.category.name
            } if self.category else None
        }
