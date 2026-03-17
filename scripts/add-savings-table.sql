-- Agregar columna de saldo de ahorros a la tabla de usuarios
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS savings_balance DECIMAL(18, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_savings_claim TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Crear tabla de registros de ahorros
CREATE TABLE IF NOT EXISTS public.savings_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  deposit_amount DECIMAL(18, 2) NOT NULL,
  interest_earned DECIMAL(18, 2) DEFAULT 0,
  daily_interest_rate DECIMAL(5, 4) DEFAULT 0.01, -- 1% diario
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_savings_logs_user_id ON public.savings_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_logs_created_at ON public.savings_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_users_savings_balance ON public.users(savings_balance);

-- Habilitar RLS en la tabla de ahorros
ALTER TABLE public.savings_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para savings logs
CREATE POLICY "Users can view their savings logs" ON public.savings_logs
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));

CREATE POLICY "Users can insert their own savings logs" ON public.savings_logs
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));
