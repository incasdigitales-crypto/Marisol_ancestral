'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface SavingsLevel {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  description: string;
  icon: string;
  dailyRate: number;
}

const SAVINGS_LEVELS: SavingsLevel[] = [
  {
    id: 'basica',
    name: 'Básica',
    cost: 10,
    multiplier: 0.0001,
    description: 'Gana 0.0001x diarios',
    icon: '🏦',
    dailyRate: 0.0001,
  },
  {
    id: 'plus',
    name: 'Plus',
    cost: 20,
    multiplier: 0.0002,
    description: 'Gana 0.0002x diarios',
    icon: '🏦🏦',
    dailyRate: 0.0002,
  },
  {
    id: 'premium',
    name: 'Premium',
    cost: 30,
    multiplier: 0.0003,
    description: 'Gana 0.0003x diarios',
    icon: '🏦🏦🏦',
    dailyRate: 0.0003,
  },
  {
    id: 'elite',
    name: 'Élite',
    cost: 50,
    multiplier: 0.0005,
    description: 'Gana 0.0005x diarios',
    icon: '💰',
    dailyRate: 0.0005,
  },
];

interface SavingsLevelsSectionProps {
  savingsBalance: number;
  currentLevel?: string;
  onDeposit?: (amount: number, levelId: string) => Promise<void>;
  onClaim?: () => Promise<void>;
}

export function SavingsLevelsSection({
  savingsBalance,
  currentLevel = 'basica',
  onDeposit,
  onClaim,
}: SavingsLevelsSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedLevelData = SAVINGS_LEVELS.find(l => l.id === selectedLevel);
  const estimatedDaily = depositAmount && selectedLevelData
    ? (parseFloat(depositAmount) * selectedLevelData.dailyRate).toFixed(6)
    : '0';

  const handleDeposit = async () => {
    setError('');
    setSuccess('');

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    if (parseFloat(depositAmount) > savingsBalance) {
      setError('No tienes suficientes monedas');
      return;
    }

    setIsProcessing(true);
    try {
      if (onDeposit) {
        await onDeposit(parseFloat(depositAmount), selectedLevel);
        setDepositAmount('');
        setSuccess('¡Depósito realizado exitosamente!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en depósito');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Bodega de Ahorros</h3>
      <p className="text-sm text-foreground/70">Guarda tus monedas y gana intereses diarios</p>

      <div className="grid grid-cols-2 gap-3">
        {SAVINGS_LEVELS.map((level) => (
          <Card
            key={level.id}
            className={`p-3 cursor-pointer transition-all ${
              selectedLevel === level.id
                ? 'border-primary bg-primary/10 ring-2 ring-primary'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedLevel(level.id)}
          >
            <div className="space-y-2">
              <div className="text-2xl">{level.icon}</div>
              <h4 className="font-bold text-sm">{level.name}</h4>
              <p className="text-xs text-foreground/70">{level.description}</p>

              <div className="space-y-1 pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span>Costo:</span>
                  <span className="font-bold text-primary">{level.cost} MAR-AP</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Tasa Diaria:</span>
                  <span className="font-bold text-green-500">{level.dailyRate}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedLevelData && (
        <Card className="p-4 bg-primary/5 border-primary/30">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Cantidad a Depositar</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Ingresa cantidad"
                className="mt-1"
              />
            </div>

            <div className="bg-background/50 rounded p-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground/70">Nivel: {selectedLevelData.name}</span>
                <span className="font-bold text-primary">{selectedLevelData.dailyRate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/70">Ganancia Estimada Diaria:</span>
                <span className="font-bold text-green-500">{estimatedDaily} MAR-AP</span>
              </div>
            </div>

            <Button
              onClick={handleDeposit}
              disabled={isProcessing || !depositAmount}
              className="w-full"
            >
              {isProcessing ? 'Procesando...' : 'Depositar en Bodega'}
            </Button>

            {onClaim && (
              <Button
                onClick={onClaim}
                variant="outline"
                className="w-full text-xs"
              >
                Reclamar Intereses
              </Button>
            )}
          </div>
        </Card>
      )}

      {error && <div className="bg-red-500/20 border border-red-500 rounded p-2 text-xs text-red-500">{error}</div>}
      {success && <div className="bg-green-500/20 border border-green-500 rounded p-2 text-xs text-green-500">{success}</div>}

      <div className="bg-primary/10 border border-primary/50 rounded p-3">
        <p className="text-xs font-semibold text-foreground">Tu Saldo MAR-AP:</p>
        <p className="text-2xl font-bold text-primary">{savingsBalance.toFixed(2)}</p>
      </div>
    </div>
  );
}
