# Dockerfile para API Flask
# Imagen base: Python 3.10 slim (ligera, sin paquetes extra)
# Instala dependencias Python y ejecuta con Gunicorn (producción)

FROM python:3.10-slim

WORKDIR /app

# Instalar curl para health checks de Docker Compose
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente de la app
COPY . /app

# Variable de entorno para Flask
ENV FLASK_APP=app.py

# Comando de inicio: Gunicorn con 4 workers (cambiar workers según CPU/carga)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "app:create_app()"]
