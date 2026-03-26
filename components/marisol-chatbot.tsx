'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { UserData } from '@/hooks/use-user';

interface MarisolChatbotProps {
  user: UserData | null;
  onBack: () => void;
  onQuestionCost?: (cost: number) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function MarisolChatbot({ user, onBack, onQuestionCost }: MarisolChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `Bienvenido a la sabiduría ancestral de Marisol. Soy tu guía espiritual en el viaje de autoconocimiento y abundancia. 

Tienes ${questionsRemaining} preguntas gratuitas. Después de agotar tus preguntas libres, cada pregunta adicional cuesta 2 monedas MAR.

¿Qué deseas saber sobre sabiduría ancestral, amuletos, espiritualidad o magia antigua? 🔮✨`,
        timestamp: new Date(),
      },
    ]);
  }, [questionsRemaining]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    if (!user?.telegramId) {
      setError('Debes estar conectado para usar Marisol');
      return;
    }

    // Check if user has sufficient balance for paid questions
    if (questionsRemaining <= 0 && user.balance < 2) {
      setError('No tienes preguntas libres ni suficientes monedas MAR (necesitas 2)');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/marisol-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          telegramId: user.telegramId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 402) {
          // Out of questions, need to pay
          setError('Has usado tus preguntas libres. Debes pagar 2 MAR por continuar.');
          setQuestionsRemaining(0);
          if (onQuestionCost) onQuestionCost(2);
          return;
        }
        
        throw new Error(errorData.error || 'Error al conectar con Marisol');
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No se pudo leer la respuesta');

      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantContent += chunk;
        
        // Update last message or create new one
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.role === 'assistant' && lastMsg.id === 'streaming') {
            return [...prev.slice(0, -1), { ...lastMsg, content: assistantContent }];
          } else {
            return [
              ...prev,
              {
                id: 'streaming',
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date(),
              },
            ];
          }
        });
      }

      // Finalize the message
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg?.id === 'streaming') {
          lastMsg.id = Date.now().toString();
        }
        return newMessages;
      });

      // Update questions remaining
      if (questionsRemaining > 0) {
        setQuestionsRemaining(prev => Math.max(0, prev - 1));
      } else if (user.balance >= 2) {
        // Deduct 2 MAR coins
        onQuestionCost?.(2);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('[v0] Marisol chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-6 py-8 flex flex-col h-screen pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Marisol IA</h2>
          <p className="text-xs text-foreground/60">Sabiduría Ancestral</p>
        </div>
        <Button
          onClick={onBack}
          variant="outline"
          className="text-foreground/60 hover:text-foreground bg-transparent"
        >
          ← Atrás
        </Button>
      </div>

      {/* Questions Info */}
      <Card className="bg-primary/10 border border-primary/30 p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-primary">Preguntas Disponibles</p>
            <p className="text-xs text-foreground/60">
              {questionsRemaining > 0
                ? `${questionsRemaining} preguntas gratis`
                : 'Preguntas pagadas: 2 MAR c/u'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{questionsRemaining > 0 ? questionsRemaining : '∞'}</p>
            <p className="text-xs text-foreground/60">disponibles</p>
          </div>
        </div>
      </Card>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 bg-card/20 rounded-lg p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-card/60 text-foreground border border-primary/20 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card/60 text-foreground border border-primary/20 rounded-lg rounded-bl-none px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-500/20 border border-red-500/50 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta a Marisol..."
            disabled={isLoading}
            className="flex-1 bg-card/40 border border-primary/30 rounded-lg px-4 py-3 text-sm text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary/60"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 disabled:opacity-50"
          >
            {isLoading ? '...' : '→'}
          </Button>
        </div>
        {questionsRemaining <= 0 && (
          <p className="text-xs text-yellow-600 bg-yellow-500/20 p-2 rounded border border-yellow-500/30">
            Cada pregunta cuesta 2 monedas MAR. Tienes {user?.balance || 0} MAR disponibles.
          </p>
        )}
      </form>
    </div>
  );
}
