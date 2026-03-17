import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { telegramId } = await request.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Missing telegramId' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user data
    const { data: userData, error: getUserError } = await supabase
      .from('users')
      .select('balance, savings_balance, last_savings_update')
      .eq('telegram_id', telegramId)
      .single();

    if (getUserError) {
      return NextResponse.json({ error: getUserError.message }, { status: 400 });
    }

    // Check if 24 hours have passed since last interest claim
    const lastUpdate = userData.last_savings_update ? new Date(userData.last_savings_update) : new Date(0);
    const now = new Date();
    const diffMs = now.getTime() - lastUpdate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return NextResponse.json(
        { error: `You can claim interest again in ${(24 - diffHours).toFixed(1)} hours` },
        { status: 400 }
      );
    }

    const interestAmount = 1; // 1 MAR-AP per day
    const currentBalance = parseFloat(userData.balance) || 0;
    const newBalance = currentBalance + interestAmount;

    // Update user balance
    const { data, error } = await supabase
      .from('users')
      .update({
        balance: newBalance,
        last_savings_update: new Date().toISOString(),
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error claiming interest:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      balance: parseFloat(data.balance) || 0,
      savingsBalance: parseFloat(data.savings_balance) || 0,
      miningBalance: parseFloat(data.mining_balance) || 0,
      worldcoinVerified: data.worldcoin_verified,
      miningPower: parseFloat(data.mining_power) || 1,
      miningLevel: data.mining_level || 1,
      createdAt: data.created_at,
      lastSavingsUpdate: data.last_savings_update,
      interestClaimed: interestAmount,
    });
  } catch (error) {
    console.error('[v0] Error claiming interest:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
