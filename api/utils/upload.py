"""
Utilidades para upload de archivos (imágenes/videos)
Soporta Cloudinary (servicio externo) y filesystem local
"""
import os
from werkzeug.utils import secure_filename
from flask import current_app

# Extensiones permitidas para imágenes y videos
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'tiff'}
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'}
ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS


def allowed_file(filename):
    """Verifica si la extensión del archivo está permitida"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ==============================================
# OPCIÓN 1: CLOUDINARY (Servicio Externo - CDN)
# ==============================================

def upload_to_cloudinary(file, folder="colegio"):
    """
    Sube archivo a Cloudinary (servicio cloud con CDN)
    
    Ventajas:
    - CDN global (carga rápida desde cualquier país)
    - Transformaciones automáticas (resize, crop, optimize)
    - Backups automáticos
    - No consume espacio en tu servidor
    
    Args:
        file: archivo de Flask request.files
        folder: carpeta en Cloudinary (ej: "galeria", "publicaciones")
    
    Returns:
        dict con url, public_id, width, height
    """
    try:
        import cloudinary
        import cloudinary.uploader
        
        # Configurar Cloudinary con variables de entorno
        cloudinary.config(
            cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
            api_key=os.environ.get("CLOUDINARY_API_KEY"),
            api_secret=os.environ.get("CLOUDINARY_API_SECRET")
        )
        
        # Upload con opciones
        result = cloudinary.uploader.upload(
            file,
            folder=folder,  # Organizar en carpetas
            resource_type="auto",  # Detecta si es imagen o video
            transformation=[
                {"quality": "auto"},  # Optimización automática
                {"fetch_format": "auto"}  # Formato óptimo (WebP si el navegador lo soporta)
            ]
        )
        
        return {
            "url": result.get("url", ""),  # URL HTTP del archivo
            "secure_url": result.get("secure_url", ""),  # URL HTTPS del archivo
            "public_id": result.get("public_id", ""),  # ID para eliminar después
            "width": result.get("width"),
            "height": result.get("height"),
            "format": result.get("format"),
            "resource_type": result.get("resource_type", "image")  # image o video
        }
        
    except ImportError:
        raise Exception("cloudinary no instalado. Ejecuta: pip install cloudinary")
    except Exception as e:
        raise Exception(f"Error subiendo a Cloudinary: {str(e)}")


def delete_from_cloudinary(public_id):
    """
    Elimina archivo de Cloudinary
    
    Args:
        public_id: ID del archivo en Cloudinary
    """
    try:
        import cloudinary
        import cloudinary.uploader
        
        cloudinary.config(
            cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
            api_key=os.environ.get("CLOUDINARY_API_KEY"),
            api_secret=os.environ.get("CLOUDINARY_API_SECRET")
        )
        
        result = cloudinary.uploader.destroy(public_id)
        return result
        
    except Exception as e:
        raise Exception(f"Error eliminando de Cloudinary: {str(e)}")


# ==============================================
# OPCIÓN 2: FILESYSTEM LOCAL (Servidor)
# ==============================================

def upload_to_local(file, subfolder="galeria"):
    """
    Sube archivo al filesystem del servidor
    
    Ventajas:
    - Gratis (usa tu propio servidor)
    - Control total sobre los archivos
    - Sin dependencias externas
    
    Desventajas:
    - Consume espacio en disco
    - Sin CDN (carga más lenta)
    - Backups manuales
    
    Args:
        file: archivo de Flask request.files
        subfolder: subcarpeta dentro de uploads/ (ej: "galeria", "publicaciones")
    
    Returns:
        dict con url, filename, path
    """
    if not file or file.filename == '':
        raise ValueError("No se proporcionó archivo")
    
    if not allowed_file(file.filename):
        raise ValueError(f"Tipo de archivo no permitido. Usa: {ALLOWED_EXTENSIONS}")
    
    # Sanitizar nombre del archivo
    filename = secure_filename(file.filename)
    
    # Agregar timestamp para evitar colisiones
    import time
    timestamp = int(time.time())
    name, ext = os.path.splitext(filename)
    unique_filename = f"{name}_{timestamp}{ext}"
    
    # Crear directorio si no existe
    upload_folder = os.path.join(current_app.root_path, 'uploads', subfolder)
    os.makedirs(upload_folder, exist_ok=True)
    
    # Guardar archivo
    filepath = os.path.join(upload_folder, unique_filename)
    file.save(filepath)
    
    # URL relativa para servir el archivo
    relative_url = f"/uploads/{subfolder}/{unique_filename}"
    
    return {
        "url": relative_url,
        "filename": unique_filename,
        "path": filepath
    }


def delete_from_local(filepath):
    """
    Elimina archivo del filesystem local
    
    Args:
        filepath: ruta completa al archivo
    """
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            return {"success": True}
        else:
            return {"success": False, "msg": "Archivo no encontrado"}
    except Exception as e:
        raise Exception(f"Error eliminando archivo local: {str(e)}")
