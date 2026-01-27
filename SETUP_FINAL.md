# Setup Final - Marisol Ancestral Token

## Estado Actual

✅ **Telegram:** YA CONECTADO automáticamente
✅ **Código:** 100% funcional
✅ **Supabase:** Configurado, necesita variables de entorno

## Pasos para Activar (5 minutos)

### 1. Obtener credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Settings → API
4. Copia:
   - `Project URL` 
   - `anon public` key

### 2. Agregar Variables en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega 2 nuevas variables:

```
NEXT_PUBLIC_SUPABASE_URL = [Tu Project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [Tu anon public key]
```

4. Deploy → Redeploy

### 3. Crear Tablas en Supabase

1. En Supabase, ve a SQL Editor
2. Abre una nueva query
3. Copia y pega el SQL abajo:

```sql
-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  balance DECIMAL(18, 2) DEFAULT 0,
  mining_balance DECIMAL(18, 2) DEFAULT 0,
  mining_power INTEGER DEFAULT 1,
  mining_level INTEGER DEFAULT 1,
  worldcoin_verified BOOLEAN DEFAULT FALSE,
  worldcoin_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(18, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para performance
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
```

4. Ejecuta la query (botón RUN)
5. Listo!

### 4. Test

1. Abre tu mini app en Telegram
2. Verifica que aparece tu nombre y balance = 0
3. Intenta minar, transferir, etc
4. ¡Todo debe funcionar!

## Respuestas a Preguntas

**¿Telegram ya está conectado?** 
SÍ. El código en `app/page.tsx` línea 20-24 ya lo hace automáticamente.

**¿Qué falta?**
Solo las 2 variables de entorno en Vercel + crear las tablas en Supabase.

**¿Cuánto tiempo toma?**
5-10 minutos máximo.

**¿Después qué?**
Deploy automático en Vercel y ¡LISTO! Tu mini app funciona en Telegram.

---

**Sigue estos 4 pasos y tu mini app estará 100% en producción.** 🚀
