"""
Upload Routes
Endpoints para subir archivos (imágenes y videos) a Cloudinary
"""
from flask import Blueprint, request, jsonify
from utils.decorators import admin_required
from utils.upload import (
    upload_to_cloudinary, 
    allowed_file, 
    ALLOWED_IMAGE_EXTENSIONS, 
    ALLOWED_VIDEO_EXTENSIONS
)

bp = Blueprint('upload', __name__, url_prefix='/api/upload')


@bp.route('/image', methods=['POST'])
@admin_required
def upload_image(current_user):
    """
    POST /api/upload/image
    Sube una imagen o video a Cloudinary
    
    Formatos soportados:
    - Imágenes: png, jpg, jpeg, gif, webp, svg, bmp, tiff
    - Videos: mp4, mov, avi, mkv, webm, flv, wmv
    
    Form Data:
    - file: archivo a subir
    - folder: carpeta en Cloudinary (opcional, default: publicaciones)
    
    Returns:
    - url: URL del archivo
    - secure_url: URL segura (HTTPS)
    - public_id: ID único en Cloudinary
    - resource_type: "image" o "video"
    - format: formato del archivo
    - width/height: dimensiones (solo imágenes)
    """
    # Verificar que hay archivo
    if 'file' not in request.files:
        return jsonify({'msg': 'No se envió ningún archivo'}), 400
    
    file = request.files['file']
    
    # Verificar que se seleccionó un archivo
    if file.filename == '':
        return jsonify({'msg': 'No se seleccionó ningún archivo'}), 400
    
    # Verificar extensión permitida
    if not allowed_file(file.filename):
        allowed = ', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS))
        return jsonify({
            'msg': f'Tipo de archivo no permitido',
            'allowed_formats': {
                'images': list(sorted(ALLOWED_IMAGE_EXTENSIONS)),
                'videos': list(sorted(ALLOWED_VIDEO_EXTENSIONS))
            }
        }), 400
    
    try:
        # Obtener folder del form data (opcional)
        folder = request.form.get('folder', 'publicaciones')
        
        # Subir a Cloudinary (detecta automáticamente si es imagen o video)
        result = upload_to_cloudinary(file, folder=folder)
        
        return jsonify({
            'url': result['url'],
            'secure_url': result['secure_url'],
            'public_id': result['public_id'],
            'resource_type': result.get('resource_type', 'image'),
            'format': result.get('format'),
            'width': result.get('width'),
            'height': result.get('height'),
            'msg': f'{result.get("resource_type", "Archivo").capitalize()} subido exitosamente'
        }), 200
        
    except Exception as e:
        return jsonify({'msg': f'Error al subir archivo: {str(e)}'}), 500
