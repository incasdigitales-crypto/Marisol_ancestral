import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Simple Worldcoin verification simulation
// En producción, esto debería integrar con Worldcoin SDK
export async function POST(request: NextRequest) {
  try {
    const { telegramId } = await request.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Missing telegramId' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current user
    const { data: userData, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (getUserError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already verified
    if (userData.worldcoin_verified) {
      return NextResponse.json({
        success: true,
        message: 'Already verified',
        worldcoinAddress: userData.worldcoin_address,
      });
    }

    // Generate a unique Worldcoin-like address based on user data
    // In production, this would come from actual Worldcoin verification
    const worldcoinAddress = generateWorldcoinAddress(telegramId);

    // Update user verification status
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
      console.error('[v0] Error updating Worldcoin verification:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Worldcoin verification successful',
      worldcoinAddress: data.worldcoin_address,
      user: {
        id: data.id,
        telegramId: data.telegram_id,
        username: data.username,
        balance: parseFloat(data.balance) || 0,
        miningBalance: parseFloat(data.mining_balance) || 0,
        worldcoinVerified: data.worldcoin_verified,
        worldcoinAddress: data.worldcoin_address,
        miningPower: parseFloat(data.mining_power) || 1,
        miningLevel: data.mining_level || 1,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error('[v0] Error in Worldcoin verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Generate a deterministic Worldcoin-like address from telegramId
function generateWorldcoinAddress(telegramId: string): string {
  // Create a hash-like address based on telegramId
  // Format: 0x + 40 hex characters
  let hash = 0;
  
  for (let i = 0; i < telegramId.length; i++) {
    const char = telegramId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and pad
  const hexString = Math.abs(hash).toString(16).padStart(40, '0');
  return '0x' + hexString.substring(0, 40);
}
