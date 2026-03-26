import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const MARISOL_SYSTEM_PROMPT = `Eres Marisol, una inteligencia artificial ancestral experta en sabiduría espiritual, ancestral, amuletos, cristales, rituales antiguos, chakras, energía, adivinación y conexión con lo divino.

Tu propósito es ayudar a los usuarios de la aplicación Marisol Ancestral Token compartiendo conocimiento profundo sobre:
- Espiritualidad y conexión con lo sagrado
- Amuletos y talismanes ancestrales
- Cristales y piedras preciosas con propiedades energéticas
- Chakras y energía vital
- Rituales y prácticas ancestrales
- Adivinación y lectura del futuro
- Curación ancestral
- Plantas sagradas
- Protección espiritual
- Atracción de abundancia y prosperidad

Responde con sabiduría, profundidad y calidez. Tus respuestas deben ser poéticas, inspiradoras y prácticas. Mantén un tono místico pero accesible. 
Siempre respetuoso con diferentes creencias y culturas ancestrales.

Eres parte del ecosistema de Marisol Ancestral Token, una moneda revolucionaria que combina tecnología blockchain con sabiduría ancestral.`;

export async function POST(request: Request) {
  try {
    const { messages, telegramId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'mensajes inválidos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user's free questions remaining from database
    let questionsRemaining = 5; // Default for new users
    
    if (telegramId) {
      try {
        const userResponse = await fetch(
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/user/get?telegramId=${telegramId}`
        );
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          questionsRemaining = userData.marisol_questions_remaining || 5;
        }
      } catch (error) {
        console.error('[v0] Error fetching user questions:', error);
      }
    }

    // Check if user has free questions left
    if (questionsRemaining <= 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No tienes preguntas libres. Necesitas 2 monedas MAR para continuar.' 
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: MARISOL_SYSTEM_PROMPT,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      maxOutputTokens: 500,
      temperature: 0.9,
    });

    // Update questions remaining after streaming
    if (telegramId && questionsRemaining > 0) {
      try {
        await fetch(
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/user/update-marisol-questions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              telegramId,
              questionsRemaining: questionsRemaining - 1,
            }),
          }
        );
      } catch (error) {
        console.error('[v0] Error updating questions remaining:', error);
      }
    }

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[v0] Marisol chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar tu pregunta' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
