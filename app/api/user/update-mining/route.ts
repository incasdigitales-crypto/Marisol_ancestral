import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, balance, miningBalance } = await request.json();

    if (!telegramId || balance === undefined || miningBalance === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update both balance and mining balance (synchronized)
    const { data, error } = await supabase
      .from('users')
      .update({
        balance,
        mining_balance: miningBalance,
        last_mining_update: new Date().toISOString(),
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error updating mining:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      balance: data.balance,
      miningBalance: data.mining_balance,
      worldcoinVerified: data.worldcoin_verified || false,
      worldcoinAddress: data.worldcoin_address,
      miningPower: data.mining_power || 1,
      miningLevel: data.mining_level || 1,
      createdAt: data.created_at,
      lastMiningUpdate: data.last_mining_update,
    });
  } catch (error) {
    console.error('[v0] Error updating mining:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
