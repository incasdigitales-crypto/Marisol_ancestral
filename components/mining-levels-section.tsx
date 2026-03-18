'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MiningLevel {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  description: string;
  icon: string;
  dailyReward: number;
}

const MINING_LEVELS: MiningLevel[] = [
  {
    id: 'normal',
    name: 'Normal',
    cost: 15,
    multiplier: 1,
    description: 'Nivel básico de minería',
    icon: '⛏️',
    dailyReward: 1,
  },
  {
    id: 'mediana',
    name: 'Mediana',
    cost: 25,
    multiplier: 1.5,
    description: 'Multiplica ganancias x1.5',
    icon: '⛏️⛏️',
    dailyReward: 1.5,
  },
  {
    id: 'premium',
    name: 'Premium',
    cost: 40,
    multiplier: 2,
    description: 'Multiplica ganancias x2',
    icon: '⛏️⛏️⛏️',
    dailyReward: 2,
  },
  {
    id: 'diamante',
    name: 'Diamante',
    cost: 65,
    multiplier: 3,
    description: 'Máximo nivel Premium - x3',
    icon: '💎',
    dailyReward: 3,
  },
];

interface MiningLevelsSectionProps {
  userBalance: number;
  currentLevel?: string;
  onUpgrade?: (levelId: string, cost: number) => Promise<void>;
}

export function MiningLevelsSection({
  userBalance,
  currentLevel = 'normal',
  onUpgrade,
}: MiningLevelsSectionProps) {
  const [selectedLevel, setSelectedLevel] = useState(currentLevel);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpgrade = async (level: MiningLevel) => {
    if (isUpgrading) return;

    setError('');
    setSuccess('');

    if (userBalance < level.cost) {
      setError(`Necesitas ${level.cost} Worldcoin para este nivel`);
      return;
    }

    setIsUpgrading(true);
    try {
      if (onUpgrade) {
        await onUpgrade(level.id, level.cost);
        setSelectedLevel(level.id);
        setSuccess(`¡Actualizado a nivel ${level.name}!`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Etapas de Minería</h3>
      <p className="text-sm text-foreground/70">Selecciona tu nivel de minería y gana más monedas</p>

      <div className="grid grid-cols-2 gap-3">
        {MINING_LEVELS.map((level) => (
          <Card
            key={level.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedLevel === level.id
                ? 'border-primary bg-primary/10 ring-2 ring-primary'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedLevel(level.id)}
          >
            <div className="space-y-2">
              <div className="text-3xl">{level.icon}</div>
              <h4 className="font-bold text-sm">{level.name}</h4>
              <p className="text-xs text-foreground/70">{level.description}</p>

              <div className="space-y-1 pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span>Costo:</span>
                  <span className="font-bold text-primary">{level.cost} WC</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Multiplicador:</span>
                  <span className="font-bold text-green-500">{level.multiplier}x</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Ganancia Diaria:</span>
                  <span className="font-bold text-yellow-500">{level.dailyReward} MAR-AP</span>
                </div>
              </div>

              {selectedLevel === level.id && (
                <Button
                  onClick={() => handleUpgrade(level)}
                  disabled={isUpgrading || userBalance < level.cost}
                  className="w-full mt-2 text-xs py-2 h-auto"
                >
                  {isUpgrading ? 'Actualizando...' : `Activar ${level.cost} WC`}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {error && <div className="bg-red-500/20 border border-red-500 rounded p-2 text-xs text-red-500">{error}</div>}
      {success && <div className="bg-green-500/20 border border-green-500 rounded p-2 text-xs text-green-500">{success}</div>}

      <div className="bg-primary/10 border border-primary/50 rounded p-3 space-y-2">
        <p className="text-xs font-semibold text-foreground">Tu Saldo Worldcoin:</p>
        <p className="text-2xl font-bold text-primary">{userBalance.toFixed(2)} WC</p>
      </div>
    </div>
  );
}
