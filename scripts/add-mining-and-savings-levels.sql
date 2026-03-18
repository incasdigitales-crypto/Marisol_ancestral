-- Add mining level fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS mining_level_active INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS mining_level_activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS savings_level_active INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS savings_level_activated_at TIMESTAMP WITH TIME ZONE;

-- Create mining_levels table
CREATE TABLE IF NOT EXISTS public.mining_levels (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  cost_worldcoin DECIMAL(18, 2) NOT NULL,
  multiplier DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert mining level data
INSERT INTO public.mining_levels (id, name, cost_worldcoin, multiplier, description) VALUES
  (1, 'Normal', 15, 1.0, 'Etapa inicial de minería'),
  (2, 'Mediana', 25, 1.5, 'Etapa intermedia con mejor rendimiento'),
  (3, 'Premium', 40, 2.0, 'Etapa avanzada con ganancias mejoradas'),
  (4, 'Diamante', 65, 3.0, 'Etapa máxima con mejores multiplicadores')
ON CONFLICT (id) DO NOTHING;

-- Create savings_levels table
CREATE TABLE IF NOT EXISTS public.savings_levels (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  cost_marisol DECIMAL(18, 2) NOT NULL,
  multiplier DECIMAL(10, 6) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert savings level data
INSERT INTO public.savings_levels (id, name, cost_marisol, multiplier, description) VALUES
  (1, 'Bodega Básica', 10, 0.0001, 'Bodega inicial con interés bajo'),
  (2, 'Bodega Plus', 20, 0.0002, 'Bodega intermedia con mejor interés'),
  (3, 'Bodega Premium', 30, 0.0003, 'Bodega avanzada con interés mejorado'),
  (4, 'Bodega Élite', 50, 0.0005, 'Bodega máxima con mayor generación de interés')
ON CONFLICT (id) DO NOTHING;

-- Create exchange_logs table for tracking transactions
CREATE TABLE IF NOT EXISTS public.exchange_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exchange_type VARCHAR(20) NOT NULL CHECK (exchange_type IN ('buy_mar', 'sell_mar')),
  from_currency VARCHAR(10) NOT NULL,
  to_currency VARCHAR(10) NOT NULL,
  from_amount DECIMAL(18, 2) NOT NULL,
  to_amount DECIMAL(18, 2) NOT NULL,
  burned_amount DECIMAL(18, 2) NOT NULL DEFAULT 0,
  exchange_rate DECIMAL(18, 6) NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create price_history table for tracking MAR-AP prices
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price DECIMAL(18, 6) NOT NULL,
  change_percent DECIMAL(10, 4),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add total_burned field if not exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS total_burned DECIMAL(18, 2) DEFAULT 0;

-- Add last_exchange field if not exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_exchange TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exchange_logs_user_id ON public.exchange_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_logs_created_at ON public.exchange_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_price_history_timestamp ON public.price_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_price_history_created_at ON public.price_history(created_at);
