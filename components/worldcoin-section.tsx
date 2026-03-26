'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { UserData } from '@/hooks/use-user';

interface WorldcoinSectionProps {
  onBack: () => void;
  user: UserData | null;
  onVerify?: (address: string) => void;
  onBonusEarned?: (amount: number) => void;
}

type VerificationStage = 'idle' | 'primary-verifying' | 'primary-success' | 'secondary-option' | 'secondary-verifying' | 'secondary-success' | 'complete';

export default function WorldcoinSection({ onBack, user, onVerify, onBonusEarned }: WorldcoinSectionProps) {
  const [stage, setStage] = useState<VerificationStage>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalBonusEarned, setTotalBonusEarned] = useState(0);

  const isVerified = user?.worldcoinVerified ?? false;

  // Simulate sending primary verification request to Worldcoin
  const handlePrimaryVerification = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setStage('primary-verifying');

    try {
      console.log('[v0] Starting primary Worldcoin verification request');
      
      // Simulate API call to Worldcoin
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('[v0] Primary verification request sent to Worldcoin');
      
      // Record the +10 MAR bonus
      setTotalBonusEarned(10);
      setStage('primary-success');
      
      if (onVerify) {
        onVerify('0x' + 'verified-primary');
      }
      if (onBonusEarned) {
        onBonusEarned(10);
      }
    } catch (error) {
      console.error('[v0] Primary verification error:', error);
      setErrorMessage('Error al enviar solicitud de verificación. Intenta de nuevo.');
      setStage('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  // Move to secondary verification option
  const handleProceedToSecondary = () => {
    setStage('secondary-option');
    setErrorMessage('');
  };

  // Simulate sending secondary verification request
  const handleSecondaryVerification = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setStage('secondary-verifying');

    try {
      console.log('[v0] Starting secondary Worldcoin verification request');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('[v0] Secondary verification request sent to Worldcoin');
      
      // Add +10 more MAR bonus
      setTotalBonusEarned(prev => prev + 10);
      setStage('secondary-success');
      
      if (onBonusEarned) {
        onBonusEarned(10);
      }
    } catch (error) {
      console.error('[v0] Secondary verification error:', error);
      setErrorMessage('Error al enviar solicitud de verificación secundaria. Intenta de nuevo.');
      setStage('secondary-option');
    } finally {
      setIsProcessing(false);
    }
  };

  // Skip secondary verification
  const handleSkipSecondary = () => {
    setStage('complete');
  };

  // Show already verified state
  if (isVerified) {
    return (
      <div className="min-h-screen bg-background p-4 pt-20">
        <button
          onClick={onBack}
          className="mb-6 text-foreground/60 hover:text-foreground transition-colors text-sm"
        >
          ← Atrás
        </button>

        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-primary">Verificación Completa</h2>
            <p className="text-sm text-foreground/70">Tu billetera Worldcoin está verificada</p>
          </div>

          <Card className="bg-primary/20 border-primary/50 p-6 space-y-4 text-center">
            <div className="text-4xl mb-2">✓</div>
            <p className="text-sm font-semibold text-primary">¡Verificado Exitosamente!</p>
            <div className="bg-primary/30 rounded p-3 space-y-1 mt-3">
              <p className="text-xs text-foreground/70">Bonificación Total Recibida</p>
              <p className="text-2xl font-bold text-primary">+20 MAR</p>
            </div>
          </Card>

          <Button
            onClick={onBack}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pt-20">
      <button
        onClick={onBack}
        className="mb-6 text-foreground/60 hover:text-foreground transition-colors text-sm"
      >
        ← Atrás
      </button>

      <div className="max-w-md mx-auto space-y-6">
        {/* STAGE: Idle - Initial State */}
        {stage === 'idle' && (
          <>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-primary">Verificación Worldcoin</h2>
              <p className="text-sm text-foreground/70">Dos pasos simples para comenzar</p>
            </div>

            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-primary">Marisol en Worldcoin</h3>
              <p className="text-sm text-foreground/70">
                Marisol Ancestral Token utiliza Worldcoin para garantizar que cada usuario es único y auténtico.
              </p>
              <div className="space-y-3 pt-4 border-t border-primary/20">
                <div className="flex gap-3">
                  <div className="text-primary font-bold text-lg min-w-6">1</div>
                  <div>
                    <p className="text-sm font-semibold text-primary">Verificación Principal</p>
                    <p className="text-xs text-foreground/70">Enviaremos solicitud a Worldcoin</p>
                    <p className="text-xs font-bold text-primary mt-1">+10 MAR</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-primary font-bold text-lg min-w-6">2</div>
                  <div>
                    <p className="text-sm font-semibold text-primary">Verificación Secundaria (Opcional)</p>
                    <p className="text-xs text-foreground/70">Verificación adicional de seguridad</p>
                    <p className="text-xs font-bold text-primary mt-1">+10 MAR (si lo haces)</p>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={handlePrimaryVerification}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 disabled:opacity-50"
            >
              {isProcessing ? 'Enviando solicitud...' : 'Iniciar Verificación'}
            </Button>

            {errorMessage && (
              <Card className="bg-red-500/20 border border-red-500/50 p-3">
                <p className="text-xs text-red-400">{errorMessage}</p>
              </Card>
            )}
          </>
        )}

        {/* STAGE: Primary Verifying */}
        {stage === 'primary-verifying' && (
          <Card className="bg-primary/20 border border-primary/50 p-8 text-center space-y-4">
            <div className="animate-pulse">
              <div className="inline-block p-4 bg-primary/30 rounded-full mb-3">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            </div>
            <p className="text-sm font-semibold text-primary">Enviando solicitud a Worldcoin...</p>
            <p className="text-xs text-foreground/70">Por favor espera</p>
          </Card>
        )}

        {/* STAGE: Primary Success */}
        {stage === 'primary-success' && (
          <>
            <Card className="bg-green-500/20 border-2 border-green-500/50 p-6 text-center space-y-3">
              <div className="text-4xl mb-2">✓</div>
              <p className="text-sm font-bold text-green-400">Solicitud de Verificación Enviada</p>
              <p className="text-xs text-foreground/70">Worldcoin procesará tu solicitud en breve</p>
              <div className="bg-green-500/30 rounded p-3 mt-3 space-y-1">
                <p className="text-xs text-foreground/70">Bonificación Recibida</p>
                <p className="text-2xl font-bold text-green-400">+10 MAR</p>
              </div>
            </Card>

            <Button
              onClick={handleProceedToSecondary}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              Siguiente: Verificación Opcional
            </Button>
          </>
        )}

        {/* STAGE: Secondary Option */}
        {stage === 'secondary-option' && (
          <>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-primary">Verificación Adicional</h3>
              <p className="text-sm text-foreground/70">Opcional pero recomendado</p>
            </div>

            <Card className="bg-primary/10 border border-primary/30 p-6 space-y-4">
              <p className="text-sm text-foreground/80">
                Puedes enviar una solicitud de verificación secundaria para mayor seguridad. Si la completas, recibirás 10 MAR adicionales.
              </p>
              <div className="space-y-2 bg-primary/20 rounded p-3">
                <p className="text-xs font-semibold text-primary">Beneficios:</p>
                <ul className="text-xs text-foreground/70 space-y-1 list-disc list-inside">
                  <li>Mayor seguridad en tu cuenta</li>
                  <li>+10 MAR de bonificación</li>
                  <li>Acceso a funciones premium</li>
                </ul>
              </div>
            </Card>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSecondaryVerification}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 disabled:opacity-50"
              >
                {isProcessing ? 'Enviando...' : 'Enviar Verificación Secundaria'}
              </Button>
              <Button
                onClick={handleSkipSecondary}
                disabled={isProcessing}
                variant="outline"
                className="w-full bg-transparent border border-foreground/20 text-foreground/60 hover:text-foreground font-semibold py-3"
              >
                Omitir por Ahora
              </Button>
            </div>

            {errorMessage && (
              <Card className="bg-red-500/20 border border-red-500/50 p-3">
                <p className="text-xs text-red-400">{errorMessage}</p>
              </Card>
            )}
          </>
        )}

        {/* STAGE: Secondary Verifying */}
        {stage === 'secondary-verifying' && (
          <Card className="bg-primary/20 border border-primary/50 p-8 text-center space-y-4">
            <div className="animate-pulse">
              <div className="inline-block p-4 bg-primary/30 rounded-full mb-3">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            </div>
            <p className="text-sm font-semibold text-primary">Enviando verificación secundaria...</p>
            <p className="text-xs text-foreground/70">Por favor espera</p>
          </Card>
        )}

        {/* STAGE: Secondary Success */}
        {stage === 'secondary-success' && (
          <>
            <Card className="bg-green-500/20 border-2 border-green-500/50 p-6 text-center space-y-3">
              <div className="text-4xl mb-2">✓</div>
              <p className="text-sm font-bold text-green-400">Verificación Secundaria Completada</p>
              <p className="text-xs text-foreground/70">Tu cuenta está totalmente asegurada</p>
              <div className="bg-green-500/30 rounded p-3 mt-3 space-y-1">
                <p className="text-xs text-foreground/70">Bonificación Adicional</p>
                <p className="text-2xl font-bold text-green-400">+10 MAR</p>
              </div>
            </Card>

            <Button
              onClick={() => setStage('complete')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              Finalizar
            </Button>
          </>
        )}

        {/* STAGE: Complete */}
        {stage === 'complete' && (
          <>
            <Card className="bg-primary/20 border border-primary/50 p-6 text-center space-y-4">
              <div className="text-5xl mb-2">✓</div>
              <p className="text-lg font-bold text-primary">¡Verificación Completa!</p>
              <div className="bg-primary/30 rounded p-4 space-y-2 mt-4">
                <p className="text-xs text-foreground/70">Total de Bonificación Recibida</p>
                <p className="text-3xl font-bold text-primary">+{totalBonusEarned} MAR</p>
              </div>
              <p className="text-xs text-foreground/70 pt-2">
                Worldcoin procesará tus solicitudes. Volverás a este estado cuando se completen.
              </p>
            </Card>

            <Button
              onClick={onBack}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              Volver al Inicio
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
