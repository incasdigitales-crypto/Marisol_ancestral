# Marisol Ancestral Token - Guía de Lanzamiento

## Prerequisitos
- Node.js 18+
- Variables de entorno configuradas

## Variables de Entorno Requeridas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_key

# OpenAI (para Marisol IA)
OPENAI_API_KEY=tu_key_openai

# NextAuth (opcional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_seguro
```

## Instalación y Ejecución Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Características Principales

✅ **Verificación Worldcoin** - Solo Word Coin, sin Telegram
✅ **10 Monedas MAR al verificar** - Bonus de bienvenida
✅ **Sistema de Minería** - 5 niveles (2 a 20 MAR/día)
✅ **Sistema de Bodega** - 7 niveles con multiplicadores de interés
✅ **Chatbot Marisol IA** - 5 preguntas gratis + 2 MAR c/u
✅ **Página de Guía** - Información completa y fluida

## Deploy a Vercel

```bash
vercel deploy
```

## Soporte
Para reportar problemas, contacta al equipo de desarrollo.
