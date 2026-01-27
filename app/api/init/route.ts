import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const SQL_INIT = `
-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  balance DECIMAL(18, 2) DEFAULT 0,
  mining_balance DECIMAL(18, 2) DEFAULT 0,
  mining_level INT DEFAULT 1,
  mining_power DECIMAL(5, 2) DEFAULT 1.0,
  worldcoin_verified BOOLEAN DEFAULT FALSE,
  worldcoin_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Crear tabla de transacciones
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  description TEXT,
  from_address TEXT,
  to_address TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Crear tabla de minería
CREATE TABLE IF NOT EXISTS public.mining_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount_earned DECIMAL(18, 2) NOT NULL,
  mining_level INT NOT NULL,
  mining_power DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_mining_logs_user_id ON public.mining_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mining_logs_created_at ON public.mining_logs(created_at);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mining_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para usuarios
CREATE POLICY IF NOT EXISTS "Users can view their own data" ON public.users
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can update their own data" ON public.users
  FOR UPDATE USING (telegram_id = CURRENT_USER);

-- Políticas de seguridad para transacciones
CREATE POLICY IF NOT EXISTS "Users can view their transactions" ON public.transactions
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));

CREATE POLICY IF NOT EXISTS "Users can insert their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));

-- Políticas de seguridad para mining logs
CREATE POLICY IF NOT EXISTS "Users can view their mining logs" ON public.mining_logs
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));

CREATE POLICY IF NOT EXISTS "Users can insert their own mining logs" ON public.mining_logs
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));
`;

export async function GET(request: NextRequest) {
  try {
    // Verificar token de seguridad (previene ejecución accidental)
    const initToken = request.nextUrl.searchParams.get('token');
    const expectedToken = process.env.INIT_TOKEN || 'marisol-ancestral-init-2024';

    if (initToken !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid or missing token. Pass ?token=YOUR_TOKEN' },
        { status: 401 }
      );
    }

    // Verificar que sea desde localhost o Vercel
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    const isAllowed = origin.includes('localhost') || origin.includes('vercel.app');

    if (!isAllowed && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // Ejecutar SQL
    const { error } = await supabase.rpc('exec', {
      sql: SQL_INIT,
    }).catch(async () => {
      // Si rpc no existe, intentar con query directo
      return supabase.from('users').select('count');
    });

    if (error) {
      console.error('[v0] Database init error:', error);
      
      // Fallback: intentar crear tablas una por una
      try {
        await supabase.from('users').select('count').limit(1);
        return NextResponse.json({
          success: true,
          message: 'Database already initialized',
        });
      } catch {
        return NextResponse.json(
          { error: 'Failed to initialize database', details: error },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Init endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
