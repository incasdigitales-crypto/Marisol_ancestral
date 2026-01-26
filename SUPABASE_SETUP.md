# Configuración de Supabase para Marisol Ancestral Token

## Pasos para configurar Supabase

### 1. Crear las variables de entorno
Añade a tu archivo `.env.local` o en Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 2. Crear las tablas en Supabase

1. Ve a tu dashboard de Supabase
2. Selecciona tu proyecto
3. Ve a SQL Editor
4. Crea una nueva consulta
5. Copia y pega el contenido de `/supabase/schema.sql`
6. Ejecuta la consulta

O usa el SQL directamente:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
  mining_balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
  worldcoin_verified BOOLEAN DEFAULT FALSE,
  worldcoin_address TEXT,
  worldcoin_verified_at TIMESTAMP,
  mining_power INTEGER DEFAULT 1,
  mining_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_mining_update TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(20, 8) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configurar Row Level Security (RLS) - RECOMENDADO

Para hacer tu app más segura:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

-- Only backend can insert/update users
CREATE POLICY "Backend can manage users" ON users
  FOR ALL USING (true);
```

### 4. Configurar el proyecto en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Verificar la conexión

La app probará automáticamente la conexión a Supabase al iniciar. Si no funciona, usará localStorage como fallback.

## Estructura de datos

### Tabla: users
```
- id (UUID): Identificador único
- telegram_id (TEXT): ID de usuario de Telegram (único)
- username (TEXT): Nombre de usuario
- balance (DECIMAL): Saldo actual de tokens (billetera)
- mining_balance (DECIMAL): Total ganado por minería
- worldcoin_verified (BOOLEAN): ¿Verificado con Worldcoin?
- worldcoin_address (TEXT): Dirección de Worldcoin
- mining_power (INTEGER): Multiplicador de minería (1x, 2x, etc)
- mining_level (INTEGER): Nivel de minería (1-5)
- created_at (TIMESTAMP): Fecha de creación
- updated_at (TIMESTAMP): Última actualización
- last_mining_update (TIMESTAMP): Última vez que minó
```

### Tabla: transactions
```
- id (UUID): Identificador único
- user_id (UUID): ID del usuario
- type (TEXT): 'mining', 'transfer', 'upgrade', 'claim'
- amount (DECIMAL): Cantidad
- description (TEXT): Detalles de la transacción
- created_at (TIMESTAMP): Fecha
```

## Sincronización de datos

- **Balance = Billetera + Minería**: Se sincronizan automáticamente
- **Saldo inicial = 0**: Nuevos usuarios comienzan con balance 0
- **Mining requiere Worldcoin**: No puedes minar sin verificación
- **Mejoras requieren WLD**: Las mejoras de minería cuestan WLD (balance)

## Troubleshooting

### "Supabase URL o Anon Key no configuradas"
Asegúrate de tener las variables de entorno configuradas correctamente.

### "CORS Error"
Añade tu dominio a los orígenes permitidos en Supabase:
1. Settings → API Settings
2. Add http://localhost:3000 y tu dominio de Vercel

### Datos no se guardan
1. Verifica que las tablas existan en Supabase
2. Verifica que las variables de entorno sean correctas
3. Abre la consola (F12) para ver errores específicos

## Próximas mejoras

- [ ] Implementar autenticación segura de Telegram
- [ ] Validar direcciones de Worldcoin reales
- [ ] Agregar histórico de transacciones
- [ ] Implementar leaderboard global
- [ ] Agregar notificaciones en tiempo real
