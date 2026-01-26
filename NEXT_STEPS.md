# Próximos Pasos - Marisol Ancestral Token

## Fase 1: Integración Backend Real (Semana 1-2)

### 1.1 Configurar Supabase
```bash
# 1. Crear proyecto en supabase.com
# 2. Obtener credenciales:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Instalar SDK
npm install @supabase/supabase-js

# 4. Reemplazar localStorage con Supabase
```

**Cambios en `/hooks/use-user.ts`**:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// En useEffect:
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('telegram_id', telegramId)
  .single();
```

### 1.2 Crear Tablas en Supabase
```sql
-- Ejecutar en Supabase SQL Editor

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

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  amount DECIMAL(18,8),
  recipient_id UUID REFERENCES users(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mining_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  total_earned DECIMAL(18,8),
  mining_power_used INTEGER
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mining_sessions ENABLE ROW LEVEL SECURITY;
```

### 1.3 Implementar RLS Policies
```sql
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Fase 2: Integración Worldcoin Real (Semana 2-3)

### 2.1 Obtener Credenciales Worldcoin
1. Registrarse en [developer.worldcoin.org](https://developer.worldcoin.org)
2. Crear aplicación
3. Obtener:
   - App ID
   - API Key
   - Client Secret

### 2.2 Instalar SDK Worldcoin
```bash
npm install @worldcoin/idkit
```

### 2.3 Implementar Verificación Real

**Crear `/app/api/worldcoin/verify/route.ts`**:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { proof, merkle_root, nullifier_hash } = await req.json();

  // Verificar proof con API Worldcoin
  const response = await fetch('https://api.worldcoin.org/v1/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WORLDCOIN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      proof,
      merkle_root,
      nullifier_hash,
      app_id: process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID,
    }),
  });

  const data = await response.json();
  
  if (data.success) {
    // Guardar verificación en Supabase
    // Crear/actualizar usuario
    return NextResponse.json({ verified: true });
  }

  return NextResponse.json({ verified: false }, { status: 400 });
}
```

### 2.4 Actualizar WorldcoinSection
```typescript
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit';

export default function WorldcoinSection() {
  const handleVerify = async (result: ISuccessResult) => {
    const response = await fetch('/api/worldcoin/verify', {
      method: 'POST',
      body: JSON.stringify(result),
    });

    const data = await response.json();
    
    if (data.verified) {
      onVerify(data.address);
    }
  };

  return (
    <IDKitWidget
      app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
      onSuccess={handleVerify}
    >
      {({ open }) => (
        <button onClick={open}>
          Verificar con Worldcoin
        </button>
      )}
    </IDKitWidget>
  );
}
```

---

## Fase 3: Sistema de Pagos (Semana 3-4)

### 3.1 Integrar Stripe
```bash
npm install stripe @stripe/stripe-js
```

### 3.2 Crear Endpoint de Pago
**`/app/api/create-checkout/route.ts`**:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { miningLevel } = await req.json();

  const costs: Record<number, number> = {
    1: 50,    // 50 USD
    2: 150,
    3: 500,
    4: 2000,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Mining Level ${miningLevel + 1}`,
          },
          unit_amount: (costs[miningLevel] * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/mining?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/mining?status=cancelled`,
  });

  return Response.json({ sessionId: session.id });
}
```

### 3.3 Actualizar Mining Component
```typescript
import { loadStripe } from '@stripe/stripe-js';

const handleUpgrade = async () => {
  const response = await fetch('/api/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ miningLevel: user?.miningLevel }),
  });

  const { sessionId } = await response.json();
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
  
  await stripe?.redirectToCheckout({ sessionId });
};
```

---

## Fase 4: Características Avanzadas (Semana 4-5)

### 4.1 Sistema de Referidos
```typescript
// /hooks/use-referral.ts
export function useReferral() {
  const generateReferralLink = (userId: string) => {
    return `https://t.me/bot_name/app?startapp=ref_${userId}`;
  };

  const getReferralBonuses = async (userId: string) => {
    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId);

    return data || [];
  };

  return { generateReferralLink, getReferralBonuses };
}
```

### 4.2 Marketplace de NFTs
- Crear tabla `nfts` en Supabase
- Implementar compra/venta de NFTs
- Integrar con Worldcoin smart contracts

### 4.3 Sistema de Staking
- Usuarios pueden "holdear" tokens
- APY variable según cantidad
- Recompensas automáticas

### 4.4 DAO Governance
- Votaciones en transacciones importantes
- Token voting power
- Treasury management

---

## Fase 5: Optimización y Deploy (Semana 5)

### 5.1 Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance
```

### 5.2 Optimización
- [ ] Code splitting
- [ ] Image optimization
- [ ] Lazy loading de componentes
- [ ] Caching strategy

### 5.3 Deploy a Producción
```bash
# 1. Push a main branch
git push origin main

# 2. Deploy en Vercel
vercel --prod

# 3. Configurar variables de entorno
# 4. Configurar dominios

# 5. Configurar Telegram Bot
/setwebapp (command in BotFather)
```

---

## Checklist de Implementación

### Fase 1: Backend
- [ ] Crear proyecto Supabase
- [ ] Crear tablas SQL
- [ ] Habilitar RLS
- [ ] Actualizar `use-user.ts`
- [ ] Testing con datos reales

### Fase 2: Worldcoin
- [ ] Obtener credenciales
- [ ] Instalar IDKit
- [ ] Crear endpoint de verificación
- [ ] Actualizar Worldcoin component
- [ ] Testing en testnet

### Fase 3: Pagos
- [ ] Obtener credenciales Stripe
- [ ] Crear checkout endpoint
- [ ] Implementar webhook de success
- [ ] Actualizar mining component
- [ ] Testing en modo test

### Fase 4: Avanzado
- [ ] Sistema de referidos
- [ ] Marketplace NFTs
- [ ] Staking
- [ ] DAO Governance

### Fase 5: Deploy
- [ ] Pasar todos los tests
- [ ] Optimizar performance
- [ ] Deploy a Vercel
- [ ] Configurar Telegram Bot
- [ ] Monitoreo y alertas

---

## Estructura de Carpetas Post-Integración

```
.
├── app/
│   ├── api/
│   │   ├── worldcoin/
│   │   │   └── verify/
│   │   ├── payments/
│   │   │   └── stripe/
│   │   └── mining/
│   │       └── stats/
│   ├── mining/
│   ├── wallet/
│   └── dashboard/
│
├── components/
│   ├── stripe/
│   │   └── checkout-form.tsx
│   └── worldcoin/
│       └── verify-widget.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   └── worldcoin.ts
│
└── hooks/
    ├── use-user.ts
    ├── use-mining.ts
    ├── use-worldcoin.ts
    └── use-referral.ts
```

---

## Recursos Útiles

### Documentación
- [Supabase Docs](https://supabase.com/docs)
- [Worldcoin Docs](https://docs.worldcoin.org)
- [Stripe Docs](https://stripe.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Tutoriales
- Integración Supabase: `https://supabase.com/docs/guides/getting-started`
- Worldcoin IDKit: `https://docs.worldcoin.org/idkit`
- Stripe Checkout: `https://stripe.com/docs/payments/checkout`

### Comunidades
- Worldcoin Developer Community
- Telegram Bot API Group
- Next.js Discord

---

## Estimación de Tiempo

| Fase | Tareas | Tiempo | Status |
|------|--------|--------|--------|
| 1    | Backend Supabase | 5-7 días | 📋 Por hacer |
| 2    | Worldcoin API | 4-5 días | 📋 Por hacer |
| 3    | Sistema Pagos | 3-4 días | 📋 Por hacer |
| 4    | Características | 7-10 días | 📋 Futuro |
| 5    | Testing/Deploy | 3-4 días | 📋 Final |

**Total Estimado**: 22-30 días de desarrollo

---

## Support y Contacto

- Issues: GitHub Issues
- Preguntas: [tu email]
- Telegram: @MARISOL ANCESTRAL BOT

---

**Última Actualización**: 2026
**Versión**: 1.0.0
**Mantenedor**: v0 AI Assistant
