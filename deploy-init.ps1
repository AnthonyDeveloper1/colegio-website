# Script de Deploy Helper para Render
# Ejecuta este script después de que los servicios estén activos

Write-Host "🚀 Deploy Helper - Inicialización de Base de Datos" -ForegroundColor Cyan
Write-Host ""

# Verificar que DATABASE_URL esté configurado
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  DATABASE_URL no está configurado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor White
    Write-Host "1. Configúralo en Render Shell directamente" -ForegroundColor Gray
    Write-Host "2. O configúralo aquí temporalmente:" -ForegroundColor Gray
    Write-Host ""
    $dbUrl = Read-Host "Ingresa DATABASE_URL (o deja vacío para salir)"
    
    if ([string]::IsNullOrWhiteSpace($dbUrl)) {
        Write-Host "❌ Cancelado" -ForegroundColor Red
        exit 1
    }
    
    $env:DATABASE_URL = $dbUrl
}

Write-Host "✅ DATABASE_URL configurado" -ForegroundColor Green
Write-Host ""

# Paso 1: Crear/actualizar tablas
Write-Host "📦 Paso 1: Creando tablas con Flask-Migrate..." -ForegroundColor Cyan
cd api

# Inicializar migrations si no existe
if (-not (Test-Path "migrations")) {
    Write-Host "Inicializando Flask-Migrate..." -ForegroundColor Gray
    flask db init
}

# Crear migración
Write-Host "Generando migración..." -ForegroundColor Gray
flask db migrate -m "Initial migration"

# Aplicar migración
Write-Host "Aplicando migración..." -ForegroundColor Gray
flask db upgrade

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tablas creadas exitosamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al crear tablas" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 2: Crear admin
Write-Host "👤 Paso 2: Creando usuario admin..." -ForegroundColor Cyan
python scripts/seed_admin.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Usuario admin creado" -ForegroundColor Green
} else {
    Write-Host "❌ Error al crear admin" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 ¡Deploy completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciales de acceso:" -ForegroundColor Cyan
Write-Host "  Email: admin@iejaqg.edu.pe" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Recuerda cambiar la contraseña después del primer login" -ForegroundColor Yellow
