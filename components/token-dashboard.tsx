'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { UserData } from '@/hooks/use-user';

interface TokenDashboardProps {
  onBack: () => void;
  user: UserData | null;
  onTransfer?: (amount: number, recipient: string) => void;
}

export default function TokenDashboard({ onBack, user, onTransfer }: TokenDashboardProps) {
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const balance = user?.balance ?? 0;
  const miningBalance = user?.miningBalance ?? 0;

  const handleTransfer = () => {
    if (!transferAmount || !recipientAddress) {
      alert('Completa todos los campos');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (amount > balance) {
      alert('Saldo insuficiente');
      return;
    }

    if (onTransfer) {
      onTransfer(amount, recipientAddress);
    } else {
      alert(`Transferencia de ${amount} MAR-AP a ${recipientAddress}`);
    }

    setTransferAmount('');
    setRecipientAddress('');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Mi Balance</h2>
        <Button
          onClick={onBack}
          variant="outline"
          className="text-foreground/60 hover:text-foreground bg-transparent"
        >
          ← Atrás
        </Button>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-8 text-center space-y-3">
        <div>
          <p className="text-sm text-foreground/60 mb-2">Billetera Total</p>
          <p className="text-5xl font-bold text-primary mb-2">{balance.toFixed(2)}</p>
          <p className="text-sm text-foreground/70">Marisol Ancestral Token (MAR-AP)</p>
        </div>
        {miningBalance > 0 && (
          <div className="pt-3 border-t border-primary/20">
            <p className="text-xs text-foreground/60 mb-1">Ganado por Minería</p>
            <p className="text-2xl font-bold text-primary/80">{miningBalance.toFixed(2)}</p>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-card/40 backdrop-blur border border-primary/20 p-4 text-center">
          <p className="text-xs text-foreground/60 mb-2">Nivel</p>
          <p className="text-xl font-bold text-primary">{user?.miningLevel || 1}</p>
        </Card>
        <Card className="bg-card/40 backdrop-blur border border-primary/20 p-4 text-center">
          <p className="text-xs text-foreground/60 mb-2">Poder</p>
          <p className="text-xl font-bold text-primary">{user?.miningPower || 1}x</p>
        </Card>
        <Card className="bg-card/40 backdrop-blur border border-primary/20 p-4 text-center">
          <p className="text-xs text-foreground/60 mb-2">Verificado</p>
          <p className="text-xl font-bold text-primary">{user?.worldcoinVerified ? '✓' : '○'}</p>
        </Card>
      </div>

      {/* Transfer Section */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Transferir Tokens</h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-foreground/60 block mb-2">
              Dirección del Destinatario
            </label>
            <Input
              type="text"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="bg-input/50 border-primary/20 text-foreground placeholder:text-foreground/30"
            />
          </div>

          <div>
            <label className="text-xs text-foreground/60 block mb-2">
              Cantidad (MAR-AP)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="bg-input/50 border-primary/20 text-foreground placeholder:text-foreground/30"
            />
          </div>

          <Button
            onClick={handleTransfer}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
          >
            Transferir Ahora
          </Button>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Transacciones Recientes</h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[
            { type: 'Enviado', amount: '-100', address: '0x8B...E3F2', date: 'Hace 2h' },
            { type: 'Recibido', amount: '+250', address: '0x5A...C1D4', date: 'Hace 5h' },
            { type: 'Enviado', amount: '-50', address: '0x3F...A7B9', date: 'Ayer' },
            { type: 'Recibido', amount: '+500', address: '0x9C...D2E8', date: 'Ayer' },
            { type: 'Enviado', amount: '-75', address: '0x2E...F4H6', date: 'Hace 3d' },
          ].map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-card/30 rounded-lg border border-primary/10"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {tx.type}
                </p>
                <p className="text-xs text-foreground/50">{tx.address}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    tx.amount.startsWith('+')
                      ? 'text-primary'
                      : 'text-foreground/70'
                  }`}
                >
                  {tx.amount}
                </p>
                <p className="text-xs text-foreground/40">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-4 text-center">
        <p className="text-xs text-foreground/60">
          Contrato: 0xMARISOL...ANCESTRAL
        </p>
      </Card>
    </div>
  );
}
