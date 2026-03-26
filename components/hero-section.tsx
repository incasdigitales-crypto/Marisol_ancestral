'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import type { UserData } from '@/hooks/use-user';

interface HeroSectionProps {
  onNavigate: (view: 'hero' | 'dashboard' | 'mining' | 'worldcoin' | 'savings' | 'guide' | 'marisol') => void;
  user: UserData | null;
}

export default function HeroSection({ onNavigate, user }: HeroSectionProps) {
  const isVerified = user?.worldcoinVerified ?? false;
  
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Fondo mystical con imagen */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/images/file-000000007e84720eaf0ed3f5482d3195.png"
          alt="Marisol Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay oscuro para garantizar legibilidad */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Partículas de brillo dorado animadas */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full opacity-40 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-primary rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-primary rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Contenedor central */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 relative z-10">
        
        {/* Cabeza mystical (parte superior) */}
        <div className="text-center space-y-4">
          <div className="relative w-32 h-32 mx-auto">
            <Image
              src="/marisol-character.jpg"
              alt="Marisol Eyes"
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-full shadow-2xl shadow-primary/50"
            />
            {/* Glow alrededor de los ojos */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse" />
          </div>
        </div>

        {/* Texto principal - Mensaje Poderoso */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-pretty leading-tight tracking-tight">
            <span className="text-primary block font-black">NO ES TU FUTURO,</span>
            <span className="text-foreground/70 block font-semibold mt-2">ES LO QUE YA ESTÁS</span>
            <span className="text-primary block font-black mt-2">ACTIVANDO.</span>
          </h1>
        </div>

        {/* Logo circular de Marisol Ancestral Token */}
        <div className="relative w-48 h-48 flex items-center justify-center my-4">
          {/* Círculo externo dorado */}
          <div className="absolute inset-0 border-4 border-primary rounded-full animate-pulse" />
          <div className="absolute inset-3 border-2 border-primary/50 rounded-full" />
          
          {/* Contenedor del logo */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <Image
              src="/marisol-character.jpg"
              alt="Marisol Ancestral Token"
              width={160}
              height={160}
              className="w-full h-full object-cover rounded-full shadow-xl shadow-primary/40"
            />
          </div>
          
          {/* Texto circular (simulado con posición absoluta) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full absolute">
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                  fill="none"
                />
              </defs>
              <text fontSize="14" fill={''} fontWeight="bold" letterSpacing="2">
                <textPath href="#circlePath" startOffset="50%" textAnchor="middle" fill="rgb(212, 175, 55)">
                  MARISOL ANCESTRAL TOKEN
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Username y bola de cristal */}
        <div className="text-center space-y-4">
          <p className="text-lg md:text-xl font-bold text-primary">
            @MARISOL ANCESTRAL BOT 🔮
          </p>
          <p className="text-xs text-foreground/50">Poder ancestral activado</p>
        </div>

        {/* Verification Status */}
        {!isVerified ? (
          <Card className="bg-yellow-500/20 border border-yellow-500/50 p-6 space-y-3">
            <div className="text-center">
              <p className="text-sm font-semibold text-yellow-600 mb-2">Próximo Paso: Conectar Billetera</p>
              <p className="text-xs text-foreground/70 leading-relaxed">
                ¡Sin salir de esta app! Solo ingresa tu dirección Worldcoin:
              </p>
            </div>
            <ol className="text-xs text-foreground/70 space-y-1 list-decimal list-inside">
              <li>Haz clic en "Verificar Worldcoin" abajo</li>
              <li>Ingresa tu dirección de billetera (0x...)</li>
              <li>¡Recibe 10 MAR de bienvenida!</li>
            </ol>
            <p className="text-xs text-foreground/50 text-center pt-2 border-t border-yellow-500/30">
              Consigue tu dirección en World App → Billetera
            </p>
          </Card>
        ) : (
          <Card className="bg-primary/20 border border-primary/50 p-6 space-y-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✓</span>
              <div>
                <p className="text-sm font-semibold text-primary">¡Verificado!</p>
                <p className="text-xs text-foreground/70">Billetera conectada y 10 MAR recibido</p>
              </div>
            </div>
          </Card>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3 w-full mt-6">
          <Button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/50 text-base"
          >
            Ver Mi Balance
          </Button>
          <Button
            onClick={() => onNavigate('mining')}
            className="w-full bg-primary/20 hover:bg-primary/30 text-primary border-2 border-primary font-bold py-6 rounded-lg transition-all text-base"
          >
            Comenzar a Minar
          </Button>
          <Button
            onClick={() => onNavigate('worldcoin')}
            className="w-full bg-transparent hover:bg-primary/10 text-primary border border-primary/50 font-semibold py-6 rounded-lg transition-all text-base"
          >
            Verificar Worldcoin
          </Button>
        </div>
      </div>
    </div>
  );
}
