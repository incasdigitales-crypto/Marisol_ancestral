# Guía de Despliegue - Marisol Ancestral Token

## 🚀 Despliegue a Producción

### Antes de Desplegar

Asegúrate de:
- [ ] Ejecutar script SQL en Supabase
- [ ] Probar todo localmente
- [ ] Pasar todos los test cases
- [ ] Revisar variables de entorno

---

## Paso 1: Preparar Supabase

### 1.1 Ejecutar Script SQL

\`\`\`bash
1. Abre: https://app.supabase.com
2. Ve a: SQL Editor
3. Copia el contenido de: /scripts/add-savings-table.sql
4. Pega en el editor
5. Haz clic en "Run"
6. Espera confirmación: "SUCCESS"
\`\`\`

### 1.2 Verificar Tablas

\`\`\`sql
-- En SQL Editor de Supabase, ejecuta:
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public';

-- Deberías ver:
✓ users (actualizada con savings_balance)
✓ savings_logs (nueva)
\`\`\`

### 1.3 Verificar RLS

\`\`\`sql
-- Ejecuta en SQL Editor:
SELECT * FROM pg_policies 
WHERE tablename = 'savings_logs';

-- Deberías ver políticas de RLS
\`\`\`

---

## Paso 2: Variables de Entorno

### 2.1 En Vercel Dashboard

\`\`\`
Ir a: Settings → Environment Variables

Agregar/Verificar:
✓ NEXT_PUBLIC_SUPABASE_URL = [tu_url]
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY = [tu_key]
\`\`\`

### 2.2 En .env.local (Desarrollo)

\`\`\`bash
# Solo si desarrollas localmente
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

---

## Paso 3: Pruebas Pre-Despliegue

### 3.1 Test Local Completo

\`\`\`bash
# En tu máquina:
npm install
npm run dev

# En navegador:
http://localhost:3000

# Prueba:
✓ Todas las pestañas cargan
✓ Puedes depositar monedas
✓ El interés se calcula
✓ Worldcoin verifica
✓ Los datos persisten
\`\`\`

### 3.2 Build Verificación

\`\`\`bash
# Compilar para producción:
npm run build

# Debería completarse sin errores:
✓ next build
✓ next export (si aplica)
✓ next lint (sin warnings críticos)
\`\`\`

### 3.3 Ejecutar Test Cases

Ve a `/TEST_CASES.md` y ejecuta:
- [ ] Tests 1-4: Depósitos
- [ ] Tests 5-8: Interés
- [ ] Tests 9-12: Worldcoin
- [ ] Tests 13-15: Almacenamiento
- [ ] Tests 16-20: Navegación e Integración

---

## Paso 4: Despliegue en Vercel

### 4.1 Opción A: Desde Vercel Dashboard

\`\`\`
1. Ve a: https://vercel.com/dashboard
2. Click en tu proyecto "Marisol_ancestral"
3. Verifica que el branch es "main"
4. Haz push de tus cambios a GitHub:
   git add .
   git commit -m "feat: add savings system and worldcoin verification"
   git push origin main
5. Vercel redesplegará automáticamente
6. Espera a que termine (muestra ✓ verde)
\`\`\`

### 4.2 Opción B: Con Git Manual

\`\`\`bash
# En tu terminal:
git add .
git commit -m "feat: savings and worldcoin improvements"
git push origin main

# Vercel se redesplegará automáticamente
# Puedes ver el progreso en: https://vercel.com/deployments
\`\`\`

### 4.3 Opción C: Redeployar Existente

\`\`\`
En Vercel Dashboard:
1. Ve a tu proyecto
2. Click en "..." (más opciones)
3. Selecciona "Redeploy"
4. Haz click en "Redeploy" nuevamente
5. Espera que termine
\`\`\`

---

## Paso 5: Verificación Post-Despliegue

### 5.1 Verificar Dominio

\`\`\`
Tu app estará en:
https://marisol-ancestral.vercel.app
(o tu dominio personalizado)

Comprueba:
✓ App carga rápidamente
✓ Todas las secciones funcionan
✓ Los datos se guardan en Supabase
✓ No hay errores en consola
\`\`\`

### 5.2 Test en Producción

\`\`\`
Ejecuta los mismos tests pero en:
https://tu-dominio-produccion.vercel.app

Verifica:
✓ Sistema de bodega funciona
✓ Interés se calcula correctamente
✓ Worldcoin verifica
✓ Datos persisten en BD real
\`\`\`

### 5.3 Monitoreo Inicial

\`\`\`
En Vercel:
1. Ve a "Monitoring"
2. Verifica:
   ✓ Response time < 500ms
   ✓ No hay errores críticos
   ✓ Database connections estables

En Supabase:
1. Ve a "Database" → "Logs"
2. Verifica:
   ✓ No hay errores SQL
   ✓ Las queries son eficientes
   ✓ Los datos se insertan correctamente
\`\`\`

---

## Troubleshooting de Despliegue

### Problema: "Build falló"

\`\`\`
Solución:
1. Ve a Vercel Dashboard → Deployments
2. Haz click en el deployment fallido
3. Ve a "Build & Logs"
4. Busca el error específico
5. Revisa el código y corrige
6. Haz git push de nuevo
\`\`\`

### Problema: "Supabase no conecta en producción"

\`\`\`
Verificar:
1. Las variables de entorno están en Vercel ✓
2. Los valores son correctos (sin espacios)
3. La URL de Supabase es pública
4. La API key es correcta
5. El firewall no bloquea (prueba desde otra red)
\`\`\`

### Problema: "Datos no se guardan"

\`\`\`
Comprobar:
1. Script SQL se ejecutó completo
2. Tablas existen en BD
3. RLS está habilitado pero bien configurado
4. User tiene permisos (check RLS policies)
5. Revisa logs de Supabase para errores SQL
\`\`\`

### Problema: "La app está lenta"

\`\`\`
Optimizar:
1. En Vercel → Analytics
   - Comprueba qué rutas son lentas
   - Optimiza las más usadas

2. En Supabase → Database → Performance
   - Verifica que los índices existen
   - Revisa queries lentas

3. En navegador (F12) → Network
   - Comprueba tamaño de requests
   - Optimiza imágenes si es necesario
\`\`\`

---

## Monitoreo Continuo

### Daily Checks

\`\`\`
Cada mañana, verifica:
☐ App accesible en dominio
☐ Usuarios pueden depositar
☐ Interés se reclama correctamente
☐ Worldcoin verifica sin errores
☐ Logs limpios sin errores críticos
\`\`\`

### Weekly Checks

\`\`\`
Una vez por semana:
☐ Database backup funciona
☐ Performance está estable
☐ No hay errores acumulados
☐ Usuarios reportan bugs (monitor feedback)
☐ Logs de error (revisar Supabase)
\`\`\`

### Monthly Checks

\`\`\`
Una vez por mes:
☐ Revisar analytics completos
☐ Optimizar queries lentas
☐ Actualizar dependencias (npm)
☐ Revisar seguridad (F12 console)
☐ Backups están asegurados
\`\`\`

---

## Rollback (Si Algo Sale Mal)

### Opción 1: Vercel Rollback

\`\`\`
En Vercel Dashboard:
1. Ve a "Deployments"
2. Busca deployment anterior exitoso
3. Haz click en "..."
4. Selecciona "Rollback to this version"
5. Haz click en "Rollback"
6. La app vuelve al estado anterior

Tiempo: < 1 minuto
\`\`\`

### Opción 2: Git Rollback

\`\`\`bash
# Ver commits:
git log --oneline

# Revertir cambios:
git revert HEAD~1  # Último commit
git push origin main

# Vercel redesplegará automáticamente
\`\`\`

### Opción 3: Despliegue Manual

\`\`\`bash
# Si necesitas revert más atrás:
git revert <commit-hash>
git push origin main

# O forzar reset (cuidado):
git reset --hard <commit-hash>
git push origin main --force
\`\`\`

---

## Checklist Final de Despliegue

Antes de dar por completado:

### Seguridad:
- [ ] Variables de entorno en Vercel
- [ ] RLS habilitado en Supabase
- [ ] No hay secrets en código
- [ ] CORS configurado correctamente
- [ ] No hay endpoints públicos sin validación

### Performance:
- [ ] Build time < 5 minutos
- [ ] Response time < 500ms
- [ ] Database queries < 200ms
- [ ] Lighthouse score > 80
- [ ] Sin memory leaks

### Funcionalidad:
- [ ] Sistema de bodega funciona
- [ ] Interés diario calcula correctamente
- [ ] Worldcoin verifica
- [ ] Datos persisten
- [ ] Navegación completa

### Monitoring:
- [ ] Logs limpios sin errores críticos
- [ ] Alertas configuradas (opcional)
- [ ] Backups automáticos activos
- [ ] Analytics habilitado
- [ ] Error tracking funcionando

---

## URLs Útiles

\`\`\`
Vercel Dashboard:
https://vercel.com/dashboard

Tu Proyecto Vercel:
https://vercel.com/dashboard/marisol-ancestral

Supabase Dashboard:
https://app.supabase.com/projects

Base de Datos:
https://app.supabase.com/project/[project-id]/databases

GitHub Repository:
https://github.com/incasdigitales-crypto/Marisol_ancestral
\`\`\`

---

## Contacto y Soporte

Si necesitas ayuda:

1. **Vercel Support**: https://vercel.com/help
2. **Supabase Support**: https://supabase.com/docs
3. **Tu equipo**: Revisa la documentación en `/`

---

## Después del Despliegue

### Comunicación
- [ ] Notifica a usuarios del lanzamiento
- [ ] Comparte el link de la app
- [ ] Pide feedback inicial
- [ ] Documenta issues reportadas

### Mejoras Rápidas
- [ ] Corrige bugs críticos inmediatamente
- [ ] Optimiza features lentos
- [ ] Agrega metricas de uso
- [ ] Itera basado en feedback

### Roadmap Futuro
- [ ] Planifica nuevas features
- [ ] Prioriza basado en usuario feedback
- [ ] Continúa monitoring y optimización
- [ ] Expande a nuevos mercados/usuarios

---

## 🎉 ¡Éxito en tu Despliegue!

Tu aplicación Marisol Ancestral Token está lista para conquistar el mundo.

**Recuerda:**
- Monitor continuamente
- Responde rápido a bugs
- Escucha feedback de usuarios
- Itera y mejora constantemente

**¡Adelante! 🚀**

---

*Última actualización: 17 de Marzo de 2026*
*Versión: 1.0.0-production-ready*
