'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  burnPercentage: number;
}

const EXCHANGE_RATES: ExchangeRate[] = [
  {
    from: 'WC',
    to: 'MAR-AP',
    rate: 100,
    burnPercentage: 5,
  },
  {
    from: 'MAR-AP',
    to: 'WC',
    rate: 0.01,
    burnPercentage: 5,
  },
];

interface ExchangeSectionProps {
  worldcoinBalance: number;
  marissolBalance: number;
  onExchange?: (fromCurrency: string, amount: number, toCurrency: string) => Promise<void>;
}

export function ExchangeSection({
  worldcoinBalance,
  marissolBalance,
  onExchange,
}: ExchangeSectionProps) {
  const [fromCurrency, setFromCurrency] = useState('WC');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const exchangeRate = EXCHANGE_RATES.find(
    r => r.from === fromCurrency
  );

  const toCurrency = exchangeRate?.to || 'MAR-AP';
  const convertedAmount = amount && exchangeRate
    ? (parseFloat(amount) * exchangeRate.rate).toFixed(4)
    : '0';

  const burnAmount = amount && exchangeRate
    ? (parseFloat(amount) * (exchangeRate.burnPercentage / 100)).toFixed(4)
    : '0';

  const finalAmount = amount && exchangeRate
    ? (parseFloat(amount) * exchangeRate.rate * (1 - exchangeRate.burnPercentage / 100)).toFixed(4)
    : '0';

  const userBalance = fromCurrency === 'WC' ? worldcoinBalance : marissolBalance;

  const handleExchange = async () => {
    setError('');
    setSuccess('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Ingresa una cantidad válida');
      return;
    }

    if (parseFloat(amount) > userBalance) {
      setError(`No tienes suficientes ${fromCurrency}`);
      return;
    }

    setIsProcessing(true);
    try {
      if (onExchange) {
        await onExchange(fromCurrency, parseFloat(amount), toCurrency);
        setAmount('');
        setSuccess('¡Cambio realizado exitosamente!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en cambio de monedas');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Cambio de Monedas</h3>
      <p className="text-sm text-foreground/70">Compra y vende monedas MAR-AP y Worldcoin</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Tarjeta Worldcoin */}
        <Card className={`p-4 border-2 cursor-pointer transition-all ${
          fromCurrency === 'WC' ? 'border-blue-500 bg-blue-500/10' : 'border-border'
        }`}>
          <div className="space-y-2">
            <div className="text-3xl">🪙</div>
            <p className="text-xs font-semibold">Worldcoin</p>
            <p className="text-2xl font-bold text-blue-500">{worldcoinBalance.toFixed(2)} WC</p>
            <Button
              size="sm"
              variant={fromCurrency === 'WC' ? 'default' : 'outline'}
              onClick={() => setFromCurrency('WC')}
              className="w-full text-xs"
            >
              {fromCurrency === 'WC' ? '✓ Seleccionado' : 'Seleccionar'}
            </Button>
          </div>
        </Card>

        {/* Tarjeta MAR-AP */}
        <Card className={`p-4 border-2 cursor-pointer transition-all ${
          fromCurrency === 'MAR-AP' ? 'border-yellow-500 bg-yellow-500/10' : 'border-border'
        }`}>
          <div className="space-y-2">
            <div className="text-3xl">💎</div>
            <p className="text-xs font-semibold">Marisol Ancestral</p>
            <p className="text-2xl font-bold text-yellow-500">{marissolBalance.toFixed(2)} MAR-AP</p>
            <Button
              size="sm"
              variant={fromCurrency === 'MAR-AP' ? 'default' : 'outline'}
              onClick={() => setFromCurrency('MAR-AP')}
              className="w-full text-xs"
            >
              {fromCurrency === 'MAR-AP' ? '✓ Seleccionado' : 'Seleccionar'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Formulario de cambio */}
      <Card className="p-4 bg-primary/5 border-primary/30 space-y-3">
        <div>
          <label className="text-xs font-semibold text-foreground">Cantidad a Cambiar</label>
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ingresa cantidad"
            />
            <span className="flex items-center font-bold text-foreground px-3 bg-background rounded border">
              {fromCurrency}
            </span>
          </div>
        </div>

        {/* Detalles de la transacción */}
        <div className="bg-background/50 rounded p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-foreground/70">Tipo de cambio:</span>
            <span className="font-bold">1 {fromCurrency} = {exchangeRate?.rate} {toCurrency}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-foreground/70">Convertirás:</span>
            <span className="font-bold text-green-500">{convertedAmount} {toCurrency}</span>
          </div>
          <div className="flex justify-between text-xs border-t border-border/50 pt-2">
            <span className="text-red-500">Quema (5%):</span>
            <span className="font-bold text-red-500">{burnAmount} {toCurrency}</span>
          </div>
          <div className="flex justify-between text-xs border-t border-border/50 pt-2 bg-green-500/10 rounded px-2 py-1">
            <span className="font-semibold text-green-600">Recibirás:</span>
            <span className="font-bold text-green-600">{finalAmount} {toCurrency}</span>
          </div>
        </div>

        <Button
          onClick={handleExchange}
          disabled={isProcessing || !amount}
          className="w-full"
        >
          {isProcessing ? 'Procesando cambio...' : `Cambiar ${fromCurrency} por ${toCurrency}`}
        </Button>
      </Card>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded p-3 text-xs text-red-500">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/20 border border-green-500 rounded p-3 text-xs text-green-500">
          {success}
        </div>
      )}

      <Card className="p-3 bg-warning/10 border-warning/50">
        <p className="text-xs text-foreground/70">
          ⚠️ Cada transacción tiene una quema del 5% para mantener el ecosistema equilibrado.
        </p>
      </Card>
    </div>
  );
}
