'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface HeroSectionProps {
  onNavigate: (view: 'hero' | 'dashboard' | 'worldcoin') => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-8 py-12 relative">
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Main Image Section */}
      <div className="flex flex-col items-center gap-6">
        {/* Marisol Character Circle with Mystical Effects */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Outer glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
          
          {/* Decorative circles */}
          <div className="absolute inset-0 border border-primary/30 rounded-full" />
          <div className="absolute inset-4 border border-primary/20 rounded-full" />
          
          {/* Character image */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <Image
              src="/marisol-character.jpg"
              alt="Marisol Ancestral"
              width={256}
              height={256}
              priority
              className="w-full h-full object-cover rounded-full shadow-2xl shadow-primary/40"
            />
          </div>
        </div>

        {/* Main Text */}
        <div className="text-center space-y-4 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-pretty leading-tight">
            <span className="text-primary block">NO ES TU FUTURO,</span>
            <span className="text-foreground/80 block">ES LO QUE YA ESTÁS</span>
            <span className="text-primary block">ACTIVANDO.</span>
          </h1>
          <p className="text-sm text-foreground/60 mt-6">
            Marisol Ancestral Token - Poder ancestral activado
          </p>
        </div>
      </div>

      {/* Token Info Cards */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-5 hover:bg-card/60 transition-all hover:border-primary/50">
          <div className="space-y-3">
            <p className="text-xs uppercase text-foreground/50 tracking-wider">Token</p>
            <p className="text-base font-bold text-primary">Marisol Ancestral</p>
            <p className="text-xs text-foreground/40">MAR-AP</p>
          </div>
        </Card>
        <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-5 hover:bg-card/60 transition-all hover:border-primary/50">
          <div className="space-y-3">
            <p className="text-xs uppercase text-foreground/50 tracking-wider">Blockchain</p>
            <p className="text-base font-bold text-primary">Worldcoin</p>
            <p className="text-xs text-foreground/40">WLD Chain</p>
          </div>
        </Card>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3 mt-8">
        <Button
          onClick={() => onNavigate('dashboard')}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30"
        >
          Ver Mi Balance
        </Button>
        <Button
          onClick={() => onNavigate('worldcoin')}
          className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 font-semibold py-6 rounded-lg transition-all"
        >
          Conectar Worldcoin
        </Button>
      </div>

      {/* Footer Info */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-xl border border-primary/20 p-6 text-center">
        <div className="space-y-3">
          <p className="text-sm text-foreground/70 leading-relaxed">
            Una moneda de poder ancestral activada a través de Worldcoin. Tu futuro ya está siendo creado.
          </p>
          <p className="text-2xl font-bold text-primary">✨ Activa tu Magia ✨</p>
          <p className="text-xs text-foreground/50 pt-2">@MARISOL ANCESTRAL BOT</p>
        </div>
      </Card>
    </div>
  );
}
