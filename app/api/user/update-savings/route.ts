import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, savingsDeposit } = await request.json();

    if (!telegramId || savingsDeposit === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user data
    const { data: userData, error: getUserError } = await supabase
      .from('users')
      .select('balance, savings_balance')
      .eq('telegram_id', telegramId)
      .single();

    if (getUserError) {
      return NextResponse.json({ error: getUserError.message }, { status: 400 });
    }

    const currentBalance = parseFloat(userData.balance) || 0;
    const currentSavings = parseFloat(userData.savings_balance) || 0;
    const newBalance = currentBalance - savingsDeposit;
    const newSavings = currentSavings + savingsDeposit;

    if (newBalance < 0) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Update user balance and savings
    const { data, error } = await supabase
      .from('users')
      .update({
        balance: newBalance,
        savings_balance: newSavings,
        last_savings_update: new Date().toISOString(),
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error updating savings:', error);
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
    });
  } catch (error) {
    console.error('[v0] Error updating savings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
