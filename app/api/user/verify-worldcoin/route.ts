import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, worldcoinAddress } = await request.json();

    if (!telegramId || !worldcoinAddress) {
      return NextResponse.json({ error: 'Campos requeridos faltantes: telegramId, worldcoinAddress' }, { status: 400 });
    }

    // Validate Worldcoin address format (basic validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(worldcoinAddress)) {
      return NextResponse.json({ error: 'Formato de dirección Worldcoin inválido' }, { status: 400 });
    }

    const supabase = await createClient();

    // Grant 10 MAR tokens on first verification
    const WELCOME_BONUS = 10;
    const currentBalance = (await supabase
      .from('users')
      .select('balance')
      .eq('telegram_id', telegramId)
      .single()
    )?.data?.balance || 0;

    const { data, error } = await supabase
      .from('users')
      .update({
        worldcoin_verified: true,
        worldcoin_address: worldcoinAddress,
        worldcoin_verified_at: new Date().toISOString(),
        balance: currentBalance + WELCOME_BONUS, // Add 10 MAR welcome bonus
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error al verificar Worldcoin:', error);
      return NextResponse.json({ error: 'No se pudo actualizar el usuario' }, { status: 400 });
    }

    return NextResponse.json({
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      balance: data.balance || 0,
      miningBalance: data.mining_balance || 0,
      savingsBalance: data.savings_balance || 0,
      worldcoinVerified: data.worldcoin_verified,
      worldcoinAddress: data.worldcoin_address,
      miningPower: data.mining_power || 1,
      miningLevel: data.mining_level || 1,
      savingsLevel: data.savings_level || 1,
      createdAt: data.created_at,
      welcomeBonusGranted: WELCOME_BONUS,
    });
  } catch (error) {
    console.error('[v0] Error al verificar Worldcoin:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
