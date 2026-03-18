'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import HeroSection from '@/components/hero-section';
import TokenDashboard from '@/components/token-dashboard';
import WorldcoinSection from '@/components/worldcoin-section';
import MiningSection from '@/components/mining-section';
import SavingsSection from '@/components/savings-section';
import { MiningLevelsSection } from '@/components/mining-levels-section';
import { SavingsLevelsSection } from '@/components/savings-levels-section';
import { ExchangeSection } from '@/components/exchange-section';
import { PriceChartSection } from '@/components/price-chart-section';
import { AIAssistantSection } from '@/components/ai-assistant-section';

type View = 'hero' | 'dashboard' | 'mining' | 'worldcoin' | 'savings' | 'exchange' | 'prices' | 'mining-levels' | 'savings-levels';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('hero');
  const { user, loading, updateBalance, updateMiningBalance, upgradeMining, setWorldcoinVerified, depositToSavings, claimSavingsInterest } = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram) {
      (window as any).Telegram.WebApp.ready();
      (window as any).Telegram.WebApp.expand();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-3xl">✨</p>
          <p className="text-foreground/60">Inicializando Marisol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Mystical Background */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-background via-background to-background" />

      {/* Animated Glow Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-primary/10">
        <nav className="flex items-center justify-between px-4 py-3 max-w-md mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-primary/60 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-xs">✨</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-primary">Marisol</span>
              <span className="text-xs text-foreground/50">{user?.username || 'Usuario'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-primary font-semibold">{user?.balance.toFixed(2) || '0.00'}</p>
            <p className="text-xs text-foreground/40">MAR-AP</p>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 pt-16 pb-24 min-h-screen">
        {currentView === 'hero' && <HeroSection onNavigate={setCurrentView} />}
        {currentView === 'dashboard' && (
          <TokenDashboard
            user={user}
            onBack={() => setCurrentView('hero')}
            onTransfer={(amount, recipient) => {
              updateBalance(-amount);
              alert(`Transferencia de ${amount} MAR-AP enviada a ${recipient.substring(0, 10)}...`);
            }}
          />
        )}
        {currentView === 'mining' && (
          <MiningSection
            user={user}
            onMiningEarnings={updateMiningBalance}
            onUpgrade={upgradeMining}
          />
        )}
        {currentView === 'worldcoin' && (
          <WorldcoinSection
            user={user}
            onBack={() => setCurrentView('hero')}
            onVerify={setWorldcoinVerified}
          />
        )}
        {currentView === 'savings' && (
          <SavingsSection
            user={user}
            onSavingsDeposit={depositToSavings}
            onClaimDailyInterest={claimSavingsInterest}
          />
        )}
        {currentView === 'mining-levels' && (
          <div className="px-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 mt-4">Etapas de Minería Premium</h2>
            <MiningLevelsSection
              userBalance={user?.balance || 0}
              currentLevel="normal"
              onUpgrade={async (levelId, cost) => {
                console.log('[v0] Upgrading mining level:', levelId, 'Cost:', cost);
                updateBalance(-cost);
              }}
            />
          </div>
        )}
        {currentView === 'savings-levels' && (
          <div className="px-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 mt-4">Etapas de Bodega</h2>
            <SavingsLevelsSection
              savingsBalance={user?.savingsBalance || 0}
              currentLevel="basica"
              onDeposit={async (amount, levelId) => {
                console.log('[v0] Depositing to savings:', amount, 'Level:', levelId);
                depositToSavings(amount);
              }}
              onClaim={claimSavingsInterest}
            />
          </div>
        )}
        {currentView === 'exchange' && (
          <div className="px-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 mt-4">Cambio de Monedas</h2>
            <ExchangeSection
              worldcoinBalance={user?.balance || 0}
              marissolBalance={user?.balance || 0}
              onExchange={async (fromCurrency, amount, toCurrency) => {
                console.log(`[v0] Exchanging ${amount} ${fromCurrency} to ${toCurrency}`);
                updateBalance(-amount * 0.05); // Simular quema del 5%
              }}
            />
          </div>
        )}
        {currentView === 'prices' && (
          <div className="px-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 mt-4">Gráfico de Precios</h2>
            <PriceChartSection
              currentPrice={0.0065}
              change24h={12.5}
            />
          </div>
        )}
      </main>

      {/* AI Assistant */}
      <AIAssistantSection />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-primary/10">
        <div className="flex items-center justify-start px-2 py-3 max-w-md mx-auto w-full overflow-x-auto gap-1">
          <button
            onClick={() => setCurrentView('hero')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs ${
              currentView === 'hero'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-lg">✨</span>
            <span className="font-medium">Inicio</span>
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs ${
              currentView === 'dashboard'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-lg">💰</span>
            <span className="font-medium">Billetera</span>
          </button>
          <button
            onClick={() => setCurrentView('savings')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs ${
              currentView === 'savings'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-lg">🏦</span>
            <span className="font-medium">Bodega</span>
          </button>
          <button
            onClick={() => setCurrentView('mining')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs ${
              currentView === 'mining'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-lg">⛏️</span>
            <span className="font-medium">Minería</span>
          </button>
          <button
            onClick={() => setCurrentView('exchange')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs ${
              currentView === 'exchange'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-lg">🔄</span>
            <span className="font-medium">Cambio</span>
          </button>
          <button
            onClick={() => setCurrentView('prices')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs ${
              currentView === 'prices'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="font-medium">Precios</span>
          </button>
          <button
            onClick={() => setCurrentView('worldcoin')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs ${
              currentView === 'worldcoin'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <span className="text-lg">🌍</span>
            <span className="font-medium">Worldcoin</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
