'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceData {
  date: string;
  price: number;
  trend: 'up' | 'down';
}

interface PriceChartSectionProps {
  priceHistory?: PriceData[];
  currentPrice?: number;
  change24h?: number;
}

// Datos simulados para demostración (últimos 7 días)
const DEFAULT_PRICE_HISTORY: PriceData[] = [
  { date: 'Lun', price: 0.0045, trend: 'up' },
  { date: 'Mar', price: 0.0052, trend: 'up' },
  { date: 'Mié', price: 0.0048, trend: 'down' },
  { date: 'Jue', price: 0.0055, trend: 'up' },
  { date: 'Vie', price: 0.0060, trend: 'up' },
  { date: 'Sáb', price: 0.0058, trend: 'down' },
  { date: 'Dom', price: 0.0065, trend: 'up' },
];

export function PriceChartSection({
  priceHistory = DEFAULT_PRICE_HISTORY,
  currentPrice = 0.0065,
  change24h = 12.5,
}: PriceChartSectionProps) {
  const isPositive = change24h >= 0;
  const colors = isPositive ? '#10b981' : '#ef4444';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">Gráfico de Precio MAR-AP</h3>

      {/* Información general */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-foreground/70">Precio Actual</p>
          <p className="text-2xl font-bold text-primary mt-1">
            ${currentPrice.toFixed(6)}
          </p>
        </Card>

        <Card className={`p-4 ${isPositive ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
          <p className="text-xs text-foreground/70">Cambio 24h</p>
          <p className={`text-2xl font-bold mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
          </p>
        </Card>
      </div>

      {/* Gráfico */}
      <Card className="p-4 bg-background/50">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <Tooltip
              formatter={(value) => `$${(value as number).toFixed(6)}`}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: `1px solid ${colors}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={colors}
              strokeWidth={2}
              dot={{ fill: colors, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Información adicional */}
      <Card className="p-4 bg-primary/5 border-primary/30">
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground">Información del Mercado</h4>
          <div className="space-y-1 text-xs text-foreground/70">
            <p>📊 Últimos 7 días de datos de precio</p>
            <p>💰 Compra low y vende high para maximizar ganancias</p>
            <p>🔄 Los precios se actualizan cada 6 horas</p>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <Card className="p-2 text-center">
          <p className="text-foreground/70">Mín 7d</p>
          <p className="font-bold text-red-500">$0.0045</p>
        </Card>
        <Card className="p-2 text-center">
          <p className="text-foreground/70">Promedio</p>
          <p className="font-bold text-primary">$0.0055</p>
        </Card>
        <Card className="p-2 text-center">
          <p className="text-foreground/70">Máx 7d</p>
          <p className="font-bold text-green-500">$0.0065</p>
        </Card>
      </div>
    </div>
  );
}
