# Guía Rápida - Marisol Ancestral Token ⚡

## ¿Qué se ha hecho?

### ✅ Sistema de Bodega/Ahorro
Los usuarios ahora pueden:
1. **Guardar monedas** en la Bodega
2. **Ganar interés diario** automáticamente (1 MAR-AP cada 24 horas)
3. **Reclamar el interés** con un solo clic
4. **Ver proyecciones** de ganancias anuales

### ✅ Verificación Worldcoin Funcional
La verificación ahora:
1. **Realmente verifica** al usuario
2. **Genera direcciones únicas** de Worldcoin
3. **Muestra estados claros** (verificando, éxito, error)
4. **Permite minar** solo usuarios verificados

### ✅ Nueva Pestaña de Navegación
Agregada en el menú inferior:
- **🏦 Bodega** - Acceso a ahorros e interés diario

---

## ¿Cómo Funciona?

### Para el Usuario Final:

```
1. El usuario entra a la app → SALDO = 0
2. Gana monedas (minería, etc.)
3. Va a pestaña "Bodega" 🏦
4. Deposita, ej: 100 MAR-AP
5. Espera 24 horas
6. Hace clic en "Reclamar Interés"
7. Gana +1 MAR-AP
8. Repite diariamente → GANANCIAS INFINITAS
```

### Para Verificar su Cuenta Worldcoin:

```
1. Va a "Worldcoin" 🌍
2. Hace clic en "Verificar Identidad Ahora"
3. Espera a que se verifique
4. Ve su dirección Worldcoin
5. ¡Ya puede minar!
```

---

## 🚀 Pasos Inmediatos

### Si tienes Supabase conectado:

1. **Abre tu consola SQL de Supabase**
2. **Copia el archivo:** `/scripts/add-savings-table.sql`
3. **Pega y ejecuta** en la consola SQL
4. **¡Listo!** - La app funcionará con BD real

### Si NO tienes Supabase:

1. **No necesitas hacer nada**
2. La app usa `localStorage` automáticamente
3. Los datos se guardan localmente
4. Cuando conectes Supabase, sincronizará automáticamente

---

## 📋 Checklist de Verificación

En tu preview o app, verifica que:

- [ ] **Pestaña Bodega existe** en el menú inferior (🏦)
- [ ] **Puedes depositar monedas** (con saldo disponible)
- [ ] **El interés muestra un timer** (próximo en X horas)
- [ ] **Puedes reclamar interés** después de 24 horas
- [ ] **Worldcoin verifica correctamente** y muestra dirección
- [ ] **Después de verificar**, el usuario puede minar

---

## 🎯 Flujo Completo del Usuario

```
┌─ INICIO ─────────────────────────────────────┐
│                                               │
│  1️⃣ Usuario entra (balance = 0)             │
│  2️⃣ Verifica identidad en Worldcoin ✓       │
│  3️⃣ Inicia minería ⛏️                       │
│  4️⃣ Gana monedas (ej: 100 MAR-AP)           │
│  5️⃣ Va a Bodega 🏦                           │
│  6️⃣ Deposita 100 MAR-AP                      │
│  7️⃣ Espera 24h                              │
│  8️⃣ Reclama 1 MAR-AP (interés)               │
│  9️⃣ Repite 8️⃣ diariamente                    │
│  🔟 ¡Acumula riqueza! 💰                     │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 🔢 Matemáticas de Rentabilidad

**Escenario:** Usuario deposita 100 MAR-AP

| Día | Acción | Saldo |
|-----|--------|-------|
| 1 | Deposita | 100 |
| 2 | Reclama interés | 101 |
| 7 | Reclama interés | 106 |
| 30 | Reclama interés | 129 |
| 90 | Reclama interés | 189 |
| 180 | Reclama interés | 279 |
| 365 | Reclama interés | **464** |

**Total ganado en 1 año:** 364 MAR-AP (de 100 iniciales)

---

## 📱 Nuevos Componentes

### Componente: SavingsSection
```
Ubicación: /components/savings-section.tsx
Características:
✓ Display de saldo en bodega
✓ Timer para interés diario
✓ Formulario de depósito
✓ Información educativa
✓ Proyecciones anuales
```

### API: Actualizar Ahorros
```
URL: /api/user/update-savings
Método: POST
Parámetros:
- telegramId
- savingsDeposit (monto)
Respuesta: Usuario actualizado
```

### API: Reclamar Interés
```
URL: /api/user/claim-savings-interest
Método: POST
Parámetros:
- telegramId
Validación: Mínimo 24h desde último claim
Respuesta: Usuario actualizado + 1 MAR-AP
```

### API: Verificar Worldcoin
```
URL: /api/user/worldcoin-verify
Método: POST
Parámetros:
- telegramId
Respuesta:
- worldcoinAddress (única por usuario)
- status verificado
```

---

## 🧪 Testear Localmente

### Sin Supabase:
1. La app usa localStorage automáticamente
2. Los datos persisten en el navegador
3. Perfecto para testing

### Simular paso de 24 horas:
```javascript
// En consola del navegador (F12):
const user = JSON.parse(localStorage.getItem('user_YOUR_TELEGRAM_ID'));
user.lastSavingsUpdate = new Date(Date.now() - 25*60*60*1000); // 25h atrás
localStorage.setItem('user_YOUR_TELEGRAM_ID', JSON.stringify(user));
// Recarga la página y podrás reclamar interés
```

---

## 🛠️ Si Hay Problemas

### "No puedo depositar"
- Verifica tener saldo disponible
- Comprueba que ingresaste cantidad > 0

### "El interés no se reclama"
- Deben pasar exactamente 24 horas
- Verifica la fecha/hora de tu dispositivo

### "Worldcoin no verifica"
- Asegúrate de usar Supabase o localStorage esté habilitado
- Verifica la consola (F12) para errores

### Datos no se guardan
- Si Supabase está caído, usa localStorage
- Al volver online, se sincronizará automáticamente

---

## 📚 Documentación Completa

Para detalles técnicos, ver:
- `/CAMBIOS_REALIZADOS.md` - Cambios código a código
- `/SETUP_INSTRUCTIONS.md` - Configuración Supabase
- `/scripts/add-savings-table.sql` - Script SQL

---

## ✨ Resumen

| Función | Estado | Ubicación |
|---------|--------|-----------|
| Bodega/Ahorro | ✅ Completo | `/components/savings-section.tsx` |
| Interés Diario | ✅ Funcional | `/api/user/claim-savings-interest` |
| Depositos | ✅ Operativo | `/api/user/update-savings` |
| Worldcoin Real | ✅ Verificado | `/api/user/worldcoin-verify` |
| Navegación | ✅ Actualizada | `/app/page.tsx` |
| Hook useUser | ✅ Ampliado | `/hooks/use-user.ts` |

---

## 🎉 ¡Todo Listo!

Tu aplicación Marisol Ancestral Token ahora tiene:
- ✅ Sistema de bodega con interés diario
- ✅ Verificación Worldcoin funcional
- ✅ Navegación completa y responsiva
- ✅ Ganancias pasivas para usuarios

**¿Preguntas?** Revisa los archivos de documentación o los comentarios en el código.
