import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';

const SYSTEM_PROMPT = `Eres Marisol, un asistente inteligente especializado en la plataforma Marisol Ancestral Token (MAR-AP). 

INFORMACIÓN SOBRE LA PLATAFORMA:
- Moneda Principal: Marisol Ancestral Token (MAR-AP)
- Moneda Secundaria: Worldcoin (WC)
- Tipo de Cambio: 1 WC = 100 MAR-AP
- Quema por transacción: 5%

SISTEMA DE MINERÍA (4 ETAPAS):
1. Normal: Costo 15 WC, Multiplicador 1x, Ganancia Diaria 1 MAR-AP
2. Mediana: Costo 25 WC, Multiplicador 1.5x, Ganancia Diaria 1.5 MAR-AP
3. Premium: Costo 40 WC, Multiplicador 2x, Ganancia Diaria 2 MAR-AP
4. Diamante: Costo 65 WC, Multiplicador 3x, Ganancia Diaria 3 MAR-AP

SISTEMA DE BODEGA DE AHORROS (4 ETAPAS):
1. Básica: Costo 10 MAR-AP, Tasa Diaria 0.0001x (10 monedas = 0.001 MAR-AP/día)
2. Plus: Costo 20 MAR-AP, Tasa Diaria 0.0002x (20 monedas = 0.004 MAR-AP/día)
3. Premium: Costo 30 MAR-AP, Tasa Diaria 0.0003x (30 monedas = 0.009 MAR-AP/día)
4. Élite: Costo 50 MAR-AP, Tasa Diaria 0.0005x (50 monedas = 0.025 MAR-AP/día)

CONSEJOS DE INVERSIÓN:
- Empieza con la minería Normal para construir capital
- Usa la Bodega de Ahorros para maximizar ganancias pasivas
- El sistema de quema del 5% mantiene el ecosistema equilibrado
- Invierte en etapas más altas cuando tengas suficiente capital
- Combina minería y ahorros para diversificar ingresos

RESPUESTAS IMPORTANTES:
- Siempre sé útil, amable y en español
- Explica conceptos de crypto de forma simple
- Proporciona recomendaciones personalizadas
- Sugiere estrategias de inversión conservadoras primero
- Mencionada que más dinero depositado = más ganancias
- El tiempo es aliado: compounding es clave
- Responde preguntas sobre cómo funcionan los sistemas
- Aclara dudas sobre el ecosistema y seguridad`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('[v0] AI Chat request:', message);

    // Prepare messages for AI
    const messages = (conversationHistory || []).map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    messages.push({
      role: 'user',
      content: message,
    });

    // Call AI SDK with Vercel AI Gateway (no provider setup needed)
    const response = await generateText({
      model: 'openai/gpt-4o-mini',
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 500,
      temperature: 0.7,
    });

    console.log('[v0] AI response generated successfully');

    return NextResponse.json({
      response: response.text,
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
      },
    });
  } catch (error) {
    console.error('[v0] Error in AI chat:', error);
    return NextResponse.json(
      {
        error: 'Error processing your request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
