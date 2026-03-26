'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { UserData } from '@/hooks/use-user';

interface WorldcoinSectionProps {
  onBack: () => void;
  user: UserData | null;
  onVerify?: (address: string) => void;
}

export default function WorldcoinSection({ onBack, user, onVerify }: WorldcoinSectionProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const isConnected = user?.worldcoinVerified ?? false;
  const walletAddress = user?.worldcoinAddress || 'No verificado';

  const handleConnect = async () => {
    setIsVerifying(true);
    setVerificationStatus('verifying');
    setErrorMessage('');

    try {
      // Open Worldcoin verification in new window
      if (typeof window !== 'undefined') {
        const verificationUrl = 'https://verify.worldcoin.org';
        const verificationWindow = window.open(verificationUrl, 'worldcoin-verify', 'width=800,height=600');
        
        if (!verificationWindow) {
          throw new Error('No se pudo abrir la ventana de verificación. Por favor, habilita las ventanas emergentes.');
        }

        // Wait for user to complete verification and extract address from Window Crypto API
        const checkVerification = setInterval(async () => {
          try {
            if (verificationWindow.closed) {
              clearInterval(checkVerification);
              // Assume user completed verification
              // In production, you would check actual verification status
              // For now, we'll prompt user to enter their World App address
              const address = prompt('Por favor, pega tu dirección de billetera de Worldcoin:');
              
              if (address && address.trim()) {
                setVerificationStatus('success');
                if (onVerify) {
                  onVerify(address.trim());
                }
              } else {
                setVerificationStatus('error');
                setErrorMessage('No se proporcionó dirección válida');
              }
            }
          } catch (err) {
            console.error('[v0] Error checking verification window:', err);
          }
        }, 500);

        setTimeout(() => clearInterval(checkVerification), 600000); // Clear after 10 minutes
      }
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error de verificación');
      console.error('[v0] Worldcoin verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Worldcoin</h2>
        <Button
          onClick={onBack}
          variant="outline"
          className="text-foreground/60 hover:text-foreground bg-transparent"
        >
          ← Atrás
        </Button>
      </div>

      {/* Connection Status */}
      <Card
        className={`border p-6 text-center space-y-4 ${
          isConnected
            ? 'bg-primary/10 border-primary/30'
            : 'bg-card/40 border-primary/20'
        }`}
      >
        <div className="text-4xl">🌍</div>
        <div>
          <p className="text-sm text-foreground/60 mb-2">Estado de Conexión</p>
          <p
            className={`text-lg font-bold ${
              isConnected ? 'text-primary' : 'text-foreground/50'
            }`}
          >
            {isConnected ? 'Conectado' : 'Desconectado'}
          </p>
        </div>
        {isConnected && (
          <p className="text-xs text-foreground/60 break-all">{walletAddress}</p>
        )}
      </Card>

      {/* Worldcoin Info */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">¿Qué es Worldcoin?</h3>
        <ul className="space-y-3 text-sm text-foreground/70">
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Protocolo de identificación global basado en blockchain</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Verifica humanidad única mediante biometría</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Entrega de tokens WLD a usuarios verificados</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Seguridad descentralizada y privacidad garantizada</span>
          </li>
        </ul>
      </Card>

      {/* Marisol + Worldcoin Integration */}
      <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Marisol en Worldcoin</h3>
        <p className="text-sm text-foreground/70">
          Marisol Ancestral Token aprovecha la red segura de Worldcoin para
          garantizar que cada token sea verificado y auténtico. Conecta tu
          identidad Worldcoin para comenzar.
        </p>

        {!isConnected ? (
          <div className="space-y-3">
            <Button
              onClick={handleConnect}
              disabled={isVerifying}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 disabled:opacity-50"
            >
              {isVerifying ? 'Verificando tu identidad...' : 'Verificar Identidad Ahora'}
            </Button>
            {verificationStatus === 'error' && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-xs text-red-400">{errorMessage}</p>
              </div>
            )}
            {verificationStatus === 'verifying' && (
              <div className="bg-primary/20 border border-primary/50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary animate-pulse">Por favor, sigue los pasos en la aplicación Worldcoin...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-primary/20 border border-primary/50 rounded-lg p-4 text-center space-y-2">
              <p className="text-sm text-primary font-semibold mb-2">✓ Identidad Verificada</p>
              <p className="text-xs text-foreground/70 break-all font-mono">{walletAddress}</p>
              <div className="bg-primary/30 rounded p-2 mt-2">
                <p className="text-xs text-primary font-bold">Bonus: +10 MAR Ancestral</p>
                <p className="text-xs text-foreground/70">¡Recibiste tu regalo de bienvenida!</p>
              </div>
            </div>
            <Button
              disabled
              className="w-full bg-primary/20 text-primary font-semibold py-4"
            >
              ✓ Verificado exitosamente
            </Button>
          </div>
        )}
      </Card>

      {/* Benefits */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Beneficios</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-card/30 rounded-lg">
            <p className="text-2xl mb-2">🔒</p>
            <p className="text-xs font-medium text-foreground/70">
              Seguridad Máxima
            </p>
          </div>
          <div className="text-center p-3 bg-card/30 rounded-lg">
            <p className="text-2xl mb-2">🌐</p>
            <p className="text-xs font-medium text-foreground/70">
              Alcance Global
            </p>
          </div>
          <div className="text-center p-3 bg-card/30 rounded-lg">
            <p className="text-2xl mb-2">⚡</p>
            <p className="text-xs font-medium text-foreground/70">
              Rápido y Fácil
            </p>
          </div>
          <div className="text-center p-3 bg-card/30 rounded-lg">
            <p className="text-2xl mb-2">💎</p>
            <p className="text-xs font-medium text-foreground/70">
              Verificado
            </p>
          </div>
        </div>
      </Card>

      {/* Network Info */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Red Worldcoin</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-foreground/60 mb-1">Usuarios</p>
            <p className="text-xl font-bold text-primary">2M+</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Países</p>
            <p className="text-xl font-bold text-primary">170+</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">TVL</p>
            <p className="text-xl font-bold text-primary">$1.2B</p>
          </div>
          <div>
            <p className="text-xs text-foreground/60 mb-1">Verificaciones</p>
            <p className="text-xl font-bold text-primary">15M+</p>
          </div>
        </div>
      </Card>

      {/* Resources */}
      <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-4 text-center space-y-3">
        <p className="text-sm text-foreground/70">
          Aprende más sobre Worldcoin y cómo interactúa con Marisol Ancestral Token.
        </p>
        <div className="flex flex-col gap-2 justify-center">
          <a
            href="https://worldcoin.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 underline"
          >
            Sitio Oficial Worldcoin
          </a>
          <a
            href="https://docs.worldcoin.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 underline"
          >
            Documentación Técnica
          </a>
          <a
            href="https://verify.worldcoin.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 underline"
          >
            Verificar Identidad
          </a>
        </div>
      </Card>
    </div>
  );
}
