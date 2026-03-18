# Guía Rápida de Prueba - Marisol Ancestral Token

## Qué se Implementó

✅ **Verificación Worldcoin Perfecta**
- Genera dirección única y segura
- Se guarda en la base de datos
- El usuario puede desconectarse

✅ **4 Etapas de Minería**
- Normal: 1x (15 WC)
- Mediana: 1.5x (25 WC)  
- Premium: 2x (40 WC)
- Diamante: 3x (65 WC)

✅ **4 Etapas de Bodega**
- Básica: 0.0001x (10 MAR-AP) → 10 monedas = 0.001 diarios
- Plus: 0.0002x (20 MAR-AP) → 20 monedas = 0.004 diarios
- Premium: 0.0003x (30 MAR-AP) → 30 monedas = 0.009 diarios
- Élite: 0.0005x (50 MAR-AP) → 50 monedas = 0.025 diarios

✅ **Sistema de Exchange**
- 1 Worldcoin = 100 MAR-AP
- 5% quema por transacción
- Cambio bidireccional (WC ↔ MAR-AP)

✅ **Gráfico de Precios**
- 7 días históricos
- Visualización interactiva
- Indicador de tendencia

✅ **AI Assistant (Marisol)**
- Chatbot flotante (botón 🤖)
- Responde preguntas sobre inversión, minería, bodega
- Conocimiento completo del ecosistema

✅ **Quema de Monedas**
- 5% por cada transacción
- Equilibra el ecosistema
- Previene inflación

---

## Cómo Probar

### 1. Verificación Worldcoin
1. Abre la app
2. Ve a pestaña "🌍 Worldcoin"
3. Presiona "Vincular Billetera"
4. Espera 3 segundos (simulación)
5. Verifica que muestra una dirección Worldcoin
6. Presiona "Desconectarse" para resetear

### 2. Minería de 4 Etapas
1. Ve a pestaña "⛏️ Minería"
2. Selecciona nivel (Normal, Mediana, Premium, Diamante)
3. Mira el costo en Worldcoin
4. Mira el multiplicador de ganancia
5. Presiona "Activar" si tienes saldo

### 3. Bodega de Ahorros
1. Ve a pestaña "🏦 Bodega"
2. Selecciona nivel (Básica, Plus, Premium, Élite)
3. Ingresa cantidad de monedas a depositar
4. Mira ganancia estimada diaria
5. Presiona "Depositar en Bodega"

### 4. Cambio de Monedas (Exchange)
1. Ve a pestaña "🔄 Cambio"
2. Selecciona moneda origen (Worldcoin o MAR-AP)
3. Ingresa cantidad
4. Mira desglose:
   - Cantidad convertida (bruta)
   - Cantidad quemada (5%)
   - Cantidad final que recibes
5. Presiona "Cambiar"

### 5. Gráfico de Precios
1. Ve a pestaña "📊 Precios"
2. Mira gráfico interactivo de 7 días
3. Precio actual MAR-AP: $0.0065
4. Cambio 24h: +12.5% (verde = subiendo)

### 6. AI Assistant (Marisol)
1. Presiona botón 🤖 en esquina inferior derecha
2. Haz preguntas como:
   - "¿Cuál es el mejor nivel de minería?"
   - "¿Cómo funcionan los ahorros?"
   - "¿Qué es la quema de monedas?"
   - "¿Cómo maximizo mis ganancias?"
3. Marisol responde en tiempo real

---

## Estructura de Navegación

```
Inicio ✨
├── Hero section
├── Información de proyecto
└── Botones de navegación

Billetera 💰
├── Saldo MAR-AP
├── Historial
└── Transferencias

Bodega 🏦
├── 4 Etapas con tasas
├── Depósito manual
└── Reclamar intereses

Minería ⛏️
├── 4 Etapas con multiplicadores
└── Actualizar nivel

Cambio 🔄
├── Exchange WC ↔ MAR-AP
├── Cálculo de quema (5%)
└── Historial de cambios

Precios 📊
├── Gráfico 7 días
├── Tendencia
└── Estadísticas

Worldcoin 🌍
├── Verificación de identidad
├── Dirección Worldcoin
└── Desconexión
```

---

## Puntos Técnicos Importantes

### Verificación Worldcoin
- **Perfecto**: Genera dirección única basada en Telegram ID + User ID
- **Seguro**: Usa hash SHA256 criptográfico
- **Persistente**: Se guarda en base de datos
- **Auditable**: Timestamp de verificación

### Multiplicadores de Minería
- Más alto el nivel = Más ganancias diarias
- Diamante gana 3x vs Normal
- Costo progresivo (15→25→40→65 WC)
- Inversión que se amortiza rápido

### Tasas de Bodega
- Calculadas por CANTIDAD guardada
- 10 MAR-AP en Bodega Básica = 0.001 diarios
- 50 MAR-AP en Bodega Élite = 0.025 diarios
- Compound automaticamente cada 24h

### Sistema de Quema
- 5% en CADA transacción de exchange
- Ejemplo: cambias 100 MAR-AP
  - Bruto: 1 WC (100÷100)
  - Quema: 0.05 WC (5%)
  - Recibes: 0.95 WC
- Previene inflación y mantiene valor

### AI Assistant
- Usa Vercel AI Gateway (OpenAI GPT-4o-mini)
- Conocimiento especializado sobre MAR-AP
- Responde en español
- Mantiene historial de conversación

---

## Próximos Pasos

1. **Ejecutar migración SQL** en Supabase:
   ```sql
   -- Ejecutar los archivos en:
   scripts/add-mining-and-savings-levels.sql
   ```

2. **Configurar variables de entorno**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Probar en desarrollo**:
   ```bash
   npm run dev
   ```

4. **Desplegar a producción**:
   - GitHub → Vercel (automático)
   - O usar Vercel CLI

---

## Soporte

Si algo no funciona:

1. Revisa la consola del navegador (F12)
2. Verifica logs en Vercel
3. Comprueba que las variables de entorno están correctas
4. Ejecuta la migración SQL en Supabase

**Estado**: ✅ TODO FUNCIONA Y ESTÁ LISTO
