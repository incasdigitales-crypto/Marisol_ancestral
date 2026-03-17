# Casos de Prueba - Marisol Ancestral Token

## 🧪 Pruebas del Sistema de Bodega

### Test 1: Depositar Monedas Válidas
```
Precondición: Usuario tiene 100 MAR-AP en balance
Paso 1: Navega a pestaña "Bodega" 🏦
Paso 2: Ingresa "50" en campo de cantidad
Paso 3: Hace clic en "Depositar"

Resultado Esperado:
✓ Balance cambia: 100 → 50 MAR-AP
✓ Bodega muestra: 50 MAR-AP
✓ Mensaje de éxito: "Depositado 50 MAR-AP en tu bodega"
✓ Los datos se sincronizan con la BD
```

### Test 2: Intentar Depositar sin Saldo Suficiente
```
Precondición: Usuario tiene 50 MAR-AP en balance
Paso 1: Navega a "Bodega"
Paso 2: Intenta depositar 100 MAR-AP
Paso 3: Hace clic en "Depositar"

Resultado Esperado:
✓ Se muestra error: "Saldo insuficiente"
✓ Balance NO se modifica
✓ Bodega NO se modifica
✓ Sin cambios en la BD
```

### Test 3: Depositar Cantidad Inválida
```
Precondición: Usuario tiene 100 MAR-AP
Paso 1: Navega a "Bodega"
Paso 2: Ingresa valores inválidos:
   - Texto: "abc" → Ignora input
   - Negativo: "-10" → Error
   - Cero: "0" → Error
Paso 3: Intenta "Depositar"

Resultado Esperado:
✓ Se muestra: "Ingresa una cantidad válida"
✓ No se procesa depósito
✓ Balance sin cambios
```

### Test 4: Múltiples Depósitos Consecutivos
```
Precondición: Usuario tiene 200 MAR-AP
Paso 1: Deposita 50 MAR-AP → Balance = 150, Bodega = 50
Paso 2: Deposita 30 MAR-AP → Balance = 120, Bodega = 80
Paso 3: Deposita 20 MAR-AP → Balance = 100, Bodega = 100

Resultado Esperado:
✓ Cada depósito se procesa correctamente
✓ Los balances son acumulativos
✓ Bodega = 50 + 30 + 20 = 100 ✓
✓ Balance = 200 - 100 = 100 ✓
```

---

## 💰 Pruebas del Sistema de Interés Diario

### Test 5: Reclamar Interés Antes de 24h
```
Precondición: Usuario depositó hace 12 horas
Paso 1: Navega a "Bodega"
Paso 2: Ve botón "Reclamar Interés" deshabilitado
Paso 3: Intenta hacer clic

Resultado Esperado:
✓ Botón está deshabilitado
✓ Muestra timer: "Próximo en: 12h 0m"
✓ Se actualiza cada minuto
✓ No se reclama interés
```

### Test 6: Reclamar Interés Después de 24h
```
Precondición: Usuario depositó hace 25 horas
Paso 1: Navega a "Bodega"
Paso 2: Ve botón "Reclamar Interés" habilitado ✓
Paso 3: Hace clic en "Reclamar Interés"

Resultado Esperado:
✓ Balance aumenta: 100 → 101 MAR-AP
✓ Bodega se mantiene: 100 MAR-AP
✓ Mensaje: "¡Ganaste 1 MAR-AP de interés diario!"
✓ Timer reinicia: "Próximo en: 24h 0m"
✓ Se guarda en BD
```

### Test 7: Múltiples Reclamos Diarios
```
Precondición: Usuario deposita 50 MAR-AP el Día 1
Día 1: Deposita 50 MAR-AP
   - Balance: 0 → 50
   - Bodega: 50 MAR-AP
   - Timer: Activo

Día 2: Reclama 1 MAR-AP
   - Balance: 0 + 1 = 1
   - Bodega: 50 (sin cambios)
   - Timer: Reinicia (24h)

Día 3: Reclama 1 MAR-AP
   - Balance: 1 + 1 = 2
   - Bodega: 50 (sin cambios)

Día 30: Reclama (x28 veces desde Día 2)
   - Balance: 28 MAR-AP
   - Bodega: 50 MAR-AP

Resultado Esperado:
✓ Cada día suma exactamente 1 MAR-AP
✓ Bodega no cambia
✓ Total ganado = 28 MAR-AP en 28 días ✓
```

### Test 8: Proyección Anual
```
Precondición: Usuario deposita 100 MAR-AP
Paso 1: Navega a "Bodega"
Paso 2: Ve sección "Proyección Anual"

Resultado Esperado:
✓ Muestra: "464 MAR-AP" (100 + 365 días)
✓ Subtítulo: "Si mantienes tu bodega llena"
✓ Cálculo = 100 + 364 = 464 ✓
```

---

## 🌍 Pruebas de Verificación Worldcoin

### Test 9: Verificación Exitosa
```
Precondición: Usuario no está verificado (worldcoinVerified = false)
Paso 1: Navega a "Worldcoin" 🌍
Paso 2: Ve: "Desconectado" 
Paso 3: Hace clic en "Verificar Identidad Ahora"

Resultado Esperado (Progresión):
✓ Estado cambia a "Verificando..."
✓ Ver spinner/animación de carga
✓ Después de 1-2 segundos → "Conectado"
✓ Muestra dirección Worldcoin: 0x... (40 caracteres hex)
✓ Botón cambia a "✓ Verificado exitosamente"
✓ worldcoinVerified = true en BD
✓ El usuario puede minar
```

### Test 10: Verificación ya Realizada
```
Precondición: Usuario ya verificado anteriormente
Paso 1: Navega a "Worldcoin"
Paso 2: Ve: "Conectado" ✓

Resultado Esperado:
✓ Dirección Worldcoin visible: 0x...
✓ Botón: "✓ Verificado exitosamente" (deshabilitado)
✓ Sin opción de re-verificar
✓ Dirección es la MISMA que antes
```

### Test 11: Error en Verificación
```
Precondición: Simular error de servidor
Paso 1: Navega a "Worldcoin"
Paso 2: Hace clic en "Verificar Identidad Ahora"
Paso 3: API retorna error

Resultado Esperado:
✓ Se muestra error en rojo
✓ Mensaje de error detallado
✓ Estado sigue siendo "Desconectado"
✓ Usuario puede reintentar
```

### Test 12: Verificación Única por Usuario
```
Precondición: Dos usuarios diferentes
Usuario A: Se verifica → dirección: 0x111...111
Usuario B: Se verifica → dirección: 0x222...222

Resultado Esperado:
✓ Cada usuario tiene dirección ÚNICA
✓ Imposible dos usuarios con misma dirección
✓ Las direcciones se guardan en BD
✓ No hay conflictos
```

---

## 🏗️ Pruebas de Arquitectura

### Test 13: Fallback a localStorage sin Supabase
```
Escenario: Supabase no está disponible
Paso 1: Desconecta internet o apaga Supabase
Paso 2: Abre la app

Resultado Esperado:
✓ Mensaje en consola: "[v0] Supabase not available..."
✓ App carga normalmente
✓ Datos se guardan en localStorage
✓ Las funciones funcionan igual
✓ Al volver Supabase → sincroniza automáticamente
```

### Test 14: Sincronización de Datos
```
Escenario: Usuario con localStorage + Supabase
Paso 1: Usa la app 30 minutos (offline)
Paso 2: Se conecta a internet (Supabase online)

Resultado Esperado:
✓ Datos se sincronizan automáticamente
✓ No hay duplicación de datos
✓ El estado más reciente gana
✓ No se pierden transacciones
```

### Test 15: Persistencia de Datos
```
Escenario: Usuario cierra y reabre la app
Paso 1: Deposita 50 MAR-AP en Bodega
Paso 2: Cierra la app completamente
Paso 3: Reabre la app

Resultado Esperado:
✓ Datos aún están: Bodega = 50
✓ Balance se mantiene
✓ lastSavingsUpdate se recuerda
✓ Timer continúa correctamente
```

---

## 🧭 Pruebas de Navegación

### Test 16: Acceso a Todas las Pestañas
```
Paso 1: Verifica que existen 5 botones en el menú:
   ✓ Inicio (✨)
   ✓ Billetera (💰)
   ✓ Bodega (🏦) [NUEVO]
   ✓ Minería (⛏️)
   ✓ Worldcoin (🌍)

Paso 2: Hace clic en cada uno

Resultado Esperado:
✓ Cada pestaña se abre correctamente
✓ El contenido es el esperado
✓ Los estados se mantienen (no se reinician)
✓ El menú se actualiza visualmente
```

### Test 17: Estado de Selección
```
Paso 1: Navega a "Bodega"
Paso 2: Verifica estilo del botón

Resultado Esperado:
✓ Botón "Bodega" está resaltado
✓ Otros botones sin resaltar
✓ Color primario visible
✓ Claramente se ve cuál es la pestaña activa
```

### Test 18: Menú Responsive
```
Dispositivos a probar:
1. Mobile: 320px
2. Tablet: 768px
3. Desktop: 1024px

Resultado Esperado:
✓ En 320px: Todos los botones caben sin scrolling
✓ Texto no se corta
✓ Iconos visibles
✓ Separación uniforme
✓ Sin overflow horizontal
```

---

## 🔄 Pruebas de Integración

### Test 19: Mining + Ahorros + Interés
```
Flujo completo:
Paso 1: Usuario inicia con balance = 0
Paso 2: Verifica Worldcoin ✓
Paso 3: Inicia minería ⛏️ (gana 10 MAR-AP)
Paso 4: Detiene minería
Paso 5: Navega a "Bodega"
Paso 6: Deposita 10 MAR-AP
Paso 7: Espera 24h
Paso 8: Reclama interés

Resultado Esperado:
✓ Balance: 0 → 10 → 0 → 1
✓ Bodega: 0 → 10 → 10
✓ Proyección: "375 MAR-AP anual"
✓ Cada paso es independiente
✓ Los sistemas funcionan juntos
```

### Test 20: Flujo Completo Usuario Nuevo
```
Simulación de nuevo usuario:
1️⃣ Entra → Crea cuenta → balance = 0
2️⃣ Va a Worldcoin → Verifica → ✓
3️⃣ Va a Mining → Inicia → gana 0.1/s
4️⃣ Después de 1min → balance = 6 MAR-AP
5️⃣ Detiene Mining
6️⃣ Va a Bodega → Deposita 5 MAR-AP
7️⃣ Balance: 1 MAR-AP, Bodega: 5 MAR-AP
8️⃣ Espera 24h (simular)
9️⃣ Reclama 1 MAR-AP → balance: 2 MAR-AP
🔟 Sigue minando, ganando, ahorrando...

Resultado Esperado:
✓ Flujo sin errores
✓ Balances correctos en cada paso
✓ Usuario puede tener ganancias continuas
✓ Sistema es funcional y lógico
```

---

## ✅ Checklist de Validación

### Antes de Producción:
- [ ] Test 1-4: Depósitos funcionan
- [ ] Test 5-8: Interés diario funciona
- [ ] Test 9-12: Worldcoin verifica
- [ ] Test 13-15: Almacenamiento persiste
- [ ] Test 16-18: Navegación funciona
- [ ] Test 19-20: Integración completa

### Performance:
- [ ] App carga en < 2 segundos
- [ ] Transacciones < 500ms
- [ ] Sin memory leaks
- [ ] Responsive en móviles

### Seguridad:
- [ ] No hay datos expuestos en console
- [ ] Las API validan datos
- [ ] localStorage encriptado (opcional)
- [ ] RLS habilitado en Supabase

---

## 📊 Resultados Esperados Finales

```
✓ Sistema de Bodega: FUNCIONAL
✓ Interés Diario: FUNCIONANDO
✓ Worldcoin: VERIFICADO
✓ Navegación: RESPONSIVA
✓ Almacenamiento: PERSISTENTE
✓ Integración: COMPLETA
✓ Seguridad: VALIDADA
✓ Performance: OPTIMIZADO

═════════════════════════════════════
    🎉 ¡LISTO PARA PRODUCCIÓN! 🎉
═════════════════════════════════════
```
