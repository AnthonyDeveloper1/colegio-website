# ✅ CHECKLIST DE DEPLOYMENT - RENDER.COM

## 📋 ANTES DE EMPEZAR

- [ ] Tengo cuenta en GitHub
- [ ] Tengo cuenta en Render.com (https://render.com)
- [ ] Tengo cuenta en Cloudinary (https://cloudinary.com)
- [ ] Tengo las credenciales de Cloudinary:
  - [ ] Cloud Name: `deuprdp9v`
  - [ ] API Key: `_______________`
  - [ ] API Secret: `_______________`

---

## 🔧 PREPARACIÓN DEL PROYECTO

- [ ] ✅ Código preparado (turbopack removido)
- [ ] ✅ render.yaml creado
- [ ] ✅ seed_admin.py actualizado
- [ ] Código subido a GitHub:
  ```bash
  git init
  git add .
  git commit -m "Preparado para deploy"
  git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
  git push -u origin main
  ```

---

## 🚀 DEPLOY EN RENDER

### Paso 1: Crear Servicios

- [ ] Login en Render.com
- [ ] Conectar GitHub account
- [ ] Autorizar acceso al repositorio

**OPCIÓN A: Con Blueprint (automático):**
- [ ] New + → Blueprint
- [ ] Seleccionar repositorio
- [ ] Apply Blueprint
- [ ] Esperar creación de 3 servicios

**OPCIÓN B: Manual:**
- [ ] Crear PostgreSQL Database
- [ ] Crear Web Service (Backend)
- [ ] Crear Web Service (Frontend)

### Paso 2: Configurar Variables de Entorno

**Backend (`colegio-api`):**
- [ ] `FLASK_ENV` = `production`
- [ ] `FLASK_DEBUG` = `0`
- [ ] `JWT_SECRET_KEY` = `[auto-generado o crear uno]`
- [ ] `DATABASE_URL` = `[conectar a colegio-db]`
- [ ] `CORS_ORIGINS` = `https://colegio-web.onrender.com`
- [ ] `UPLOAD_METHOD` = `cloudinary`
- [ ] `CLOUDINARY_CLOUD_NAME` = `deuprdp9v`
- [ ] `CLOUDINARY_API_KEY` = `[tu key]`
- [ ] `CLOUDINARY_API_SECRET` = `[tu secret]`

**Frontend (`colegio-web`):**
- [ ] `NEXT_PUBLIC_API_URL` = `https://colegio-api.onrender.com/api`
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = `deuprdp9v`
- [ ] `NODE_ENV` = `production`

### Paso 3: Esperar Deploy Inicial

- [ ] Database creado (1-2 min)
- [ ] Backend desplegado (3-4 min)
- [ ] Frontend desplegado (4-5 min)
- [ ] Todos los servicios muestran "Live" 🟢

### Paso 4: Inicializar Base de Datos

**En Render Shell del backend:**
- [ ] Abrir Shell de `colegio-api`
- [ ] Ejecutar: `flask db upgrade`
- [ ] Ejecutar: `python scripts/seed_admin.py`
- [ ] Ver mensaje: "✅ Admin creado exitosamente!"

### Paso 5: Verificar Deploy

**Backend:**
- [ ] Abrir: https://colegio-api.onrender.com/api/health
- [ ] Ver respuesta: `{"status": "healthy"}`

**Frontend:**
- [ ] Abrir: https://colegio-web.onrender.com
- [ ] Página carga correctamente
- [ ] HeroGlass se muestra sin errores

**Login:**
- [ ] Ir a: https://colegio-web.onrender.com/login
- [ ] Iniciar sesión con:
  - Email: `admin@iejaqg.edu.pe`
  - Password: `admin123`
- [ ] Redirige al Dashboard correctamente

**Admin Panel:**
- [ ] Crear una publicación de prueba
- [ ] Subir imagen (debe ir a Cloudinary)
- [ ] Verificar que aparece en homepage
- [ ] Probar galería
- [ ] Probar mensajes de contacto

---

## 🔄 ACTUALIZACIONES FUTURAS

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

- [ ] Render detecta el push automáticamente
- [ ] Hace rebuild y redeploy
- [ ] Verificar que el cambio se aplicó

---

## 🐛 TROUBLESHOOTING

### ❌ Build Failed

- [ ] Revisar logs en Render Dashboard
- [ ] Verificar que `requirements.txt` existe en `/api`
- [ ] Verificar que `package.json` existe en `/web`
- [ ] Asegurar que la rama sea `main`

### ❌ Database Connection Error

- [ ] Verificar que `DATABASE_URL` está configurado
- [ ] Usar URL **Internal** (no External)
- [ ] Formato correcto: `postgresql://user:pass@host/db`
- [ ] Database debe estar en la misma región

### ❌ CORS Error

- [ ] Verificar `CORS_ORIGINS` incluye URL exacta del frontend
- [ ] Debe ser: `https://colegio-web.onrender.com` (sin / al final)
- [ ] Reiniciar backend después de cambiar variable

### ❌ Frontend Can't Connect to API

- [ ] Verificar `NEXT_PUBLIC_API_URL` en frontend
- [ ] Debe apuntar a: `https://colegio-api.onrender.com/api`
- [ ] **IMPORTANTE:** Debe empezar con `NEXT_PUBLIC_`
- [ ] Hacer rebuild del frontend después de cambiar

### ❌ Images Not Loading

- [ ] Verificar credenciales de Cloudinary
- [ ] `UPLOAD_METHOD` debe ser `cloudinary`
- [ ] Revisar logs al subir imagen
- [ ] Verificar que la imagen aparece en Cloudinary Dashboard

### ❌ Service Sleeping (Plan Free)

- [ ] Primera carga tarda ~30s (cold start normal)
- [ ] Configurar UptimeRobot para mantener activo (opcional)
- [ ] Considerar upgrade a plan pago si es crítico

---

## 📊 MÉTRICAS DE ÉXITO

- [ ] Backend responde en < 2s
- [ ] Frontend carga en < 3s (después de cold start)
- [ ] Imágenes se suben correctamente a Cloudinary
- [ ] Login funciona sin errores
- [ ] CRUD de publicaciones funciona
- [ ] CRUD de galería funciona
- [ ] Mensajes de contacto se guardan
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs de Render

---

## 🎉 DEPLOY COMPLETADO

URLs de producción:

- 🌐 **Sitio Web:** https://colegio-web.onrender.com
- 🔧 **API:** https://colegio-api.onrender.com/api
- 📊 **Admin Panel:** https://colegio-web.onrender.com/admin

**Próximos pasos:**
- [ ] Cambiar contraseña del admin
- [ ] Crear usuarios adicionales
- [ ] Subir contenido real (publicaciones, galería)
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar UptimeRobot (opcional)
- [ ] Configurar analytics (opcional)

---

**Fecha de deploy:** _______________  
**Deploy realizado por:** _______________  
**Notas adicionales:**

_______________________________________________
_______________________________________________
_______________________________________________
