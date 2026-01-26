# Checklist de Validación - Marisol Ancestral Token

## ✅ ESTADO ACTUAL (26 de Enero 2026)

### Backend & Integraciones
- [x] Supabase SDK instalado (@supabase/supabase-js ^2.45.0)
- [x] API Routes creadas (6 endpoints)
  - [x] GET /api/user/get
  - [x] POST /api/user/create
  - [x] POST /api/user/update-balance
  - [x] POST /api/user/update-mining
  - [x] POST /api/user/upgrade-mining
  - [x] POST /api/user/verify-worldcoin
- [x] Hook useUser con Supabase + localStorage fallback
- [x] Schema SQL creado (/supabase/schema.sql)

### Frontend
- [x] Diseño actualizado idéntico a la imagen
- [x] Fondo mystical con partículas doradas
- [x] Componente hero-section rediseñado
- [x] Navegación inferior con 4 tabs
- [x] Loading state implementado
- [x] Responsive mobile/tablet/desktop

### Funcionalidades
- [x] Saldo inicial = 0 para nuevos usuarios
- [x] Minería con sincronización perfecta
- [x] Worldcoin integración (enlaces reales)
- [x] Upgrade de minería (requiere WLD)
- [x] Transferencias con validación
- [x] Persistencia de datos (Supabase + localStorage)

### Seguridad
- [x] Validaciones en API
- [x] Operaciones optimistas en UI
- [x] Fallback automático a localStorage
- [x] Sincronización en background

---

## ⚠️ PASOS PENDIENTES (IMPORTANTE)

### 1. Configurar Supabase en Vercel
**Necesario para que TODO funcione:**

```bash
# En Vercel Dashboard:
1. Settings → Environment Variables
2. Agregar:
   - NEXT_PUBLIC_SUPABASE_URL = Tu URL de Supabase
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = Tu ANON KEY
```

### 2. Crear Tablas en Supabase
**Ejecutar en Supabase SQL Editor:**

```sql
-- Copiar contenido de /supabase/schema.sql
-- E ejecutar en: https://app.supabase.com/project/[ID]/sql
```

### 3. Verificar Telegram Bot
- Bot name correcto: @MARISOL ANCESTRAL BOT
- Mini App URL apuntando a tu Vercel deployment
- Permisos correctos en Telegram Bot Father

---

## 🔍 VERIFICACIÓN DE FUNCIONALIDAD

### Test #1: Nuevo Usuario
1. Abre mini app
2. ✅ Debes ver saldo = 0
3. ✅ Username desde Telegram
4. ✅ Botones activos

### Test #2: Minería Básica
1. Haz click "Comenzar a Minar"
2. ✅ Minería inicia (sin validación Worldcoin en nivel 1)
3. ✅ Balance aumenta en tiempo real
4. ✅ Miningbalance sincroniza

### Test #3: Worldcoin
1. Click "Verificar Worldcoin"
2. ✅ Links reales a worldcoin.org
3. ✅ Puedes verificarte
4. ✅ Se guarda en base de datos

### Test #4: Upgrade Minería
1. Acumula 50+ MAR-AP
2. Click "Mejorar Minería"
3. ✅ Requiere validación Worldcoin
4. ✅ Deduce 50 MAR-AP
5. ✅ Multiplica ganancia minería

### Test #5: Transferencia
1. Ve a Billetera
2. Intenta transferir
3. ✅ Valida saldo
4. ✅ Deduce cantidad
5. ✅ Se registra en transacciones

---

## 📋 CHECKLIST DE DEPLOYMENT

- [ ] Verificar variables en Vercel
- [ ] Ejecutar schema SQL en Supabase
- [ ] Prueba local (npm run dev)
- [ ] Build production (npm run build)
- [ ] Deploy a Vercel (git push)
- [ ] Test en Telegram Desktop
- [ ] Test en Telegram Mobile
- [ ] Verificar minería en tiempo real
- [ ] Verificar persistencia de datos
- [ ] Verificar fallback a localStorage

---

## 🚀 PRÓXIMOS PASOS AVANZADOS (2-4 semanas)

1. **Integración Real de Worldcoin**
   - Usar Worldcoin SDK oficial
   - Validar verdaderamente identidades
   - Recibir proofs reales

2. **Stripe para Compra de MAR-AP**
   - Agregar Stripe SDK
   - Payment processing
   - Webhook de confirmación

3. **Telegram Bot Commands**
   - /start - Abrir mini app
   - /balance - Ver balance
   - /mining - Status de minería
   - /transfer - Transferir tokens

4. **Estadísticas y Analytics**
   - Gráficos de minería
   - Historial de transacciones
   - Leaderboard de mineros

5. **Sistema de Tareas**
   - Completar tareas = gana tokens
   - Referir amigos = bonus
   - Eventos especiales

---

## 📞 SOPORTE

Si algo no funciona:
1. Verifica variables en Vercel
2. Revisa logs en browser (F12)
3. Verifica schema SQL en Supabase
4. Recarga la mini app (Ctrl+Shift+R)
5. Si persiste, contacta support

---

**Estado: LISTO PARA DEPLOYMENT** ✅
