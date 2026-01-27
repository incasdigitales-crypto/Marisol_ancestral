import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const telegramId = request.nextUrl.searchParams.get('telegramId');

    if (!telegramId) {
      return NextResponse.json({ error: 'Missing telegramId' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error) {
      console.log('[v0] User not found:', error);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      balance: parseFloat(data.balance) || 0,
      miningBalance: parseFloat(data.mining_balance) || 0,
      worldcoinVerified: data.worldcoin_verified || false,
      worldcoinAddress: data.worldcoin_address,
      miningPower: parseFloat(data.mining_power) || 1,
      miningLevel: data.mining_level || 1,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error('[v0] Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
