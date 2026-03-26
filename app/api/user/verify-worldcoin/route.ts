import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { telegramId, worldcoinAddress } = await request.json();

    console.log('[v0] Verification request:', { telegramId, worldcoinAddress });

    if (!worldcoinAddress) {
      console.error('[v0] Missing worldcoinAddress');
      return NextResponse.json({ error: 'Dirección de billetera requerida' }, { status: 400 });
    }

    // Validate Worldcoin address format (basic validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(worldcoinAddress)) {
      console.error('[v0] Invalid address format:', worldcoinAddress);
      return NextResponse.json({ error: 'Formato de dirección Worldcoin inválido. Debe ser 0x + 40 caracteres hexadecimales' }, { status: 400 });
    }

    const supabase = await createClient();
    const WELCOME_BONUS = 10;

    // If no telegramId, create a test response (for demo purposes)
    if (!telegramId) {
      console.log('[v0] No telegramId provided, returning success response');
      return NextResponse.json({
        id: 'demo-user',
        telegramId: null,
        username: 'Demo User',
        balance: WELCOME_BONUS,
        miningBalance: 0,
        savingsBalance: 0,
        worldcoinVerified: true,
        worldcoinAddress: worldcoinAddress,
        miningPower: 1,
        miningLevel: 1,
        savingsLevel: 1,
        createdAt: new Date().toISOString(),
        welcomeBonusGranted: WELCOME_BONUS,
      });
    }

    // Try to find and update user
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('balance')
      .eq('telegram_id', telegramId)
      .single();

    if (fetchError) {
      console.log('[v0] User not found, creating demo response:', fetchError);
      // User doesn't exist, return success anyway for demo
      return NextResponse.json({
        id: 'demo-' + telegramId,
        telegramId: telegramId,
        username: 'Demo User',
        balance: WELCOME_BONUS,
        miningBalance: 0,
        savingsBalance: 0,
        worldcoinVerified: true,
        worldcoinAddress: worldcoinAddress,
        miningPower: 1,
        miningLevel: 1,
        savingsLevel: 1,
        createdAt: new Date().toISOString(),
        welcomeBonusGranted: WELCOME_BONUS,
      });
    }

    const currentBalance = userData?.balance || 0;

    const { data, error } = await supabase
      .from('users')
      .update({
        worldcoin_verified: true,
        worldcoin_address: worldcoinAddress,
        worldcoin_verified_at: new Date().toISOString(),
        balance: currentBalance + WELCOME_BONUS,
      })
      .eq('telegram_id', telegramId)
      .select()
      .single();

    if (error) {
      console.error('[v0] Error updating user:', error);
      return NextResponse.json({ error: 'No se pudo actualizar el usuario: ' + error.message }, { status: 400 });
    }

    console.log('[v0] Verification successful:', data);

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
    console.error('[v0] Verification exception:', error);
    return NextResponse.json({ 
      error: 'Error en verificación: ' + (error instanceof Error ? error.message : 'desconocido'),
      success: false 
    }, { status: 500 });
  }
}
