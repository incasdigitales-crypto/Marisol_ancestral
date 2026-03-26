'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { UserData } from '@/hooks/use-user';

interface SavingsSectionProps {
  user: UserData | null;
  onSavingsDeposit: (amount: number) => void;
  onClaimDailyInterest: () => void;
}

const SAVINGS_TIERS = [
  { level: 1, name: 'Jarra de Barro', cost: 0, costCurrency: 'MAR', multiplier: 1 },
  { level: 2, name: 'Cofre de Madera', cost: 5, costCurrency: 'WLD', multiplier: 1.5 },
  { level: 3, name: 'Arcón de Hierro', cost: 10, costCurrency: 'WLD', multiplier: 2 },
  { level: 4, name: 'Caja de Oro', cost: 20, costCurrency: 'WLD', multiplier: 2.5 },
  { level: 5, name: 'Bóveda Platinada', cost: 35, costCurrency: 'WLD', multiplier: 3 },
  { level: 6, name: 'Tesoro Sagrado', cost: 60, costCurrency: 'WLD', multiplier: 3.5 },
  { level: 7, name: 'Santuario Eterno', cost: 80, costCurrency: 'WLD', multiplier: 4 },
];

export default function SavingsSection({ user, onSavingsDeposit, onClaimDailyInterest }: SavingsSectionProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [canClaimInterest, setCanClaimInterest] = useState(false);
  const [timeUntilClaim, setTimeUntilClaim] = useState<string>('');

  // Calcular si puede reclamar interés diario
  useEffect(() => {
    if (!user?.lastSavingsUpdate) {
      setCanClaimInterest(true);
      return;
    }

    const lastUpdate = new Date(user.lastSavingsUpdate);
    const now = new Date();
    const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    if (diffHours >= 24) {
      setCanClaimInterest(true);
      setTimeUntilClaim('');
    } else {
      setCanClaimInterest(false);
      const hoursRemaining = 24 - diffHours;
      const hours = Math.floor(hoursRemaining);
      const minutes = Math.floor((hoursRemaining - hours) * 60);
      setTimeUntilClaim(`${hours}h ${minutes}m`);
    }

    const timer = setInterval(() => {
      const now = new Date();
      const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

      if (diffHours >= 24) {
        setCanClaimInterest(true);
        setTimeUntilClaim('');
        clearInterval(timer);
      } else {
        const hoursRemaining = 24 - diffHours;
        const hours = Math.floor(hoursRemaining);
        const minutes = Math.floor((hoursRemaining - hours) * 60);
        setTimeUntilClaim(`${hours}h ${minutes}m`);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [user?.lastSavingsUpdate]);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Ingresa una cantidad válida');
      return;
    }

    if (!user || amount > user.balance) {
      alert('Saldo insuficiente');
      return;
    }

    setIsDepositing(true);
    
    try {
      onSavingsDeposit(amount);
      setDepositAmount('');
      alert(`Depositado ${amount} MAR-AP en tu bodega`);
    } catch (error) {
      alert('Error al depositar');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleClaimInterest = async () => {
    if (!canClaimInterest) {
      alert('Aún no puedes reclamar el interés. Intenta en ' + timeUntilClaim);
      return;
    }

    try {
      onClaimDailyInterest();
      alert('¡Ganaste 1 MAR-AP de interés diario!');
    } catch (error) {
      alert('Error al reclamar interés');
    }
  };

  const savingsBalance = user?.savingsBalance || 0;
  const savingsLevel = user?.savingsLevel || 1;
  const currentTier = SAVINGS_TIERS.find(t => t.level === savingsLevel) || SAVINGS_TIERS[0];
  
  // Calculate daily interest based on savings amount and tier multiplier
  const dailyInterest = savingsBalance > 0 
    ? Math.max(1, (savingsBalance / 100) * currentTier.multiplier)
    : 0;

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-6 py-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Bodega</h2>
        <p className="text-sm text-foreground/60">Guarda tus monedas y gana interés diario</p>
      </div>

      {/* Savings Balance Display */}
      <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 text-center space-y-3">
        <p className="text-sm text-foreground/60">Saldo en Bodega</p>
        <p className="text-4xl font-bold text-primary">{savingsBalance.toFixed(2)}</p>
        <p className="text-xs text-foreground/50">MAR-AP Guardados</p>
      </Card>

      {/* Daily Interest Status */}
      <Card className={`border p-6 text-center space-y-3 transition-all ${
        canClaimInterest
          ? 'bg-primary/15 border-primary/40'
          : 'bg-card/40 border-primary/20'
      }`}>
        <div className="text-4xl">{canClaimInterest ? '🎁' : '⏳'}</div>
        <div>
          <p className="text-sm text-foreground/60 mb-1">Interés Diario</p>
          <p className={`text-lg font-bold ${canClaimInterest ? 'text-primary' : 'text-foreground/50'}`}>
            {canClaimInterest ? '¡Disponible!' : 'Próximo en: ' + timeUntilClaim}
          </p>
        </div>
        <p className="text-xs text-foreground/50">+{dailyInterest.toFixed(2)} MAR-AP cada 24 horas</p>

        {canClaimInterest && (
          <Button
            onClick={handleClaimInterest}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 mt-2"
          >
            Reclamar Interés
          </Button>
        )}
      </Card>

      {/* Deposit Section */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Depositar Monedas</h3>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Cantidad MAR-AP"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              disabled={isDepositing}
              className="flex-1 bg-card/50 border-primary/30 text-foreground"
            />
            <Button
              onClick={handleDeposit}
              disabled={isDepositing || !user || user.balance === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 disabled:opacity-50"
            >
              {isDepositing ? 'Depositando...' : 'Depositar'}
            </Button>
          </div>

          <div className="flex justify-between items-center text-xs text-foreground/60">
            <span>Saldo disponible:</span>
            <span className="text-primary font-semibold">{user?.balance.toFixed(2) || '0.00'} MAR-AP</span>
          </div>
        </div>
      </Card>

      {/* Current Tier Info */}
      <Card className="bg-primary/10 border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Tu Nivel Actual</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60">Nivel:</span>
            <span className="text-lg font-bold text-primary">{savingsLevel}: {currentTier.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60">Multiplicador:</span>
            <span className="text-lg font-bold text-primary">{currentTier.multiplier}x</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60">Fórmula:</span>
            <span className="text-sm text-foreground/70">Saldo ÷ 100 × {currentTier.multiplier}</span>
          </div>
        </div>
      </Card>

      {/* Tier List */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Todos los Niveles</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {SAVINGS_TIERS.map((tier) => (
            <div
              key={tier.level}
              className={`p-3 rounded-lg border transition-all ${
                tier.level === savingsLevel
                  ? 'bg-primary/20 border-primary/50'
                  : 'bg-card/30 border-primary/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-primary">Nivel {tier.level}: {tier.name}</p>
                  <p className="text-xs text-foreground/60">Multiplicador: {tier.multiplier}x</p>
                </div>
                <span className="text-xs font-bold text-foreground/70 whitespace-nowrap ml-2">
                  {tier.cost === 0 ? 'Gratis' : `${tier.cost} ${tier.costCurrency}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Benefits */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Beneficios</h3>
        <ul className="space-y-2 text-sm text-foreground/70">
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Gana 1 MAR-AP diario automáticamente</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Sin comisiones ni cargos ocultos</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Retira cuando quieras</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Seguro y descentralizado</span>
          </li>
        </ul>
      </Card>

      {/* Stats */}
      {savingsBalance > 0 && (
        <Card className="bg-primary/10 border border-primary/30 p-6 space-y-3 text-center">
          <p className="text-xs text-foreground/60">Proyección Anual</p>
          <p className="text-2xl font-bold text-primary">{(savingsBalance + (dailyInterest * 365)).toFixed(2)} MAR-AP</p>
          <p className="text-xs text-foreground/50">{dailyInterest.toFixed(2)} MAR/día × 365 días</p>
        </Card>
      )}
    </div>
  );
}
