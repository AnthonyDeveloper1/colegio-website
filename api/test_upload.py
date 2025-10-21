"""
Test del endpoint de upload
Prueba subida de imágenes y videos a Cloudinary
"""
import requests
import os
from io import BytesIO
import base64

# ============================
# CONFIGURACIÓN
# ============================
API_URL = "http://localhost:5000/api"
LOGIN_URL = f"{API_URL}/administracion/login"
UPLOAD_URL = f"{API_URL}/upload/image"

# Credenciales admin
ADMIN_EMAIL = "admin@colegio.edu"
ADMIN_PASSWORD = "admin123"


# ============================
# FUNCIONES AUXILIARES
# ============================

def login():
    """Obtener token JWT"""
    print("\n1️⃣  Obteniendo token JWT...")
    response = requests.post(LOGIN_URL, json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("   ✅ Token obtenido exitosamente")
        return token
    else:
        print(f"   ❌ Error en login: {response.status_code}")
        print(f"   {response.text}")
        return None


def create_test_image(filename="test.jpg"):
    """Crea una imagen de prueba en memoria (1x1 pixel PNG)"""
    # PNG transparente de 1x1 pixel (el más pequeño posible)
    # Este es un PNG válido codificado en base64
    png_data = base64.b64decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    )
    
    img_bytes = BytesIO(png_data)
    return img_bytes, filename


def test_upload_image(token, format_name, format_ext):
    """Prueba subir una imagen de un formato específico"""
    print(f"\n2️⃣  Probando upload de imagen {format_name.upper()}...")
    
    # Crear imagen de prueba
    img_bytes, _ = create_test_image()
    filename = f"test_image.{format_ext}"
    
    # Preparar multipart/form-data
    files = {
        'file': (filename, img_bytes, f'image/{format_ext}')
    }
    data = {
        'folder': 'test'
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    # Hacer request
    response = requests.post(UPLOAD_URL, files=files, data=data, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✅ {format_name.upper()} subida exitosamente")
        print(f"   📎 URL: {result['secure_url']}")
        print(f"   🆔 Public ID: {result['public_id']}")
        print(f"   📊 Tipo: {result['resource_type']}")
        print(f"   📏 Dimensiones: {result.get('width')}x{result.get('height')}")
        return result
    else:
        print(f"   ❌ Error: {response.status_code}")
        print(f"   {response.json()}")
        return None


def test_upload_video(token):
    """Prueba subir un video (simulado)"""
    print(f"\n3️⃣  Probando upload de video MP4...")
    
    # Crear un archivo MP4 fake (solo para test de extensión)
    # En producción esto sería un video real
    video_bytes = BytesIO(b'fake video content for testing')
    filename = "test_video.mp4"
    
    files = {
        'file': (filename, video_bytes, 'video/mp4')
    }
    data = {
        'folder': 'test'
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.post(UPLOAD_URL, files=files, data=data, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✅ Video subido exitosamente")
        print(f"   📎 URL: {result['secure_url']}")
        print(f"   🆔 Public ID: {result['public_id']}")
        print(f"   📊 Tipo: {result['resource_type']}")
        return result
    else:
        print(f"   ❌ Error: {response.status_code}")
        print(f"   {response.json()}")
        return None


def test_invalid_format(token):
    """Prueba subir un formato no permitido"""
    print(f"\n4️⃣  Probando formato no permitido (.txt)...")
    
    file_bytes = BytesIO(b'This is a text file')
    filename = "test.txt"
    
    files = {
        'file': (filename, file_bytes, 'text/plain')
    }
    data = {
        'folder': 'test'
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    response = requests.post(UPLOAD_URL, files=files, data=data, headers=headers)
    
    if response.status_code == 400:
        result = response.json()
        print(f"   ✅ Rechazado correctamente")
        print(f"   📝 Mensaje: {result['msg']}")
        print(f"   📋 Formatos permitidos:")
        print(f"      Imágenes: {', '.join(result['allowed_formats']['images'])}")
        print(f"      Videos: {', '.join(result['allowed_formats']['videos'])}")
        return True
    else:
        print(f"   ❌ Error: debería rechazar formato .txt")
        return False


def test_no_auth():
    """Prueba acceso sin token"""
    print(f"\n5️⃣  Probando acceso sin autenticación...")
    
    img_bytes, filename = create_test_image()
    files = {
        'file': (filename, img_bytes, 'image/jpeg')
    }
    
    response = requests.post(UPLOAD_URL, files=files)
    
    if response.status_code == 401:
        print(f"   ✅ Rechazado correctamente (401 Unauthorized)")
        return True
    else:
        print(f"   ❌ Error: debería requerir autenticación")
        return False


# ============================
# TEST SUITE COMPLETO
# ============================

def main():
    print("=" * 60)
    print("🧪 TEST SUITE - UPLOAD ENDPOINT")
    print("=" * 60)
    
    # Login
    token = login()
    if not token:
        print("\n❌ No se pudo obtener token. Abortando tests.")
        return
    
    # Test 1: Upload PNG (usando imagen real)
    test_upload_image(token, "PNG", "png")
    
    # Test 2: Upload JPG (usando imagen PNG con extensión .jpg para probar)
    test_upload_image(token, "JPG", "jpg")
    
    # Test 4: Upload video (comentado porque necesita video real)
    # test_upload_video(token)
    print(f"\n3️⃣  Upload de video OMITIDO (requiere archivo real)")
    
    # Test 5: Formato inválido
    test_invalid_format(token)
    
    # Test 6: Sin autenticación
    test_no_auth()
    
    print("\n" + "=" * 60)
    print("✅ TESTS COMPLETADOS")
    print("=" * 60)
    print("\n📋 FORMATOS SOPORTADOS:")
    print("   🖼️  Imágenes: png, jpg, jpeg, gif, webp, svg, bmp, tiff")
    print("   🎬 Videos: mp4, mov, avi, mkv, webm, flv, wmv")
    print("\n📦 RECURSOS:")
    print("   - Cloudinary detecta automáticamente el tipo (imagen/video)")
    print("   - resource_type='auto' en el backend")
    print("   - URLs seguras con HTTPS")
    print("   - CDN global de Cloudinary")
    print("=" * 60)


if __name__ == "__main__":
    main()
