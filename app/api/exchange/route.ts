import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { calculateExchange } from '@/lib/exchange-utils';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, fromCurrency, amount, toCurrency } = await request.json();

    if (!telegramId || !fromCurrency || !amount || !toCurrency) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get user
    const { data: userData, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (getUserError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate exchange
    const exchange = calculateExchange(amount, fromCurrency as 'WC' | 'MAR-AP', toCurrency as 'WC' | 'MAR-AP');

    // Check if user has enough balance
    const currentBalance = fromCurrency === 'WC' ? userData.balance : userData.balance;
    if (currentBalance < amount) {
      return NextResponse.json(
        { error: `Insufficient balance. Need ${amount} ${fromCurrency}, have ${currentBalance}` },
        { status: 400 }
      );
    }

    // Update balance (simulated - in production, use transactions)
    const updates = {
      updated_at: new Date().toISOString(),
    };

    const { data: updatedData, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (updateError) {
      console.error('[v0] Error updating exchange:', updateError);
      return NextResponse.json({ error: 'Exchange failed' }, { status: 400 });
    }

    // Log exchange transaction
    console.log('[v0] Exchange completed:', {
      telegramId,
      fromCurrency,
      amount,
      toCurrency,
      grossAmount: exchange.grossAmount,
      burnAmount: exchange.burnAmount,
      netAmount: exchange.netAmount,
    });

    return NextResponse.json({
      success: true,
      exchange: {
        fromCurrency,
        fromAmount: amount,
        toCurrency,
        grossAmount: exchange.grossAmount,
        burnAmount: exchange.burnAmount,
        netAmount: exchange.netAmount,
        burnPercentage: 5,
      },
      user: {
        balance: updatedData.balance,
        updatedAt: updatedData.updated_at,
      },
    });
  } catch (error) {
    console.error('[v0] Error in exchange:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
