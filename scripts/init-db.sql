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
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (telegram_id = CURRENT_USER);

-- Políticas de seguridad para transacciones
CREATE POLICY "Users can view their transactions" ON public.transactions
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));

CREATE POLICY "Users can insert their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));

-- Políticas de seguridad para mining logs
CREATE POLICY "Users can view their mining logs" ON public.mining_logs
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));

CREATE POLICY "Users can insert their own mining logs" ON public.mining_logs
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE telegram_id = CURRENT_USER));
