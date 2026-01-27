import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, worldcoinAddress } = await request.json();

    if (!telegramId || !worldcoinAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .update({
        worldcoin_verified: true,
        worldcoin_address: worldcoinAddress,
        worldcoin_verified_at: new Date().toISOString(),
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error verifying Worldcoin:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      balance: data.balance || 0,
      miningBalance: data.mining_balance || 0,
      worldcoinVerified: data.worldcoin_verified,
      worldcoinAddress: data.worldcoin_address,
      miningPower: data.mining_power || 1,
      miningLevel: data.mining_level || 1,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error('[v0] Error verifying Worldcoin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
