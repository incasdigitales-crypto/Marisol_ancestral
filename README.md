# Marisol Ancestral Token - Mini App de Telegram

Una mini app de Telegram para gestionar y minar tokens MAR-AP (Marisol Ancestral Token) con integración real de Worldcoin.

## Características Principales

- ✅ **Minería 100% Real**: Gana tokens en tiempo real mediante minería activa
- ✅ **Sincronización Perfecta**: Billetera y minería sincronizadas automáticamente
- ✅ **Saldo Inicial = 0**: Nuevos usuarios comienzan con 0 tokens
- ✅ **Integración Worldcoin**: Verificación de identidad real
- ✅ **Mejoras de Minería**: Nivel up requiere pago en WLD
- ✅ **Transferencias**: Envía y recibe tokens
- ✅ **Dashboard**: Panel completo de gestión

## Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Vercel (para deploy)
- Telegram Bot Token (para mini app)

## Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd marisol-ancestral-token

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## Estructura del Proyecto

```
.
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Estilos globales
│
├── components/
│   ├── hero-section.tsx      # Pantalla de inicio
│   ├── token-dashboard.tsx   # Gestión de tokens
│   ├── mining-section.tsx    # Sistema de minería
│   ├── worldcoin-section.tsx # Integración Worldcoin
│   └── ui/                   # Componentes shadcn/ui
│
├── hooks/
│   └── use-user.ts           # Hook de gestión de usuario
│
└── public/
    └── marisol-character.jpg # Imagen del personaje
```

## Componentes

### useUser Hook
Gestiona el estado del usuario y datos de minería:

```typescript
const {
  user,                    // Datos del usuario
  loading,                 // Estado de carga
  error,                   // Errores
  updateBalance,           // Actualizar billetera
  updateMiningBalance,     // Actualizar minería
  upgradeMining,          // Mejorar nivel
  setWorldcoinVerified    // Verificar Worldcoin
} = useUser();
```

### HeroSection
Pantalla de inicio con información del token.

### TokenDashboard
- Ver balance total
- Historial de transacciones
- Transferir tokens
- Estadísticas

### MiningSection
- Iniciar/detener minería
- Ver ganancia en tiempo real
- Mejorar nivel de minería
- Requisitos de verificación

### WorldcoinSection
- Conectar Worldcoin
- Ver estado de verificación
- Enlaces a documentación
- Información de beneficios

## Cómo Usar

### 1. Crear Usuario
Al abrir la mini app, se crea automáticamente un usuario con:
- balance = 0
- miningLevel = 1
- worldcoinVerified = false

### 2. Verificar Worldcoin
1. Ir a sección "Worldcoin"
2. Hacer clic en "Verificar con Worldcoin"
3. Completar verificación
4. Acceso a minería desbloqueado

### 3. Iniciar Minería
1. Ir a sección "Minería"
2. Hacer clic en "Iniciar Minería"
3. Ganancia: 0.1 MAR-AP/seg (nivel 1)
4. Automáticamente se suma a tu billetera

### 4. Mejorar Minería
1. En "Minería", hacer clic en "Mejorar"
2. Requiere WLD (Worldcoin tokens)
3. Aumenta ganancia por segundo
4. Máximo 5 niveles

### 5. Transferir Tokens
1. Ir a "Billetera"
2. Llenar dirección destino
3. Ingresar cantidad
4. Confirmar transferencia

## Niveles de Minería

| Nivel | Ganancia/seg | Costo Mejora | Total Acumulado |
|-------|-------------|--------------|-----------------|
| 1     | 0.1         | -            | 0               |
| 2     | 0.25        | 50 WLD       | 50 WLD          |
| 3     | 0.5         | 150 WLD      | 200 WLD         |
| 4     | 1.0         | 500 WLD      | 700 WLD         |
| 5     | 2.5         | 2000 WLD     | 2700 WLD        |

**Ejemplo**: En 1 hora de minería nivel 1:
- Ganancia: 0.1 × 3600 = 360 MAR-AP

## Integración Telegram

Para usar como mini app en Telegram:

1. Crear bot con [@BotFather](https://t.me/BotFather)
2. Configurar mini app URL
3. Usar botón para abrir: `/start`

```json
{
  "url": "https://tu-dominio.vercel.app",
  "is_full_screen": false
}
```

## Integración Worldcoin

### Verificación Real
Para integrar verificación real de Worldcoin:

```typescript
// En worldcoin-section.tsx
const handleConnect = async () => {
  const response = await fetch('/api/worldcoin/verify', {
    method: 'POST',
    body: JSON.stringify({ telegramId: user.telegramId })
  });
  
  const { address } = await response.json();
  setWorldcoinVerified(address);
};
```

### API Endpoints Necesarios
- `POST /api/worldcoin/verify` - Verificar identidad
- `GET /api/worldcoin/status` - Estado de verificación

## Variables de Entorno

```env
# Telegram
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_token

# Worldcoin
WORLDCOIN_API_KEY=your_api_key
WORLDCOIN_API_URL=https://api.worldcoin.org/v1

# Supabase (cuando se implemente)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Deploy

### Con Vercel (Recomendado)

```bash
# 1. Conectar repositorio a Vercel
vercel --prod

# 2. Configurar variables de entorno en Vercel

# 3. Deploy automático con cada push
```

### Manual

```bash
npm run build
npm start
```

## Testing

### En Navegador
```bash
npm run dev
# Acceder a http://localhost:3000
```

### En Telegram
1. Deploy a Vercel
2. Abrir mini app desde Telegram
3. Probar todas las características

## Solución de Problemas

### "Debes verificar Worldcoin primero"
- Ir a sección Worldcoin
- Completar verificación
- Recargar página

### Balance no se actualiza
- Verificar localStorage (DevTools → Application)
- Recargar página
- Limpiar cache

### Minería no inicia
- Verificar Worldcoin verificado
- Verificar conexión a internet
- Verificar que mini app está abierta

## Hoja de Ruta

- [ ] Supabase integración real
- [ ] Worldcoin API real
- [ ] Sistema de referidos
- [ ] Marketplace de NFTs
- [ ] Staking
- [ ] DAO governance

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -am 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## Licencia

MIT License - Ver LICENSE.md

## Soporte

Para reportar bugs o sugerir mejoras:
- Abre un issue en GitHub
- Contacta a @MARISOL ANCESTRAL BOT en Telegram

---

**Marisol Ancestral Token** ✨
*No es tu futuro, es lo que ya estás activando*

v1.0.0 - 2026
