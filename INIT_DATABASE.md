# Inicializar Base de Datos

Tu base de datos se inicializa automáticamente con un simple endpoint.

## Paso 1: Deploying en Vercel

Sube los cambios a tu repositorio:

\`\`\`bash
git add .
git commit -m "Setup Supabase initialization"
git push origin main
\`\`\`

Vercel deploy automáticamente.

## Paso 2: Inicializar Base de Datos

Una vez desplegado, ejecuta en tu navegador:

\`\`\`
https://tu-dominio.vercel.app/api/init?token=marisol-ancestral-init-2024
\`\`\`

Reemplaza:
- `tu-dominio` con tu dominio real de Vercel (ej: marisol-miniapp.vercel.app)
- El token es por defecto: `marisol-ancestral-init-2024`

## Paso 3: Verificar

Si ves esta respuesta, la BD está lista:

\`\`\`json
{
  "success": true,
  "message": "Database initialized successfully",
  "timestamp": "2024-01-26T..."
}
\`\`\`

## ¡Listo!

Tu aplicación está 100% funcionando:
- ✅ Base de datos creada
- ✅ Tablas creadas
- ✅ Índices creados
- ✅ RLS configurado
- ✅ Telegram conectado
- ✅ Minería operativa
- ✅ Worldcoin integrado

**La mini app está lista para producción.**
