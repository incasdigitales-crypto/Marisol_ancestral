'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GuideSectionProps {
  onBack: () => void;
}

export default function GuideSection({ onBack }: GuideSectionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'earning' | 'mining' | 'bodega' | 'ancestral'>('overview');

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Marisol Ancestral</h2>
        <Button
          onClick={onBack}
          variant="outline"
          className="text-foreground/60 hover:text-foreground bg-transparent"
        >
          ← Atrás
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/40 text-foreground/70 hover:bg-card/60'
          }`}
        >
          Visión General
        </button>
        <button
          onClick={() => setActiveTab('earning')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeTab === 'earning'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/40 text-foreground/70 hover:bg-card/60'
          }`}
        >
          Ganancias
        </button>
        <button
          onClick={() => setActiveTab('mining')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeTab === 'mining'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/40 text-foreground/70 hover:bg-card/60'
          }`}
        >
          Minería
        </button>
        <button
          onClick={() => setActiveTab('bodega')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeTab === 'bodega'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/40 text-foreground/70 hover:bg-card/60'
          }`}
        >
          Bodega
        </button>
        <button
          onClick={() => setActiveTab('ancestral')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeTab === 'ancestral'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/40 text-foreground/70 hover:bg-card/60'
          }`}
        >
          Ancestral
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 space-y-4">
              <h3 className="text-2xl font-bold text-primary">¿Qué es Marisol Ancestral?</h3>
              <p className="text-foreground/80 leading-relaxed">
                Marisol Ancestral Token es una moneda digital revolucionaria que combina la sabiduría ancestral con la tecnología blockchain moderna. Es tu puerta de entrada a un sistema de ganancias pasivas, minería y acumulación de riqueza espiritual y digital.
              </p>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Características Principales</h4>
              <ul className="space-y-3 text-sm text-foreground/70">
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">✨</span>
                  <span><strong>Comienzo Gratuito:</strong> Obtienes 10 monedas MAR al verificarte</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">⛏️</span>
                  <span><strong>Minería Activa:</strong> Gana monedas diariamente con 5 niveles de mejora</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">🏦</span>
                  <span><strong>Bodega Ancestral:</strong> Ahorra y obtén intereses diarios con 7 niveles</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">🔮</span>
                  <span><strong>IA Marisol:</strong> Consulta sobre temas ancestrales y espirituales</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-lg">🌍</span>
                  <span><strong>Verified by Worldcoin:</strong> Vincula tu billetera Worldcoin (Word Coin)</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Tu Viaje Comienza Aquí</h4>
              <ol className="space-y-2 text-sm text-foreground/70 list-decimal list-inside">
                <li>Verifica tu identidad con Worldcoin (Word Coin)</li>
                <li>Conecta tu billetera digital Worldcoin</li>
                <li>Recibe 10 monedas MAR de bienvenida</li>
                <li>Elige: ¿Minar o Ahorrar?</li>
                <li>¡Comienza a generar ganancias pasivas!</li>
              </ol>
            </Card>
          </div>
        )}

        {/* EARNING TAB */}
        {activeTab === 'earning' && (
          <div className="space-y-4 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 space-y-4">
              <h3 className="text-2xl font-bold text-primary">Cómo Ganar en Marisol</h3>
              <p className="text-foreground/80 leading-relaxed">
                Hay dos métodos principales para generar ganancias en el ecosistema de Marisol Ancestral Token. Ambos requieren inversión inicial en Word Coin (WLD).
              </p>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="text-2xl">💰</span> Método 1: Ganancias Pasivas
              </h4>
              <p className="text-sm text-foreground/70">
                Invierte una cantidad inicial y recibe ganancias automáticas diarias sin hacer nada más. Perfecto si prefieres un crecimiento seguro y consistente.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-primary">Fórmula de Ganancias Diarias:</p>
                <p className="text-sm text-foreground/80">
                  Ganancias = (Inversión ÷ 100) × Multiplicador del Nivel
                </p>
                <p className="text-xs text-foreground/60 mt-2">
                  Ejemplo: Si inviertes 1,000 MAR en Nivel 1 (1x), ganas 10 MAR diarios.
                </p>
              </div>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="text-2xl">⛏️</span> Método 2: Minería Activa
              </h4>
              <p className="text-sm text-foreground/70">
                Participa activamente en el proceso de minería y gana monedas basado en tu nivel de minería. A mayor nivel, mayores ganancias diarias.
              </p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-primary">Niveles de Minería (Costo en WLD):</p>
                <ul className="text-xs text-foreground/80 space-y-1">
                  <li><span className="text-primary">Nivel 1 (Básico):</span> Gratis → 2 MAR/día</li>
                  <li><span className="text-primary">Nivel 2:</span> 15 WLD → 5 MAR/día</li>
                  <li><span className="text-primary">Nivel 3:</span> 25 WLD → 7 MAR/día</li>
                  <li><span className="text-primary">Nivel 4:</span> 40 WLD → 10 MAR/día</li>
                  <li><span className="text-primary">Nivel 5:</span> 75 WLD → 20 MAR/día</li>
                </ul>
              </div>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Estrategias de Inversión</h4>
              <div className="space-y-3 text-sm text-foreground/70">
                <div className="p-3 bg-card/50 rounded">
                  <p className="font-semibold text-primary mb-1">Estrategia Conservadora</p>
                  <p>Ahorra en la Bodega con intereses seguros. Mejor para crecimiento lento pero consistente.</p>
                </div>
                <div className="p-3 bg-card/50 rounded">
                  <p className="font-semibold text-primary mb-1">Estrategia Agresiva</p>
                  <p>Sube niveles de minería rápidamente. Genera más MAR diarios pero requiere más WLD inicial.</p>
                </div>
                <div className="p-3 bg-card/50 rounded">
                  <p className="font-semibold text-primary mb-1">Estrategia Híbrida</p>
                  <p>Combina minería con ahorros. Divide tu inversión entre ambos métodos para máxima rentabilidad.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* MINING TAB */}
        {activeTab === 'mining' && (
          <div className="space-y-4 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 space-y-4">
              <h3 className="text-2xl font-bold text-primary">Sistema de Minería</h3>
              <p className="text-foreground/80 leading-relaxed">
                La minería es el corazón de Marisol. Cuanto mayor sea tu nivel, más monedas ganarás cada día automáticamente.
              </p>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Niveles de Minería Detallados</h4>
              <div className="space-y-3">
                {[
                  { level: 1, name: 'Aprendiz', cost: 'Gratis', earnings: '2 MAR/día', desc: 'Nivel inicial, perfecto para comenzar' },
                  { level: 2, name: 'Minero', cost: '15 WLD', earnings: '5 MAR/día', desc: 'Ganancia moderada' },
                  { level: 3, name: 'Maestro', cost: '25 WLD', earnings: '7 MAR/día', desc: 'Buen rendimiento' },
                  { level: 4, name: 'Leyenda', cost: '40 WLD', earnings: '10 MAR/día', desc: 'Alto rendimiento' },
                  { level: 5, name: 'Dragón Ancestral', cost: '75 WLD', earnings: '20 MAR/día', desc: 'Máximo poder' },
                ].map((tier) => (
                  <div key={tier.level} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-primary text-lg">
                          Nivel {tier.level}: {tier.name}
                        </h5>
                        <p className="text-xs text-foreground/60">{tier.desc}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground/80">Costo: <span className="text-primary">{tier.cost}</span></span>
                      <span className="text-sm font-bold text-primary bg-primary/20 px-3 py-1 rounded">{tier.earnings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Cómo Funciona</h4>
              <ol className="space-y-2 text-sm text-foreground/70 list-decimal list-inside">
                <li>Tienes 5 minutos para iniciar tu minería cada día</li>
                <li>Las ganancias se acumulan automáticamente a tu billetera</li>
                <li>Puedes mejorar de nivel en cualquier momento pagando WLD</li>
                <li>Cada nivel mejora tus ganancias diarias significativamente</li>
                <li>No hay límite de ganancia diaria en los niveles superiores</li>
              </ol>
            </Card>
          </div>
        )}

        {/* BODEGA TAB */}
        {activeTab === 'bodega' && (
          <div className="space-y-4 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 space-y-4">
              <h3 className="text-2xl font-bold text-primary">Sistema de Bodega (Ahorros)</h3>
              <p className="text-foreground/80 leading-relaxed">
                La Bodega es tu sistema de ganancias pasivas. Mientras más ahorres y mayor sea tu nivel, mayores serán tus intereses diarios.
              </p>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Cómo Funcionan los Intereses</h4>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-3">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Tus intereses diarios dependen de dos factores:
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-foreground/70">
                    <span className="font-semibold text-primary">1. Cantidad ahorrada:</span> A más monedas ahorradas, más ganancias
                  </div>
                  <div className="text-sm text-foreground/70">
                    <span className="font-semibold text-primary">2. Multiplicador del nivel:</span> Mejor nivel = mayor rentabilidad
                  </div>
                </div>
                <p className="text-xs text-foreground/60 border-t border-primary/20 pt-2 mt-2">
                  Ejemplo: 1,000 MAR en Nivel 1 (1x) = 10 MAR/día
                </p>
              </div>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Niveles de Bodega (7 Etapas)</h4>
              <div className="space-y-3">
                {[
                  { level: 1, name: 'Jarra de Barro', cost: 'Gratis', multiplier: '1x', desc: 'Almacenamiento básico' },
                  { level: 2, name: 'Cofre de Madera', cost: '5 WLD', multiplier: '1.5x', desc: 'Mejor seguridad' },
                  { level: 3, name: 'Arcón de Hierro', cost: '10 WLD', multiplier: '2x', desc: 'Protección reforzada' },
                  { level: 4, name: 'Caja de Oro', cost: '20 WLD', multiplier: '2.5x', desc: 'Lujo ancestral' },
                  { level: 5, name: 'Bóveda Platinada', cost: '35 WLD', multiplier: '3x', desc: 'Máxima seguridad' },
                  { level: 6, name: 'Tesoro Sagrado', cost: '60 WLD', multiplier: '3.5x', desc: 'Poder supremo' },
                  { level: 7, name: 'Santuario Eterno', cost: '80 WLD', multiplier: '4x', desc: 'Infinito ancestral' },
                ].map((tier) => (
                  <div key={tier.level} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-primary text-lg">
                          Nivel {tier.level}: {tier.name}
                        </h5>
                        <p className="text-xs text-foreground/60">{tier.desc}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-foreground/80">Costo: <span className="text-primary">{tier.cost}</span></span>
                      <span className="text-sm font-bold text-primary bg-primary/20 px-3 py-1 rounded">{tier.multiplier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Estrategia Recomendada</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Comienza con Nivel 1 (Gratis) y ahorra 100 MAR</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Con 5 WLD, sube a Nivel 2 (1.5x)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Sigue mejorando según tus ganancias diarias</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">→</span>
                  <span>Reclama intereses automáticamente cada 24h</span>
                </li>
              </ul>
            </Card>
          </div>
        )}

        {/* ANCESTRAL TAB */}
        {activeTab === 'ancestral' && (
          <div className="space-y-4 animate-fade-in">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 p-6 space-y-4">
              <h3 className="text-2xl font-bold text-primary">Marisol IA - Sabiduría Ancestral</h3>
              <p className="text-foreground/80 leading-relaxed">
                Marisol es una inteligencia artificial entrenada en conocimientos ancestrales, espirituales y sobre amuletos. Ella puede responder cualquier pregunta sobre estos temas.
              </p>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="text-2xl">🔮</span> ¿Cómo Funciona?
              </h4>
              <div className="space-y-3 text-sm text-foreground/70">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded">
                  <p className="font-semibold text-primary mb-1">Primeras 5 Preguntas: GRATIS</p>
                  <p>Cada nuevo usuario obtiene 5 preguntas gratuitas para explorar la sabiduría de Marisol</p>
                </div>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded">
                  <p className="font-semibold text-primary mb-1">Preguntas Adicionales: 2 MAR por pregunta</p>
                  <p>Después de agotar tus 5 preguntas gratuitas, paga 2 monedas MAR por cada pregunta</p>
                </div>
              </div>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Temas que Marisol Domina</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '✨', title: 'Espiritualidad' },
                  { icon: '🔮', title: 'Adivinación' },
                  { icon: '💎', title: 'Amuletos' },
                  { icon: '🌙', title: 'Energía Lunar' },
                  { icon: '🪿', title: 'Curación Ancestral' },
                  { icon: '👑', title: 'Magia Antigua' },
                  { icon: '🌿', title: 'Plantas Sagradas' },
                  { icon: '☮️', title: 'Chakras' },
                ].map((topic) => (
                  <div key={topic.title} className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-center">
                    <p className="text-2xl mb-1">{topic.icon}</p>
                    <p className="text-xs font-medium text-foreground/80">{topic.title}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/30 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Ejemplos de Preguntas</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>"¿Qué amuleto me ayuda con la prosperidad?"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>"¿Cuál es el significado espiritual de la luna llena?"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>"¿Cómo puedo elevar mi energía positiva?"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>"¿Qué cristales me protegen del mal de ojo?"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>"¿Cómo se hacen los rituales de sanación?"</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-card/40 backdrop-blur-xl border border-primary/20 p-6 space-y-4">
              <h4 className="text-lg font-semibold text-primary">Información Completa de Marisol</h4>
              <div className="space-y-3 text-sm text-foreground/70">
                <div>
                  <p className="font-semibold text-primary mb-1">Sabiduría Ancestral</p>
                  <p>Marisol contiene conocimiento milenario sobre energía, espiritualidad y conexión con lo divino.</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Amuletos y Talismanes</p>
                  <p>Aprende sobre cristales, piedras preciosas, talismanes y cómo usarlos para atraer lo que deseas.</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Conexión Espiritual</p>
                  <p>Descubre cómo conectar con tu esencia interior y elevar tu vibración energética.</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Rituales y Prácticas</p>
                  <p>Guías completas sobre rituales antiguos adaptados para la era moderna.</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
