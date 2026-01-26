# Guía de Testing - Marisol Ancestral Token

## 🧪 Testing Manual Completo

### Requisitos
- Node.js 18+
- npm
- Navegador moderno
- Developer Tools (F12)

---

## 1️⃣ Setup Inicial

```bash
# Clonar/descargar proyecto
cd marisol-ancestral-token

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Acceder a http://localhost:3000
```

---

## 2️⃣ Test: Usuario Nuevo

### Pasos
1. Abrir http://localhost:3000
2. Abrir DevTools (F12) → Application → Local Storage
3. Verificar datos del usuario

### Validaciones
```
✅ user_data existe en localStorage
✅ balance = 0 (nuevo usuario)
✅ miningBalance = 0
✅ worldcoinVerified = false
✅ miningLevel = 1
✅ miningPower = 1
✅ createdAt = fecha actual
```

### Screenshot esperado
- Header: muestra "0.00 MAR-AP"
- Hero section: muestra personaje Marisol
- Balance: 0

---

## 3️⃣ Test: Hero Section

### Pasos
1. Ver pantalla inicial
2. Revisar card de información
3. Ver botones

### Validaciones
```
✅ Imagen de Marisol visible
✅ Texto: "NO ES TU FUTURO, ES LO QUE YA ESTÁS ACTIVANDO"
✅ Botón "Ver Mi Balance" funciona
✅ Botón "Conectar Worldcoin" funciona
✅ Colores: dorado y negro correctos
✅ Efectos glow presentes
```

---

## 4️⃣ Test: Dashboard de Tokens

### Pasos
1. Click en botón "Ver Mi Balance"
2. Navegar a pestaña "Billetera"
3. Revisar información

### Validaciones
```
✅ Título: "Mi Balance"
✅ Balance total: 0.00 (inicial)
✅ Stats mostrados:
   - Nivel: 1
   - Poder: 1x
   - Verificado: ○ (no)
✅ Sección de transferencias visible
✅ Historial vacío (inicial)
```

### Test Transferencia (fallido esperado)
```
1. Intentar transferir 100 MAR-AP
2. Validación debe bloquearlo
3. Verificar error: "Saldo insuficiente"
```

---

## 5️⃣ Test: Worldcoin Section

### Pasos
1. Click en botón "Conectar Worldcoin"
2. O navegar a pestaña "🌍 Worldcoin"
3. Leer información

### Validaciones
```
✅ Título: "Worldcoin"
✅ Estado: "Desconectado"
✅ Card con info: "¿Qué es Worldcoin?"
✅ Botón: "Verificar con Worldcoin"
✅ Links reales:
   - https://worldcoin.org (abre en nueva pestaña)
   - https://docs.worldcoin.org
   - https://verify.worldcoin.org
✅ Beneficios mostrados
✅ Estadísticas reales
```

### Test Verificación
```
1. Click en "Verificar con Worldcoin"
2. Esperar 2 segundos (simulación)
3. Verificar cambio:
   - Estado → "Conectado"
   - Wallet visible
   - Botón → "✓ Conectado"
```

### Validar LocalStorage
```
En DevTools → Application → Local Storage:
✅ worldcoinVerified = true
✅ worldcoinAddress = 0x... (generado)
```

---

## 6️⃣ Test: Mining Section

### Prerequisito
- Primero verificar Worldcoin (paso 5)

### Pasos
1. Navegar a pestaña "⛏️ Minería"
2. Click en "Iniciar Minería"

### Validaciones Iniciales
```
✅ Título: "Mina MAR-AP"
✅ Estado: "Parado" (inicial)
✅ Ganancia: 0
✅ Nivel: 1
✅ Poder: 1x
✅ Ganancia por segundo: 0.1
```

### Test: Iniciar Minería
```
1. Click "Iniciar Minería"
2. Verificar cambios:
   ✅ Icono: ⛏️ animado
   ✅ Estado: "Minando..."
   ✅ Cronómetro: comienza a contar
   ✅ Ganancia: aumenta cada segundo

3. Esperar 10 segundos
4. Verificar:
   ✅ Ganancia: ~1.0 (0.1 × 10 segundos)
   ✅ Header balance actualizado

5. En DevTools → Application:
   ✅ balance = 1.0
   ✅ miningBalance = 1.0
```

### Test: Detener Minería
```
1. Click "Detener Minería"
2. Verificar:
   ✅ Estado: "Parado"
   ✅ Cronómetro: se detiene
   ✅ Ganancia: congelada
   ✅ Datos persistidos en localStorage
```

### Test: Múltiples Sesiones
```
1. Iniciar minería (5 seg)
   ✅ balance = 0.5

2. Detener
   ✅ balance = 0.5 (persistido)

3. Recargar página (F5)
   ✅ balance aún = 0.5

4. Iniciar minería de nuevo (5 seg)
   ✅ balance sube a 1.0
```

---

## 7️⃣ Test: Sincronización Balance-Minería

### Test de Sincronización Perfecta
```
Estado Inicial:
- balance = 0
- miningBalance = 0

Minería 1 segundo:
- Ganancia: 0.1
- balance: 0.1 ✅
- miningBalance: 0.1 ✅
- En localStorage: ambos sincronizados ✅

Detener y verificar:
- Datos persistidos ✅
- Al recargar: mismo balance ✅
```

### Test: Múltiples Ganancias
```
Ejecutar 3 sesiones de minería (5 seg cada una):

Sesión 1: 5 seg × 0.1 = 0.5 ✅
Sesión 2: 5 seg × 0.1 = 0.5 (total: 1.0) ✅
Sesión 3: 5 seg × 0.1 = 0.5 (total: 1.5) ✅

Validar:
✅ balance = 1.5 en header
✅ balance = 1.5 en dashboard
✅ miningBalance = 1.5
✅ Total acumulado correcto
```

---

## 8️⃣ Test: Mejora de Minería

### Prerequisitos
- balance = 100 (por testing, modificar en localStorage)
- Worldcoin verificado

### Pasos
1. En DevTools, editar localStorage:
   ```json
   {
     ...user_data,
     "balance": 100
   }
   ```

2. Recargar página
3. Ir a Mining
4. Verificar botón "Mejorar a Nivel 2 - 50 WLD"

### Test: Upgrade Nivel 2
```
1. Click "Mejorar a Nivel 2"
2. Verificar:
   ✅ balance: 100 → 50 (descontado 50 WLD)
   ✅ miningLevel: 1 → 2
   ✅ miningPower: 1 → 2
   ✅ ganancia/seg: 0.1 → 0.25

3. Iniciar minería (4 seg)
   ✅ Ganancia: 0.25 × 4 = 1.0
   ✅ Header balance: 50 + 1.0 = 51.0
```

### Test: Validación Saldo Insuficiente
```
1. Con balance = 50
2. Intentar mejorar a Nivel 3 (costo 150)
3. Debe mostrar: "Saldo insuficiente"
4. Minería no se degrada
```

---

## 9️⃣ Test: Transferencia de Tokens

### Prerequisitos
- balance = 50 (por testing)

### Test: Transferencia Válida
```
1. Navegar a Billetera
2. Llenar:
   - Dirección: 0x123456789abc
   - Cantidad: 20

3. Click "Transferir Ahora"
4. Verificar:
   ✅ balance: 50 → 30
   ✅ Alerta de confirmación
   ✅ Datos limpios en form
```

### Test: Validaciones
```
Test 1: Campo vacío
- Resultado: error "Completa todos los campos" ✅

Test 2: Cantidad = 0
- Resultado: error "La cantidad debe ser mayor a 0" ✅

Test 3: Saldo insuficiente (intentar 100 con saldo 30)
- Resultado: error "Saldo insuficiente" ✅

Test 4: Dirección inválida
- Resultado: acepta (para testing) ✅
```

---

## 🔟 Test: Navegación

### Pasos
1. Hacer click en cada pestaña
2. Verificar transiciones suaves

### Validaciones
```
Pestaña Inicio (✨):
✅ Hero section visible
✅ Balance en header actualizado
✅ Efectos glow presentes

Pestaña Billetera (💰):
✅ Balance mostrado
✅ Stats correctos
✅ Form de transferencia

Pestaña Minería (⛏️):
✅ Minería funcionando
✅ Stats en tiempo real
✅ Botones de control

Pestaña Worldcoin (🌍):
✅ Info y botones
✅ Links reales
✅ Estado de verificación
```

---

## 1️⃣1️⃣ Test: Responsive Design

### En Desktop
```
Abrir DevTools → Responsive Design Mode
Probar tamaños:
- 375px (iPhone SE)
- 412px (Galaxy S8)
- 768px (iPad)
- 1024px (Tablet)

Validar:
✅ Contenido siempre visible
✅ Sin overflow horizontal
✅ Botones clickeables
✅ Texto legible
```

### En Móvil Real
```
1. Hacer npm run dev
2. Obtener IP: ipconfig (Windows) o ifconfig (Mac)
3. Abrir en móvil: http://[IP]:3000
4. Probar todas las funcionalidades
5. Verificar touch responsivo
```

---

## 1️⃣2️⃣ Test: Persistencia de Datos

### Test localStorage
```
1. Abrir app
2. Hacer algunos cambios (minar, verificar, etc)
3. Abrir DevTools → Application → Local Storage
4. Copiar contenido de "user_data"
5. Recargar página (F5)
6. Verificar todos los datos intactos

Verificaciones:
✅ Balance persistido
✅ Mining balance persistido
✅ Estado verificación persistido
✅ Nivel de minería persistido
✅ Timestamp creación persistido
```

### Test: Limpiar Datos
```
1. En DevTools → Application → Local Storage
2. Eliminar "user_data"
3. Recargar página
4. Nuevo usuario creado con balance = 0 ✅
```

---

## 1️⃣3️⃣ Test: Performance

### En DevTools → Performance
```
1. Grabar sesión
2. Iniciar minería (10 segundos)
3. Parar grabación
4. Analizar:
   ✅ FPS > 30
   ✅ Jank mínimo
   ✅ Memory sin fugas
```

### En DevTools → Network
```
1. Abrir Network tab
2. Recargar página
3. Verificar:
   ✅ Size total < 500KB
   ✅ Load time < 2 segundos
   ✅ Sin recursos fallidos
```

---

## 1️⃣4️⃣ Test: Casos Extremos

### Minería Prolongada
```
1. Dejar minería corriendo 1 hora
2. Verificar:
   ✅ Balance actualizado correctamente
   ✅ Sin memory leak
   ✅ Sin lag progresivo
   ✅ Números precisos
```

### Múltiples Upgrades
```
1. Editar localStorage: balance = 10000
2. Hacer upgrade a todos los niveles
3. Verificar:
   ✅ Cada upgrade correcto
   ✅ Niveles incremental
   ✅ Ganancias aumentan
```

### Recarga Frecuente
```
1. Iniciar minería
2. Recargar página cada 2 segundos (10 veces)
3. Verificar:
   ✅ Balance consistente
   ✅ Sin datos perdidos
   ✅ Sin duplicados
```

---

## 1️⃣5️⃣ Test: Accessibility

### Keyboard Navigation
```
1. Presionar TAB
2. Navegar entre todos los botones
3. Presionar ENTER para activar
4. Verificar todo funciona sin mouse ✅
```

### Screen Reader (NVDA/JAWS)
```
1. Activar screen reader
2. Navegar app
3. Escuchar descripciones
4. Verificar textos descriptivos ✅
```

### Colores y Contraste
```
1. Verificar razón de contraste > 4.5:1
2. Usar herramienta WAVE
3. No errores de accesibilidad ✅
```

---

## 📋 Checklist de Testing

### Funcionalidades Core
- [ ] Usuario nuevo comienza con balance = 0
- [ ] Worldcoin requiere verificación
- [ ] Minería genera tokens en tiempo real
- [ ] Balance y minería sincronizados
- [ ] Mejora requiere WLD

### Validaciones
- [ ] Transferencia valida cantidad
- [ ] Transferencia valida saldo
- [ ] Minería requiere verificación
- [ ] Upgrade valida saldo

### Datos
- [ ] localStorage persiste
- [ ] Recargar mantiene datos
- [ ] Limpiar localStorage resetea
- [ ] Números son precisos

### UI/UX
- [ ] Responsive en móvil
- [ ] Animaciones suaves
- [ ] Loading states
- [ ] Errores claros
- [ ] Colores correctos

### Performance
- [ ] No memory leaks
- [ ] FPS > 30
- [ ] Load < 2 segundos
- [ ] Minería precisa cada segundo

---

## 🐛 Debugging Tips

### Problema: Balance no se actualiza
```javascript
// En DevTools Console:
JSON.parse(localStorage.getItem('user_data'))
// Verificar que balance cambió
```

### Problema: Minería no inicia
```javascript
// Verificar Worldcoin verificado:
const user = JSON.parse(localStorage.getItem('user_data'));
console.log(user.worldcoinVerified); // Debe ser true
```

### Problema: Números imprecisos
```javascript
// Minería debe ser exacta:
// 0.1 MAR-AP cada segundo
// 1 segundo = 1000ms
```

### Problema: localStorage no persiste
```javascript
// Verificar que localStorage está habilitado:
typeof(Storage) !== "undefined" // Debe ser true
```

---

## ✅ Testing Completado

Cuando hayas pasado todos estos tests:

```
✅ Proyecto validado
✅ Listo para producción
✅ Listo para Telegram Bot
✅ Listo para Vercel deploy
✅ Listo para integración real
```

---

**Happy Testing!** 🚀

Marisol Ancestral Token ✨
