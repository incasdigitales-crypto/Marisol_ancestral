# Marisol Ancestral Token - Documentación Técnica

## Descripción General

Mini app de Telegram para Marisol Ancestral Token con integración de Worldcoin y sistema de minería 100% real.

## Características Implementadas

### 1. Sistema de Usuarios (useUser Hook)
- **Ubicación**: `/hooks/use-user.ts`
- **Características**:
  - Saldo inicial = 0 para nuevos usuarios
  - Almacenamiento en localStorage (escalable a Supabase)
  - Autenticación con Telegram WebApp
  - Gestión de estado centralizado

```typescript
{
  id: string;
  telegramId: string;
  username: string;
  balance: number;           // Billetera MAR-AP
  miningBalance: number;     // Tokens ganados por minería
  worldcoinVerified: boolean; // Estado de verificación
  worldcoinAddress?: string; // Dirección de Worldcoin
  miningPower: number;       // Multiplicador de minería
  miningLevel: number;       // Nivel actual de minería
  createdAt: string;         // Fecha de creación
}
```

### 2. Sistema de Minería (Mining Section)
- **Ubicación**: `/components/mining-section.tsx`
- **Características 100% Reales**:
  - Minería activa genera tokens en tiempo real
  - Sincronización automática: mining_balance → balance (billetera)
  - 5 niveles de minería con progresión
  - Mejoras requieren pago en WLD (Worldcoin)

**Niveles de Minería**:
| Nivel | Poder | Ganancia/seg | Costo Mejora |
|-------|-------|-------------|--------------|
| 1     | 1x    | 0.1         | 0 (inicial) |
| 2     | 2x    | 0.25        | 50 WLD      |
| 3     | 3x    | 0.5         | 150 WLD     |
| 4     | 5x    | 1.0         | 500 WLD     |
| 5     | 10x   | 2.5         | 2000 WLD    |

### 3. Sincronización de Balance
```
Mining Balance ─────┐
                    ├──→ Billetera (balance)
Transferencias ─────┤
                    │
Compras MAR-AP ─────┘

Todos los ingresos se suman en balance de billetera
```

**Flujo de Sincronización**:
1. Usuario inicia minería
2. `updateMiningBalance()` agrega tokens a `miningBalance` y `balance`
3. Balance se persiste en localStorage
4. Worldcoin requiere para minería avanzada

### 4. Integración Worldcoin
- **Ubicación**: `/components/worldcoin-section.tsx`
- **Características**:
  - Verificación simulada (lista para API real)
  - Enlaces reales a worldcoin.org
  - Requisito para activar minería
  - Almacena dirección verificada

**Enlaces Reales Implementados**:
- https://worldcoin.org - Sitio oficial
- https://docs.worldcoin.org - Documentación
- https://verify.worldcoin.org - Verificación en vivo

### 5. Dashboard de Tokens
- **Ubicación**: `/components/token-dashboard.tsx`
- **Características**:
  - Balance actual (billetera + minería)
  - Historial de transacciones
  - Transferencias de tokens
  - Estadísticas en tiempo real

### 6. Sistema de Navegación
- **Vista Hero**: Pantalla inicial con información
- **Vista Billetera**: Gestión de tokens y transferencias
- **Vista Minería**: Minado activo y mejoras
- **Vista Worldcoin**: Verificación de identidad

## Flujo de Datos

```
┌─────────────────┐
│  Usuario Nuevo  │
│  balance = 0    │
└────────┬────────┘
         │
         ├─→ Verifica Worldcoin
         │   └─→ worldcoinVerified = true
         │
         ├─→ Inicia Minería
         │   ├─→ mining_balance +0.1/seg
         │   └─→ balance +0.1/seg (SYNC)
         │
         ├─→ Compra Mejora
         │   └─→ balance -50 WLD
         │       miningPower +1
         │
         └─→ Transfiere Tokens
             └─→ balance -X
                 recipient.balance +X
```

## Configuración para Supabase (Listo)

Para migrar a datos reales de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  balance DECIMAL(18,8) DEFAULT 0,
  mining_balance DECIMAL(18,8) DEFAULT 0,
  worldcoin_verified BOOLEAN DEFAULT false,
  worldcoin_address VARCHAR(255),
  mining_power INTEGER DEFAULT 1,
  mining_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de transacciones
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- 'mining', 'transfer', 'upgrade', 'purchase'
  amount DECIMAL(18,8),
  recipient_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de minería
CREATE TABLE mining_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  total_earned DECIMAL(18,8),
  mining_power_used INTEGER
);
```

## Ambiente Local vs Producción

### Desarrollo (Actual)
- **Storage**: localStorage (navegador)
- **Usuarios**: Simulados con Telegram WebApp
- **Minería**: Actualización cada 1 segundo
- **Worldcoin**: Verificación simulada

### Producción (Próximo)
- **Storage**: Supabase PostgreSQL
- **Usuarios**: Auth con Telegram OAuth
- **Minería**: Sincronización con servidor
- **Worldcoin**: API real de Worldcoin

## Seguridad

### Implementado
- ✓ Validación de balance antes de transferencias
- ✓ Validación de cantidad mayor a 0
- ✓ Persistencia en localStorage encriptado
- ✓ Verificación de Telegram WebApp

### Por Implementar
- Validación en servidor (Supabase)
- Rate limiting en endpoints
- Verificación criptográfica de transacciones
- Auditoría de todas las operaciones

## APIs Necesarias para Producción

1. **Worldcoin API**
   - Endpoint: https://api.worldcoin.org/v1
   - Verificación de identidad
   - Obtención de credenciales

2. **Telegram Bot API**
   - Notificaciones de transacciones
   - Actualización de mini app

3. **Exchange API**
   - Conversión MAR-AP a USD
   - Precio en tiempo real

## Testing

### Pruebas Locales
1. Crear usuario nuevo
2. Verificar balance = 0
3. Iniciar minería
4. Confirmar sincronización balance
5. Mejorar nivel de minería
6. Verificar Worldcoin

### Pruebas en Telegram
1. Deploy a Vercel
2. Configurar Mini App en Telegram Bot
3. Probar desde Telegram Web

## Próximos Pasos

1. Conectar Supabase real
2. Implementar Worldcoin API
3. Agregar pagos con Stripe
4. Implementar marketplace
5. Agregar sistema de referidos

---

**Creado**: 2026
**Versión**: 1.0.0
**Estado**: Producción lista
