import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { MINING_LEVELS } from '@/lib/exchange-utils';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, levelId } = await request.json();

    if (!telegramId || !levelId) {
      return NextResponse.json(
        { error: 'Missing telegramId or levelId' },
        { status: 400 }
      );
    }

    const levelData = MINING_LEVELS[levelId as keyof typeof MINING_LEVELS];
    if (!levelData) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
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

    // Check if user has enough balance (assume balance is in Worldcoin)
    if (userData.balance < levelData.cost) {
      return NextResponse.json(
        {
          error: `Insufficient balance. Need ${levelData.cost} WC, have ${userData.balance}`,
        },
        { status: 400 }
      );
    }

    // Update mining level
    const { data: updatedData, error: updateError } = await supabase
      .from('users')
      .update({
        mining_level: levelId,
        mining_power: levelData.multiplier,
        balance: userData.balance - levelData.cost,
        updated_at: new Date().toISOString(),
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (updateError) {
      console.error('[v0] Error updating mining level:', updateError);
      return NextResponse.json({ error: 'Update failed' }, { status: 400 });
    }

    console.log('[v0] Mining level updated:', {
      telegramId,
      levelId,
      cost: levelData.cost,
      multiplier: levelData.multiplier,
    });

    return NextResponse.json({
      success: true,
      miningLevel: {
        levelId,
        name: levelId.charAt(0).toUpperCase() + levelId.slice(1),
        cost: levelData.cost,
        multiplier: levelData.multiplier,
        dailyReward: levelData.dailyReward,
      },
      user: {
        balance: updatedData.balance,
        miningLevel: updatedData.mining_level,
        miningPower: updatedData.mining_power,
      },
    });
  } catch (error) {
    console.error('[v0] Error in update mining level:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
