# 🔧 CONFIGURACIÓN PARA VERCEL

## 📋 Variables de Entorno Requeridas

Para que los emails funcionen correctamente en producción, necesitas configurar estas variables de entorno en Vercel:

### Variables SMTP (Requeridas)

1. **SMTP_HOST**
   - Host del servidor SMTP
   - Ejemplo: `smtp.gmail.com` o `mail.tudominio.com`

2. **SMTP_PORT**
   - Puerto del servidor SMTP
   - Ejemplo: `465` (SSL) o `587` (TLS)

3. **SMTP_USER**
   - Usuario/email del servidor SMTP
   - Ejemplo: `ventas@naturalonline.com.ar`

4. **SMTP_PASS**
   - Contraseña del servidor SMTP
   - ⚠️ **NUNCA compartir esta contraseña**

5. **SMTP_SECURE**
   - `true` para puerto 465 (SSL)
   - `false` para puerto 587 (TLS)
   - Ejemplo: `true`

### Cómo Configurar en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona el proyecto: `gruponaturaldesign-sigma`
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable:
   - Click en **Add New**
   - Ingresa el nombre (ej: `SMTP_HOST`)
   - Ingresa el valor
   - Selecciona los ambientes (Production, Preview, Development)
   - Click en **Save**
5. **IMPORTANTE**: Después de agregar las variables, necesitas hacer un nuevo deploy:
   - Ve a **Deployments**
   - Click en los 3 puntos del último deployment
   - Selecciona **Redeploy**

## 🔍 Verificar que Funcionan

### 1. Verificar Filtros del Navbar

Los filtros ahora se cargan desde:
1. API (Google Sheets) - Prioridad 1
2. localStorage - Prioridad 2 (fallback)

**Si no aparecen:**
- Verifica que la API de Google Sheets esté accesible
- Revisa la consola del navegador para errores
- Verifica que los productos se estén cargando correctamente

### 2. Verificar Emails

**Para probar el envío de emails:**

1. Completa un pedido de prueba en `/checkout`
2. Revisa los logs de Vercel:
   - Ve a **Deployments** → Último deployment → **Functions**
   - Busca `/api/send-order-email`
   - Revisa los logs para ver errores

**Errores comunes:**

- ❌ `Configuración de email no disponible`
  - → Falta alguna variable de entorno (SMTP_HOST, SMTP_USER, SMTP_PASS)
  
- ❌ `Error de conexión con el servidor de email`
  - → Verifica SMTP_HOST y SMTP_PORT
  - → Verifica que SMTP_SECURE sea correcto
  
- ❌ `Authentication failed`
  - → Verifica SMTP_USER y SMTP_PASS
  - → Algunos proveedores requieren "App Passwords" en lugar de contraseñas normales

## 📝 Checklist de Configuración

### Antes de Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] SMTP_HOST configurado
- [ ] SMTP_PORT configurado
- [ ] SMTP_USER configurado
- [ ] SMTP_PASS configurado
- [ ] SMTP_SECURE configurado (true/false)

### Después de Deploy

- [ ] Verificar que los filtros aparecen en `/shoponline`
- [ ] Probar envío de email desde `/checkout`
- [ ] Verificar que el email llega al cliente
- [ ] Verificar que el email interno llega a `rovalencia@naturalonline.com.ar`
- [ ] Revisar logs de Vercel si hay errores

## 🐛 Debugging

### Ver Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Click en **Deployments**
3. Selecciona el último deployment
4. Click en **Functions**
5. Busca `/api/send-order-email`
6. Revisa los logs para ver errores detallados

### Ver Logs en Consola del Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Busca errores relacionados con:
   - `useShopCategories`
   - `loadGroupedProductsFromAPI`
   - Categorías vacías

## ✅ Cambios Realizados

### 1. Hook `useShopCategories`
- ✅ Ahora usa React Query
- ✅ Carga desde API primero (Google Sheets)
- ✅ Fallback a localStorage
- ✅ Manejo de errores mejorado
- ✅ Reintentos automáticos

### 2. API de Emails
- ✅ Validación de variables de entorno
- ✅ Verificación SMTP antes de enviar
- ✅ Logging detallado de errores
- ✅ Manejo de errores mejorado

### 3. Navbar
- ✅ Loading state para categorías
- ✅ Manejo de errores mejorado

---

**URL de Producción:** https://gruponaturaldesign-sigma.vercel.app/

**Si los problemas persisten:**
1. Verifica las variables de entorno en Vercel
2. Revisa los logs de Vercel
3. Prueba hacer un nuevo deploy después de configurar las variables

