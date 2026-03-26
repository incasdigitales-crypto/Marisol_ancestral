'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { UserData } from '@/hooks/use-user';

interface MiningSectionProps {
  user: UserData | null;
  onMiningEarnings: (amount: number) => void;
  onUpgrade: (cost: number) => void;
}

const MINING_CONFIGS = [
  { 
    level: 1, 
    name: 'Aprendiz',
    dailyEarning: 2, 
    upgradeCost: 0,
    costCurrency: 'MAR'
  },
  { 
    level: 2, 
    name: 'Minero',
    dailyEarning: 5, 
    upgradeCost: 15,
    costCurrency: 'WLD'
  },
  { 
    level: 3, 
    name: 'Maestro',
    dailyEarning: 7, 
    upgradeCost: 25,
    costCurrency: 'WLD'
  },
  { 
    level: 4, 
    name: 'Leyenda',
    dailyEarning: 10, 
    upgradeCost: 40,
    costCurrency: 'WLD'
  },
  { 
    level: 5, 
    name: 'Dragón Ancestral',
    dailyEarning: 20, 
    upgradeCost: 75,
    costCurrency: 'WLD'
  },
];

export default function MiningSection({ user, onMiningEarnings, onUpgrade }: MiningSectionProps) {
  const [isMining, setIsMining] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  const currentConfig = MINING_CONFIGS.find(c => c.level === user?.miningLevel) || MINING_CONFIGS[0];
  const nextConfig = MINING_CONFIGS[user?.miningLevel ?? 0];

  // Mining loop - earns daily amount distributed over 24 hours (86400 seconds)
  useEffect(() => {
    if (!isMining || !user) return;

    const interval = setInterval(() => {
      // Daily earning divided by number of seconds in a day
      const earningPerSecond = currentConfig.dailyEarning / 86400;
      setTotalEarned(prev => prev + earningPerSecond);
      onMiningEarnings(earningPerSecond);
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMining, user, currentConfig, onMiningEarnings]);

  const handleStartMining = () => {
    if (user?.worldcoinVerified) {
      setIsMining(true);
    } else {
      alert('Debes verificar tu identidad con Worldcoin primero');
    }
  };

  const handleStopMining = () => {
    setIsMining(false);
  };

  const handleUpgrade = () => {
    if (!nextConfig) {
      alert('Has alcanzado el nivel máximo de minería');
      return;
    }
    onUpgrade(nextConfig.upgradeCost);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-6 py-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Mina MAR-AP</h2>
        <p className="text-sm text-foreground/60">Gana tokens mediante minería ancestral</p>
      </div>

      {/* Mining Status */}
      <Card className={`border p-6 text-center space-y-4 transition-all ${
        isMining
          ? 'bg-primary/15 border-primary/40'
          : 'bg-card/40 border-primary/20'
      }`}>
        <div className="text-5xl animate-pulse">{isMining ? '⛏️' : '🔒'}</div>
        <div>
          <p className="text-sm text-foreground/60 mb-1">Estado</p>
          <p className={`text-2xl font-bold ${isMining ? 'text-primary' : 'text-foreground/50'}`}>
            {isMining ? 'Minando...' : 'Parado'}
          </p>
        </div>
        <p className="text-xs text-foreground/50">{formatTime(sessionTime)}</p>
      </Card>

      {/* Earnings Display */}
      <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 text-center space-y-3">
        <p className="text-sm text-foreground/60">Ganados en esta sesión</p>
        <p className="text-4xl font-bold text-primary">{totalEarned.toFixed(2)}</p>
        <p className="text-xs text-foreground/50">MAR-AP Tokens</p>
      </Card>

      {/* Mining Level Info */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Nivel de Minería</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60">Nivel Actual</span>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{user?.miningLevel || 1}: {currentConfig.name}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60">Ganancia Diaria</span>
            <span className="text-lg font-bold text-primary">{currentConfig.dailyEarning} MAR/día</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/60">Por Segundo</span>
            <span className="text-sm text-foreground/70">{(currentConfig.dailyEarning / 86400).toFixed(6)} MAR</span>
          </div>
        </div>

        {/* Progress to next level */}
        {nextConfig && (
          <div className="pt-4 border-t border-primary/20 space-y-3">
            <p className="text-xs text-foreground/60">Próximo: Nivel {nextConfig.level} - {nextConfig.name}</p>
            <div className="bg-card/50 rounded-full h-2 overflow-hidden border border-primary/20">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min((totalEarned / (nextConfig.upgradeCost || 100)) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-foreground/60">Costo: {nextConfig.upgradeCost} {nextConfig.costCurrency}</span>
              <span className="text-xs text-foreground/60">Ganancia: {nextConfig.dailyEarning} MAR/día</span>
            </div>
          </div>
        )}
      </Card>

      {/* Mining Controls */}
      <div className="space-y-3">
        {!isMining ? (
          <Button
            onClick={handleStartMining}
            disabled={!user?.worldcoinVerified}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 disabled:opacity-50"
          >
            {user?.worldcoinVerified ? 'Iniciar Minería' : 'Verifica Worldcoin Primero'}
          </Button>
        ) : (
          <Button
            onClick={handleStopMining}
            className="w-full bg-primary/50 hover:bg-primary/60 text-primary-foreground font-semibold py-6"
          >
            Detener Minería
          </Button>
        )}

        {user?.miningLevel && user.miningLevel < MINING_CONFIGS.length && (
          <Button
            onClick={handleUpgrade}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 font-semibold py-4"
          >
            Mejorar a Nivel {(user.miningLevel + 1)}: {nextConfig?.name} - {nextConfig?.upgradeCost} {nextConfig?.costCurrency}
          </Button>
        )}
      </div>

      {/* Requirements */}
      <Card className="bg-card/30 backdrop-blur border border-primary/20 p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground/70 uppercase">Requisitos</p>
        <ul className="space-y-2 text-xs text-foreground/60">
          <li className={`flex gap-2 ${user?.worldcoinVerified ? 'text-primary' : 'text-foreground/50'}`}>
            <span>{user?.worldcoinVerified ? '✓' : '○'}</span>
            <span>Verificación Worldcoin</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Conexión a Internet Activa</span>
          </li>
          <li className="flex gap-2">
            <span>✓</span>
            <span>Mini App en Telegram Abierta</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
