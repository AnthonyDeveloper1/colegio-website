# Sitio institucional - Proyecto (React frontend + Flask backend + PostgreSQL)

Esta plantilla contiene una base reproducible para un sitio institucional dividido en dos carpetas principales:

- `api/` (backend Flask)
- `web/` (frontend React)

Objetivo
--------
Proveer una base reproducible (Docker + docker-compose) con:

- Autenticación JWT para el área administrativa
- Publicaciones, galería y contacto (modelos y rutas sugeridas)
- Scripts iniciales (seed admin)

Archivos añadidos por esta entrega
---------------------------------

- `docker-compose.yml` - Orquesta PostgreSQL, API y frontend (desarrollo)
- `api/Dockerfile` - Dockerfile para el backend Flask
- `web/Dockerfile` - Dockerfile para el frontend React
- `api/requirements.txt` - dependencias mínimas para la API
- `api/scripts/seed_admin.py` - script para crear un admin inicial en la BD
- `.env.example` - variables de entorno de ejemplo

Cómo empezar (desarrollo local)
--------------------------------

1. Copia el `.env.example` a `.env` y ajusta las variables de entorno según tu entorno.

2. Levantar todo con Docker Compose (recomendado):

```powershell
docker-compose up --build
```

3. Backend

- La API estará disponible en `http://localhost:5000` (prefijo `/api` según configuración).
- Para seed del admin (ejemplo):

```powershell
# desde la carpeta api
python .\scripts\seed_admin.py --db-url "postgresql://root:root@db:5432/colegio_db" --email admin@example.com --password secret
```

4. Frontend

- La app React estará en `http://localhost:3000`.

Siguientes pasos sugeridos
-------------------------

- Copiar los modelos y rutas del documento técnico al directorio `api/`.
- Añadir un `Dockerfile`/config de producción (gunicorn + nginx) si se desplegará a producción.
- Implementar tests básicos (pytest) para auth y publicaciones.

Notas
-----
Estos archivos son una base inicial; adapta nombres de host/puertos, credenciales y políticas de seguridad (cookies httpOnly, refresh tokens) según tu necesidad.
