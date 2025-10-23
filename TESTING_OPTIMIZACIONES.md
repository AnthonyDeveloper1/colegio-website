# 🧪 GUÍA DE TESTING - OPTIMIZACIONES FRONTEND

## 🚀 Cómo Probar las Mejoras

### **Paso 1: Levantar el Proyecto**

```powershell
# Terminal 1 - Backend
cd api
python app.py

# Terminal 2 - Frontend  
cd web
npm run dev
```

---

## 📊 Tests de Performance

### **1. Lighthouse Audit (Chrome DevTools)**

```bash
1. Abrir Chrome DevTools (F12)
2. Ir a tab "Lighthouse"
3. Seleccionar:
   ✅ Performance
   ✅ Accessibility
   ✅ Best Practices
   ✅ SEO
4. Device: Mobile + Desktop
5. Click "Analyze page load"
```

**Métricas a verificar:**
- **FCP (First Contentful Paint):** < 1.8s ✅
- **LCP (Largest Contentful Paint):** < 2.5s ✅
- **TBT (Total Blocking Time):** < 300ms ✅
- **CLS (Cumulative Layout Shift):** < 0.1 ✅

---

### **2. Chrome Performance Tab**

```bash
1. Abrir DevTools (F12) → Performance tab
2. Click "Record" (círculo rojo)
3. Navegar por el sitio:
   - Página principal
   - Galería
   - Blog
   - Hover sobre imágenes
4. Stop recording
5. Analizar:
   - FPS (debe ser ~60 FPS constantes)
   - Main thread (poco bloqueado)
   - Scripting time (bajo)
```

**Qué buscar:**
- ✅ **FPS Line verde constante** (60 FPS)
- ✅ **Pocas barras rojas** (menos warnings)
- ✅ **Scripting < 50%** del tiempo total

---

### **3. Network Tab - Bundle Size**

```bash
1. DevTools → Network tab
2. Reload página (Ctrl+Shift+R)
3. Filtrar por "JS"
4. Ver tamaño total transferido
```

**Antes vs Después:**
- **Antes:** ~450KB JS
- **Después:** ~380KB JS ✅
- **Mejora:** -70KB (-15%)

---

## 🎨 Tests Visuales

### **Páginas a Verificar**

#### **1. Página Principal (`/`)**
- ✅ Hero Glass slider funciona (sin lag)
- ✅ Últimas publicaciones cargan rápido
- ✅ Galería preview hover suave (scale 1.05, 200ms)
- ✅ Footer visible sin CLS

#### **2. Galería (`/galeria`)**
- ✅ Header fade in suave (300ms)
- ✅ Filtros aparecen con slide up (300ms)
- ✅ Grid de publicaciones stagger correcto
- ✅ Hover sobre cards fluido (scale 1.05, 200ms)
- ✅ Click en categoría filtra sin lag

#### **3. Blog (`/blog`)**
- ✅ Cards hover suave
- ✅ Arrow icon se mueve al hover (translateX)
- ✅ Transición de página rápida

#### **4. Admin Gallery (`/admin/gallery`)**
- ✅ Grid hover optimizado
- ✅ Overlay aparece rápido (200ms)
- ✅ Modal funciona sin problemas

---

## 🐛 Checklist de Regresiones

### ❌ **Qué NO debería pasar:**

1. **Animaciones rotas**
   - [ ] Cards no hacen hover
   - [ ] Fade in no funciona
   - [ ] Transiciones muy lentas o muy rápidas

2. **Layout Shift**
   - [ ] Elementos saltan al cargar
   - [ ] Imágenes causan CLS
   - [ ] Menú/Footer se mueven

3. **Errores Console**
   - [ ] Warnings de React
   - [ ] Errors de Framer Motion (no debería haber)
   - [ ] Missing animations

4. **Performance Degradado**
   - [ ] Scroll con lag
   - [ ] Hover con delay notorio
   - [ ] Carga más lenta que antes

---

## 📱 Tests en Dispositivos Reales

### **Mobile Testing**

#### **Android (Chrome)**
```bash
1. Conectar dispositivo por USB
2. chrome://inspect
3. Inspect device
4. Probar:
   - Scroll fluido
   - Hover → touch feedback
   - Animaciones suaves
```

#### **iOS (Safari)**
```bash
1. Abrir Safari en iPhone
2. Settings → Safari → Advanced → Web Inspector
3. Conectar Mac
4. Develop → [iPhone] → Inspect
5. Probar igual que Android
```

**Dispositivos recomendados:**
- ✅ iPhone 12 o menor (CPU no tan potente)
- ✅ Android gama media (ej: Samsung A52)
- ⚠️ NO solo probar en flagship devices

---

## 🔬 Tests Avanzados (Opcional)

### **1. Slow Network Simulation**

```bash
DevTools → Network tab → Throttling
Seleccionar: "Slow 3G"

Verificar:
- Página carga sin crashes
- Animaciones no empiezan antes de tiempo
- Loading states visibles
```

### **2. CPU Throttling**

```bash
DevTools → Performance tab → Settings (gear icon)
CPU: 4x slowdown

Verificar:
- Scroll sigue fluido
- Animaciones no se atascan
- Hover responde rápido
```

### **3. Accessibility (prefers-reduced-motion)**

```bash
DevTools → Rendering tab
✅ "Emulate CSS media feature prefers-reduced-motion"

Verificar:
- Animaciones se desactivan o reducen
- Sitio sigue usable
- No hay elementos que dependen 100% de animaciones
```

---

## 📋 Reporte de Resultados

### **Template de Reporte**

```markdown
## Testing - [Tu Nombre] - [Fecha]

### Lighthouse Scores
- **Performance:** __/100
- **Accessibility:** __/100
- **Best Practices:** __/100
- **SEO:** __/100

### Core Web Vitals
- **FCP:** __.__ s
- **LCP:** __.__ s
- **TBT:** ___ ms
- **CLS:** 0.__

### Bundle Size
- **Total JS:** ___ KB
- **Reducción vs antes:** ___%

### Visual Testing
- [ ] Hero Glass funciona
- [ ] Galería optimizada
- [ ] Blog cards hover suave
- [ ] Admin gallery OK

### Issues Encontrados
1. [Descripción del issue]
2. [Descripción del issue]

### Notas
[Comentarios adicionales]
```

---

## 🎯 Criterios de Aceptación

### ✅ **Optimizaciones Exitosas Si:**

1. **Performance**
   - Lighthouse Performance > 90
   - FPS constante a 60 en scroll
   - TBT < 300ms

2. **Bundle Size**
   - JS reducido > 10%
   - Total transferido < 400KB

3. **UX**
   - Animaciones fluidas
   - No lag en hover
   - Transiciones rápidas (150-200ms)

4. **Accesibilidad**
   - `prefers-reduced-motion` funciona
   - Sin warnings ARIA
   - Contraste OK

5. **Compatibilidad**
   - Chrome ✅
   - Firefox ✅
   - Safari ✅
   - Mobile ✅

---

## 🆘 Troubleshooting

### **Problema: Animaciones no funcionan**
```bash
Solución:
1. Verificar que globals.css tiene los keyframes
2. Check clases Tailwind: animate-[fadeIn_0.3s_ease-in-out]
3. Ver Console por errores CSS
```

### **Problema: Bundle size no redujo**
```bash
Solución:
1. npm run build
2. Verificar que Framer Motion se removió
3. Check import statements
4. Analizar con: npx webpack-bundle-analyzer
```

### **Problema: FPS bajo en scroll**
```bash
Solución:
1. Verificar hover effects (scale-105, no 110)
2. Check durations (200ms max)
3. Remover will-change si existe
4. Optimizar imágenes (Next/Image)
```

### **Problema: CLS alto**
```bash
Solución:
1. Agregar width/height a imágenes
2. Reservar espacio para ads/embeds
3. Evitar insertar contenido arriba del fold
4. Preload de fonts críticos
```

---

## 📞 Checklist Final

Antes de considerar "Done":

- [ ] Lighthouse > 90 en Performance
- [ ] Bundle JS < 400KB
- [ ] FPS 60 constante en scroll
- [ ] Hover effects fluidos
- [ ] Mobile testing OK
- [ ] No console errors
- [ ] prefers-reduced-motion funciona
- [ ] Documentación actualizada
- [ ] Git commit con mensaje descriptivo

---

**Última actualización:** 23 de Octubre 2025  
**Autor:** GitHub Copilot  
**Versión:** 1.0
