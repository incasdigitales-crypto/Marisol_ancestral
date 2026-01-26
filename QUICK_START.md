# Quick Start - Marisol Ancestral Token

## ⚡ 5 Minutos para Empezar

### 1. Instalación (1 minuto)
```bash
# Clonar proyecto
cd marisol-ancestral-token

# Instalar
npm install

# Ejecutar
npm run dev
```

### 2. Abrir en Navegador (30 segundos)
```
http://localhost:3000
```

✅ **Listo!** La app está corriendo

---

## 🎮 Primeros Pasos

### Paso 1: Ver Tu Balance (30 segundos)
1. Abre la app → http://localhost:3000
2. Ve el header: "0.00 MAR-AP"
3. ✅ Eres un usuario nuevo

### Paso 2: Verificar con Worldcoin (1 minuto)
1. Click en pestaña "🌍 Worldcoin"
2. Click botón "Verificar con Worldcoin"
3. Espera 2 segundos (simulación)
4. ✅ Verificado con éxito

### Paso 3: Iniciar Minería (2 minutos)
1. Click en pestaña "⛏️ Minería"
2. Click botón "Iniciar Minería"
3. Mira el cronómetro y ganancia
4. Espera 10 segundos
5. ✅ Ganaste ~1.0 MAR-AP

### Paso 4: Ver Balance Actualizado (30 segundos)
1. Mira el header: "1.00 MAR-AP"
2. Click pestaña "💰 Billetera"
3. Ve tu saldo: 1.00
4. ✅ Sincronización perfecta

---

## 🔥 Casos de Uso Rápidos

### Usar Minería
```
1. Verificar Worldcoin ✓
2. Ir a Minería
3. Click "Iniciar"
4. Minar mientras navegas
5. Click "Detener"
6. Ganancias guardadas automáticamente
```

### Subir Nivel de Minería
```
Requisitos:
- balance ≥ 50 WLD (para nivel 2)

Pasos:
1. Minar hasta tener 50+ MAR-AP
2. En Minería, click "Mejorar"
3. Ganancia sube de 0.1 a 0.25 MAR-AP/seg
4. ¡Más rápido!
```

### Transferir Tokens
```
1. Ir a Billetera
2. Llenar dirección: 0x123456...
3. Llenar cantidad: 10
4. Click "Transferir"
5. Listo - saldo reducido en 10
```

---

## 📱 Testing en Móvil Real

```bash
# Obtener IP local
# Windows: ipconfig | findstr IPv4
# Mac: ifconfig | grep inet

# Abrir en móvil (mismo wifi):
http://192.168.1.100:3000
```

---

## 🚀 Deploy a Producción

### Opción 1: Vercel (Recomendado)
```bash
# 1. Push a GitHub
git push origin main

# 2. Importar en Vercel
vercel --prod

# 3. Listo!
```

### Opción 2: Cualquier Servidor
```bash
# Build
npm run build

# Start
npm start
```

---

## 📚 Documentación Rápida

| Documento | Para qué |
|-----------|----------|
| README.md | Guía completa |
| TECHNICAL_DOCUMENTATION.md | Arquitectura técnica |
| VALIDATION_REPORT.md | Qué fue corregido |
| TESTING_GUIDE.md | Cómo testear |
| NEXT_STEPS.md | Integración real |

---

## ❓ FAQ Rápido

**P: ¿Por qué mi balance es 0?**  
R: Eres usuario nuevo. Mina tokens para ganar balance.

**P: ¿Por qué no puedo minar?**  
R: Primero verifica con Worldcoin (pestaña 🌍).

**P: ¿Se pierden datos al recargar?**  
R: No, se guardan automáticamente en localStorage.

**P: ¿Es minería real?**  
R: Sí, cada segundo ganas tokens reales (en el sistema).

**P: ¿Cuánto puedo ganar?**  
R: Depende del nivel:
- Nivel 1: 0.1 MAR-AP/seg = 360/hora
- Nivel 5: 2.5 MAR-AP/seg = 9000/hora

---

## 🆘 Troubleshooting

### No carga la página
```bash
# Limpiar cache
rm -rf .next node_modules package-lock.json

# Reinstalar
npm install
npm run dev
```

### Puerto 3000 ocupado
```bash
# Usar puerto diferente
npm run dev -- -p 3001
```

### DevTools muestra errores
```bash
# Limpiar localStorage
Abre DevTools → Application → Local Storage → Elimina "user_data"
Recarga página
```

---

## 💡 Pro Tips

1. **Abrir DevTools** para ver localStorage
   - F12 → Application → Local Storage
   - Verifica cambios en tiempo real

2. **Dejar minería activa**
   - Puedes navegar mientras minas
   - Ganancias se acumulan

3. **Múltiples sesiones**
   - Mina 5 seg, detén
   - Mina 5 seg más
   - Total se suma correctamente

4. **Comprobar sincronización**
   - Balance = Billetera + Minería
   - Siempre sincronizado
   - Sin pérdidas

5. **Testing avanzado**
   - Edita localStorage para balance rápido
   - Upgrade todos los niveles
   - Prueba casos extremos

---

## 📦 Stack Tecnológico

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4
- **UI**: Shadcn/ui
- **Storage**: localStorage (escalable a Supabase)
- **Auth**: Telegram WebApp
- **Deploy**: Vercel

---

## 🎯 Siguiente Paso Recomendado

1. ✅ Completar Quick Start (ahora)
2. ✅ Leer TESTING_GUIDE.md
3. ✅ Pasar todos los tests
4. ✅ Deploy a Vercel
5. ✅ Integrar con Telegram Bot
6. ⏭️ Integración real Supabase/Worldcoin

---

## 🎉 ¡Felicidades!

Ya tienes una mini app completamente funcional de Marisol Ancestral Token.

**¿Siguiente?** → Lee TESTING_GUIDE.md para validar todo funciona bien.

---

**Marisol Ancestral Token** ✨  
*No es tu futuro, es lo que ya estás activando*

v1.0.0 - 2026
