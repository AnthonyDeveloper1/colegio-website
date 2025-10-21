"""
Dashboard Routes
Endpoints para el dashboard del admin con estadísticas
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.publication import Publication
from models.category import Category
from models.gallery_item import GalleryItem
from models.contact_message import ContactMessage
from models.user import User

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """
    GET /api/dashboard/stats
    Obtiene estadísticas generales para el dashboard
    """
    try:
        # Contar registros en cada tabla
        stats = {
            'publications': Publication.query.count(),
            'categories': Category.query.count(),
            'gallery': GalleryItem.query.count(),
            'messages': ContactMessage.query.filter_by(leido=False).count(),  # Solo no leídos
            'total_messages': ContactMessage.query.count(),
            'users': User.query.count(),
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'msg': f'Error al obtener estadísticas: {str(e)}'}), 500


@bp.route('/recent', methods=['GET'])
@jwt_required()
def get_recent():
    """
    GET /api/dashboard/recent
    Obtiene publicaciones y mensajes recientes
    """
    try:
        # Últimas 5 publicaciones
        recent_publications = Publication.query\
            .order_by(Publication.created_at.desc())\
            .limit(5)\
            .all()
        
        # Últimos 5 mensajes
        recent_messages = ContactMessage.query\
            .order_by(ContactMessage.created_at.desc())\
            .limit(5)\
            .all()
        
        return jsonify({
            'publications': [pub.to_dict() for pub in recent_publications],
            'messages': [msg.to_dict() for msg in recent_messages]
        }), 200
        
    except Exception as e:
        return jsonify({'msg': f'Error al obtener datos recientes: {str(e)}'}), 500
