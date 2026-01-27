import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const MINING_LEVELS = [
  { level: 1, power: 1, cost: 0 },
  { level: 2, power: 2, cost: 50 },
  { level: 3, power: 3, cost: 150 },
  { level: 4, power: 5, cost: 500 },
  { level: 5, power: 10, cost: 2000 },
];

export async function POST(request: NextRequest) {
  try {
    const { telegramId, cost } = await request.json();

    if (!telegramId || cost === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Validate balance
    if (user.balance < cost) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Get next level config
    const currentLevel = user.mining_level || 1;
    const nextLevelConfig = MINING_LEVELS.find(l => l.level === currentLevel + 1);

    if (!nextLevelConfig) {
      return NextResponse.json({ error: 'Maximum level reached' }, { status: 400 });
    }

    // Validate cost
    if (nextLevelConfig.cost !== cost) {
      return NextResponse.json({ error: 'Invalid cost' }, { status: 400 });
    }

    // Update user
    const { data, error } = await supabase
      .from('users')
      .update({
        balance: user.balance - cost,
        mining_level: nextLevelConfig.level,
        mining_power: nextLevelConfig.power,
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error upgrading mining:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      balance: data.balance,
      miningBalance: data.mining_balance || 0,
      worldcoinVerified: data.worldcoin_verified || false,
      worldcoinAddress: data.worldcoin_address,
      miningPower: data.mining_power,
      miningLevel: data.mining_level,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error('[v0] Error upgrading mining:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
