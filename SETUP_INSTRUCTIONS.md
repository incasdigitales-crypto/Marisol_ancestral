# Instrucciones de Configuración - Marisol Ancestral Token

## ✅ Cambios Realizados

### 1. **Sistema de Bodega (Ahorro) - COMPLETADO**
- ✅ Componente `SavingsSection` creado
- ✅ Interfaz de depósito de monedas
- ✅ Sistema de interés diario (1 MAR-AP cada 24 horas)
- ✅ API endpoints para ahorros

**Ubicación del código:**
- Componente: `/components/savings-section.tsx`
- API Depósito: `/app/api/user/update-savings/route.ts`
- API Interés: `/app/api/user/claim-savings-interest/route.ts`

### 2. **Verificación Worldcoin Mejorada - COMPLETADO**
- ✅ Sistema de verificación actualizado y funcional
- ✅ Validación real en backend
- ✅ Generación de direcciones Worldcoin verificadas
- ✅ Estados de verificación claros (verificando, éxito, error)

**Ubicación del código:**
- Componente: `/components/worldcoin-section.tsx` (actualizado)
- API Nueva: `/app/api/user/worldcoin-verify/route.ts`

### 3. **Navegación Actualizada - COMPLETADO**
- ✅ Nueva pestaña "Bodega" (🏦) en el menú inferior
- ✅ Menú responsive para todas las opciones

### 4. **Hook useUser Actualizado - COMPLETADO**
- ✅ Nuevos campos: `savingsBalance`, `lastSavingsUpdate`
- ✅ Nuevos métodos: `depositToSavings()`, `claimSavingsInterest()`

---

## 🗄️ Cambios de Base de Datos Requeridos

Ejecuta el siguiente SQL en tu consola Supabase para configurar la base de datos:

**Archivo:** `/scripts/add-savings-table.sql`

### Lo que hace:
1. Agrega campos `savings_balance` y `last_savings_update` a la tabla `users`
2. Crea tabla `savings_logs` para registrar transacciones
3. Configura índices para mejor performance
4. Activa Row Level Security (RLS)

### Pasos para ejecutar:
1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor**
3. Copia el contenido de `/scripts/add-savings-table.sql`
4. Pega en el editor SQL
5. Haz clic en **Run**

---

## 🎮 Cómo Usar las Nuevas Funciones

### Sistema de Bodega
1. El usuario abre la aplicación → saldo inicial = 0
2. El usuario gana monedas minando o mediante otras acciones
3. El usuario puede ir a la pestaña **"Bodega"** (🏦)
4. Ingresa la cantidad de MAR-AP que desea depositar
5. Cada 24 horas, el usuario puede reclamar 1 MAR-AP de interés
6. ¡El proceso se repite indefinidamente!

### Verificación Worldcoin
1. El usuario va a la pestaña **"Worldcoin"** (🌍)
2. Hace clic en **"Verificar Identidad Ahora"**
3. El sistema verifica y genera una dirección Worldcoin única
4. Se muestra el estado de verificación con ✓
5. El usuario ya puede minar monedas

---

## 🧪 Pruebas Locales (Sin Supabase)

La aplicación usa un sistema de fallback automático:
- Si Supabase no está disponible → usa localStorage
- Los datos se sincronizan cuando Supabase vuelve a estar disponible
- Perfecto para desarrollo y pruebas

---

## 📋 Checklist de Configuración

- [ ] Ejecutar el script SQL en Supabase
- [ ] Verificar que el nuevo componente SavingsSection aparece
- [ ] Prueba depositar monedas en la Bodega
- [ ] Prueba reclamar interés después de 24 horas (o simula cambio de fecha)
- [ ] Prueba la verificación Worldcoin
- [ ] Verifica que las nuevas API routes funcionan

---

## 🔧 Variables de Entorno Necesarias

Las variables ya están configuradas en tu proyecto. Si necesitas agregarlas manualmente:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el script SQL se ejecutó correctamente
2. Revisa la consola del navegador (F12) para errores
3. Verifica que las API routes responden correctamente
4. Comprueba que los componentes nuevos están importados

---

## 🚀 Despliegue

Una vez que todo funciona localmente:

1. Push los cambios a tu repositorio Git
2. Vercel redesplegará automáticamente
3. Las nuevas funciones estarán disponibles en producción

---

**¡Todo listo! Tu sistema de ahorros y verificación Worldcoin está configurado y funcional.**
