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
  const interestRate = 1; // 1 MAR-AP por día

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
        <p className="text-xs text-foreground/50">+{interestRate} MAR-AP cada 24 horas</p>

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

      {/* How it Works */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">¿Cómo Funciona?</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="text-primary font-bold min-w-6">1</div>
            <p className="text-foreground/70">Deposita MAR-AP en tu bodega</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold min-w-6">2</div>
            <p className="text-foreground/70">Espera 24 horas</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold min-w-6">3</div>
            <p className="text-foreground/70">Reclama 1 MAR-AP de interés diario</p>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-bold min-w-6">4</div>
            <p className="text-foreground/70">¡Gana indefinidamente!</p>
          </div>
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
          <p className="text-2xl font-bold text-primary">{(savingsBalance + 365).toFixed(2)} MAR-AP</p>
          <p className="text-xs text-foreground/50">Si mantienes tu bodega llena</p>
        </Card>
      )}
    </div>
  );
}
