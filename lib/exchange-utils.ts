/**
 * Utilidades para el sistema de cambio de monedas
 */

export const EXCHANGE_CONFIG = {
  BURN_PERCENTAGE: 5, // 5% quema por transacción
  WORLDCOIN_TO_MARISOL_RATE: 100, // 1 WC = 100 MAR-AP
};

export interface ExchangeResult {
  grossAmount: number;
  burnAmount: number;
  netAmount: number;
  rate: number;
}

/**
 * Calcula el resultado de un cambio de monedas
 */
export function calculateExchange(
  amount: number,
  fromCurrency: 'WC' | 'MAR-AP',
  toCurrency: 'WC' | 'MAR-AP'
): ExchangeResult {
  let grossAmount: number;
  
  if (fromCurrency === 'WC' && toCurrency === 'MAR-AP') {
    grossAmount = amount * EXCHANGE_CONFIG.WORLDCOIN_TO_MARISOL_RATE;
  } else if (fromCurrency === 'MAR-AP' && toCurrency === 'WC') {
    grossAmount = amount / EXCHANGE_CONFIG.WORLDCOIN_TO_MARISOL_RATE;
  } else {
    grossAmount = amount;
  }

  const burnAmount = grossAmount * (EXCHANGE_CONFIG.BURN_PERCENTAGE / 100);
  const netAmount = grossAmount - burnAmount;

  return {
    grossAmount,
    burnAmount,
    netAmount,
    rate: grossAmount / amount,
  };
}

/**
 * Calcula ganancias de minería según el nivel y cantidad
 */
export const MINING_LEVELS = {
  normal: { cost: 15, multiplier: 1, dailyReward: 1 },
  mediana: { cost: 25, multiplier: 1.5, dailyReward: 1.5 },
  premium: { cost: 40, multiplier: 2, dailyReward: 2 },
  diamante: { cost: 65, multiplier: 3, dailyReward: 3 },
};

export function calculateMiningReward(levelId: string, dailyRate: number = 1): number {
  const level = MINING_LEVELS[levelId as keyof typeof MINING_LEVELS];
  if (!level) return 0;
  return level.dailyReward;
}

/**
 * Calcula ganancias de bodega de ahorros según nivel y cantidad
 */
export const SAVINGS_LEVELS = {
  basica: { cost: 10, dailyRate: 0.0001 },
  plus: { cost: 20, dailyRate: 0.0002 },
  premium: { cost: 30, dailyRate: 0.0003 },
  elite: { cost: 50, dailyRate: 0.0005 },
};

export function calculateSavingsInterest(
  amount: number,
  levelId: string,
  daysElapsed: number = 1
): number {
  const level = SAVINGS_LEVELS[levelId as keyof typeof SAVINGS_LEVELS];
  if (!level) return 0;
  return amount * level.dailyRate * daysElapsed;
}

/**
 * Calcula el tiempo hasta el próximo pago de intereses
 */
export function getTimeTillNextClaim(lastClaimTime: Date | null): {
  hours: number;
  minutes: number;
  seconds: number;
  isReadyToClaim: boolean;
} {
  const CLAIM_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas

  if (!lastClaimTime) {
    return { hours: 0, minutes: 0, seconds: 0, isReadyToClaim: true };
  }

  const now = Date.now();
  const nextClaimTime = lastClaimTime.getTime() + CLAIM_INTERVAL;
  const timeRemaining = nextClaimTime - now;

  if (timeRemaining <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isReadyToClaim: true };
  }

  const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
  const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

  return { hours, minutes, seconds, isReadyToClaim: false };
}
