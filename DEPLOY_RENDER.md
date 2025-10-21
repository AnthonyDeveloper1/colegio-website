# 🚀 Guía de Deployment en Render.com

## 📋 Pre-requisitos

1. ✅ Cuenta en GitHub (tu código debe estar en un repo)
2. ✅ Cuenta en Render.com (gratis): https://render.com/
3. ✅ Cuenta en Cloudinary (para uploads): https://cloudinary.com/

---

## 🎯 MÉTODO 1: Deploy Automático con Blueprint (RECOMENDADO)

### **Paso 1: Subir código a GitHub**

```bash
# Si aún NO tienes repo en GitHub:
cd C:\Users\Antony\Desktop\website
git init
git add .
git commit -m "Preparado para deploy en Render"

# Crear repo en GitHub y conectar:
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### **Paso 2: Conectar Render con GitHub**

1. Ve a https://render.com/
2. Click en **"Sign Up"** (o "Log In" si ya tienes cuenta)
3. Selecciona **"GitHub"** para autenticarte
4. Autoriza Render para acceder a tus repos

### **Paso 3: Deploy con Blueprint**

1. En Render Dashboard, click **"New +"** → **"Blueprint"**
2. Selecciona tu repositorio: `TU_USUARIO/TU_REPO`
3. Render detectará automáticamente el archivo `render.yaml`
4. Click en **"Apply"**

### **Paso 4: Configurar Variables de Entorno**

Render creará 3 servicios automáticamente:
- ✅ `colegio-api` (Backend)
- ✅ `colegio-web` (Frontend)  
- ✅ `colegio-db` (Database)

**Configurar Backend (`colegio-api`):**

1. Click en el servicio `colegio-api`
2. Ve a **"Environment"** en el menú lateral
3. Agrega/edita estas variables:

```env
FLASK_ENV=production
FLASK_DEBUG=0
JWT_SECRET_KEY=[Auto-generado]
DATABASE_URL=[Auto-conectado desde colegio-db]
CORS_ORIGINS=https://colegio-web.onrender.com
UPLOAD_METHOD=cloudinary
CLOUDINARY_CLOUD_NAME=deuprdp9v
CLOUDINARY_API_KEY=tu_api_key_de_cloudinary
CLOUDINARY_API_SECRET=tu_api_secret_de_cloudinary
```

**Configurar Frontend (`colegio-web`):**

1. Click en el servicio `colegio-web`
2. Ve a **"Environment"**
3. Agrega estas variables:

```env
NEXT_PUBLIC_API_URL=https://colegio-api.onrender.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=deuprdp9v
NODE_ENV=production
```

4. Click en **"Save Changes"**

### **Paso 5: Deploy Inicial**

1. Los servicios comenzarán a deployarse automáticamente
2. Espera ~5-8 minutos (primera vez)
3. Verás logs en tiempo real

**Orden de deploy:**
1. `colegio-db` → Crea base de datos (1-2 min)
2. `colegio-api` → Instala Python deps y arranca (3-4 min)
3. `colegio-web` → Build Next.js y arranca (4-5 min)

### **Paso 6: Inicializar Base de Datos**

Una vez que `colegio-api` esté **"Live"**:

**Opción A: Desde Shell de Render**

1. En `colegio-api`, click **"Shell"** (terminal)
2. Ejecuta:

```bash
# Crear tablas
flask db upgrade

# Crear admin inicial
python scripts/seed_admin.py
```

**Opción B: Conectar desde tu PC**

1. En `colegio-db`, copia **"External Database URL"**
2. En tu terminal local:

```bash
cd api
$env:DATABASE_URL="postgresql://..." # En PowerShell
flask db upgrade
python scripts/seed_admin.py
```

### **Paso 7: Verificar Deploy**

1. **Backend:** https://colegio-api.onrender.com/api/health
   - Debería responder: `{"status": "healthy"}`

2. **Frontend:** https://colegio-web.onrender.com
   - Debería cargar la página principal

3. **Login:** https://colegio-web.onrender.com/login
   - Email: `admin@iejaqg.edu.pe`
   - Password: `admin123`

---

## 🎯 MÉTODO 2: Deploy Manual (Sin Blueprint)

### **Paso 1: Crear Database**

1. En Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configuración:
   - **Name:** `colegio-db`
   - **Database:** `colegio_db`
   - **Region:** Oregon (o el más cercano)
   - **Plan:** Free
3. Click **"Create Database"**
4. Espera 1-2 minutos
5. Copia **"Internal Database URL"**

### **Paso 2: Crear Backend**

1. Click **"New +"** → **"Web Service"**
2. Conecta tu repositorio GitHub
3. Configuración:
   - **Name:** `colegio-api`
   - **Region:** Oregon
   - **Branch:** main
   - **Root Directory:** `api`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2`
   - **Plan:** Free

4. **Environment Variables:**
   ```env
   FLASK_ENV=production
   JWT_SECRET_KEY=genera_uno_aleatorio_aqui
   DATABASE_URL=postgresql://user:pass@... (la que copiaste)
   CORS_ORIGINS=https://colegio-web.onrender.com
   UPLOAD_METHOD=cloudinary
   CLOUDINARY_CLOUD_NAME=deuprdp9v
   CLOUDINARY_API_KEY=tu_key
   CLOUDINARY_API_SECRET=tu_secret
   ```

5. Click **"Create Web Service"**

### **Paso 3: Crear Frontend**

1. Click **"New +"** → **"Web Service"**
2. Mismo repositorio GitHub
3. Configuración:
   - **Name:** `colegio-web`
   - **Region:** Oregon
   - **Branch:** main
   - **Root Directory:** `web`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://colegio-api.onrender.com/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=deuprdp9v
   NODE_ENV=production
   ```

5. Click **"Create Web Service"**

### **Paso 4: Inicializar DB** (igual que Método 1)

---

## 🔧 Configuración de Cloudinary

### **Obtener credenciales:**

1. Ve a https://cloudinary.com/
2. Regístrate gratis
3. En Dashboard, copia:
   - **Cloud Name:** `deuprdp9v` (ya lo tienes)
   - **API Key:** `12345...`
   - **API Secret:** `abc123...`

### **Configurar en Render:**

Agrega estas variables en `colegio-api`:
```env
UPLOAD_METHOD=cloudinary
CLOUDINARY_CLOUD_NAME=deuprdp9v
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

---

## 🔄 Updates Automáticos

**Cada vez que hagas push a GitHub:**

```bash
git add .
git commit -m "Actualización"
git push origin main
```

**Render automáticamente:**
1. Detecta el cambio
2. Hace nuevo build
3. Despliega la nueva versión
4. Zero-downtime deploy

---

## 🐛 Troubleshooting

### **Error: Build failed**
- Revisa logs en Render
- Verifica que `requirements.txt` / `package.json` estén correctos
- Asegúrate que la rama sea `main`

### **Error: Database connection**
- Verifica que `DATABASE_URL` esté configurado
- Debe usar la URL **Internal** (no External)
- Formato: `postgresql://user:pass@host/db`

### **Error: CORS**
- Verifica `CORS_ORIGINS` en backend
- Debe incluir la URL exacta del frontend
- Ejemplo: `https://colegio-web.onrender.com`

### **Error: Frontend no conecta con API**
- Verifica `NEXT_PUBLIC_API_URL` en frontend
- Debe apuntar a: `https://colegio-api.onrender.com/api`
- ⚠️ Debe empezar con `NEXT_PUBLIC_` para ser visible en el cliente

### **Error: Images not loading**
- Verifica credenciales de Cloudinary
- Asegúrate que `UPLOAD_METHOD=cloudinary`
- Revisa que las imágenes se suban a Cloudinary, no localmente

---

## 💰 Límites del Plan Free

- ⏰ **750 horas/mes** por servicio (suficiente para 1 web + 1 api)
- 🐌 **Sleep después de 15 min inactivos** (primer request tarda ~30s)
- 💾 **1GB de PostgreSQL** (suficiente para miles de publicaciones)
- 🌐 **100GB de bandwidth/mes**
- ⚠️ **Los servicios free se duermen** (si no hay tráfico)

**Mantener activo (opcional):**
- Usa UptimeRobot (gratis) para hacer ping cada 5 min
- https://uptimerobot.com/

---

## 🎓 Recursos

- 📖 Documentación Render: https://render.com/docs
- 💬 Soporte: https://render.com/support
- 🎥 Video Tutorial: https://www.youtube.com/watch?v=bnCOyGaSe84

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] Cuenta Render creada
- [ ] Cuenta Cloudinary configurada
- [ ] Blueprint aplicado (o servicios creados manualmente)
- [ ] Variables de entorno configuradas
- [ ] Database inicializada (`flask db upgrade`)
- [ ] Admin creado (`seed_admin.py`)
- [ ] Backend health check OK: `/api/health`
- [ ] Frontend cargando correctamente
- [ ] Login funcionando
- [ ] Upload de imágenes a Cloudinary OK

---

**🎉 ¡Listo! Tu sitio está en producción.**

URLs finales:
- 🌐 **Frontend:** https://colegio-web.onrender.com
- 🔧 **Backend:** https://colegio-api.onrender.com/api
- 🗄️ **Database:** (solo acceso interno)
