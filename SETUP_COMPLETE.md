# Marisol Ancestral Token - Setup Completo

## Estado Actual

Todo el código está 100% configurado y listo. Solo falta ejecutar el SQL en Supabase.

## Pasos Finales (2 minutos)

### 1. Copiar y ejecutar SQL en Supabase

1. Ve a tu dashboard de Supabase
2. Selecciona tu proyecto
3. Ve a SQL Editor → New Query
4. Copia TODO el contenido de `/scripts/init-db.sql`
5. Ejecuta la query

El script crea:
- Tabla `users` (con todos los campos)
- Tabla `transactions` (para auditoría)
- Tabla `mining_logs` (para registrar minería)
- Índices y políticas de seguridad

### 2. Verificar en Vercel

Las variables de entorno se leen automáticamente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Ya están configuradas en Vercel.

### 3. Deploy

```bash
git add .
git commit -m "Configure Supabase"
git push
```

Vercel deploy automáticamente.

### 4. Probar en Telegram

Abre tu mini app en Telegram. Verá:
- Usuario nuevo con balance = 0
- Puede minar (requiere Worldcoin)
- Puede ver transacciones
- Puede mejorar nivel de minería

## Archivos Modificados

✅ `/lib/supabase.ts` - Cliente browser correcto
✅ `/lib/supabase-server.ts` - NUEVO - Cliente servidor
✅ `/app/api/user/get/route.ts` - Actualizado
✅ `/app/api/user/create/route.ts` - Actualizado
✅ `/app/api/user/update-balance/route.ts` - Actualizado
✅ `/app/api/user/update-mining/route.ts` - Actualizado
✅ `/app/api/user/upgrade-mining/route.ts` - Actualizado
✅ `/app/api/user/verify-worldcoin/route.ts` - Actualizado
✅ `/package.json` - Agregado @supabase/ssr
✅ `/scripts/init-db.sql` - NUEVO - Schema SQL

## Confirmación

Todo está listo. Solo falta:
1. Ejecutar el SQL (90 segundos)
2. Git push (automático deploy)
3. Probar en Telegram

¡Listo!
