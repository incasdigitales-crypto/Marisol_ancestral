import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, username } = await request.json();

    if (!telegramId || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert new user with balance = 0
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          telegram_id: telegramId,
          username,
          balance: 0,
          mining_balance: 0,
          worldcoin_verified: false,
          mining_power: 1,
          mining_level: 1,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[v0] Error creating user:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      balance: data.balance || 0,
      miningBalance: data.mining_balance || 0,
      worldcoinVerified: data.worldcoin_verified || false,
      worldcoinAddress: data.worldcoin_address,
      miningPower: data.mining_power || 1,
      miningLevel: data.mining_level || 1,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error('[v0] Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
