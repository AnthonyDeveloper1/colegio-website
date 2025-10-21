from datetime import datetime
from extensions import db


class Comment(db.Model):
    __tablename__ = "comentarios"
    id = db.Column(db.Integer, primary_key=True)
    publication_id = db.Column(db.Integer, db.ForeignKey("publicaciones.id"))
    name = db.Column(db.String(150))
    email = db.Column(db.String(200))
    content = db.Column(db.Text)
    approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
