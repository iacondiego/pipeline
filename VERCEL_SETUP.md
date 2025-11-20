# 🚀 Vercel Deployment Guide

## ⚠️ Error: "Error al cargar leads"

Si ves este error en tu deployment de Vercel, sigue estos pasos:

---

## 🔧 Paso 1: Configurar Variables de Entorno en Vercel

### Opción A: Desde el Dashboard de Vercel

1. **Ve a tu proyecto en Vercel**:
   - https://vercel.com/dashboard
   - Selecciona tu proyecto "pipeline"

2. **Settings → Environment Variables**

3. **Agregar las siguientes variables**:

   **Variable 1:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://klrbkivooyllxzigztwp.supabase.co
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 2:**
   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [TU_SUPABASE_ANON_KEY_AQUI]
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   > 📝 **¿Dónde encuentro mi Anon Key?**
   > - Ve a: https://app.supabase.com/project/klrbkivooyllxzigztwp/settings/api
   > - Copia el valor de "anon / public"

4. **Guardar cambios** → Click "Save"

5. **Redeploy**:
   - Ve a "Deployments"
   - Click en los 3 puntos del último deployment
   - Click "Redeploy"

### Opción B: Desde la CLI de Vercel

```bash
cd "C:\Users\diieg\OneDrive\Escritorio\Proyectos cursor\Pipeline vibe"

# Agregar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Pega: https://klrbkivooyllxzigztwp.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Pega: tu_anon_key_aqui

# Redeploy
vercel --prod
```

---

## 🗄️ Paso 2: Verificar Configuración de Supabase

### 2.1 Verificar que la tabla existe

1. **Ve a Supabase Dashboard**:
   - https://app.supabase.com/project/klrbkivooyllxzigztwp/editor

2. **Table Editor → leads**:
   - ✅ Debe existir la tabla `leads`
   - ✅ Debe tener al menos 8 registros de ejemplo
   - ✅ Columnas: `phone`, `nombres`, `estimated_value`, `stage`, `created_at`, `updated_at`

### 2.2 Verificar RLS (Row Level Security)

1. **Ve a Database → Tables → leads**

2. **Verifica RLS Policies**:
   - Click en "RLS Policies"
   - Debe existir una policy: "Allow all operations on leads"
   - Si NO existe, crea una:

   ```sql
   -- Ir a SQL Editor y ejecutar:
   ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Allow all operations on leads" ON leads
     FOR ALL
     USING (true)
     WITH CHECK (true);
   ```

3. **Verificar Real-time**:
   - Ve a Database → Replication
   - Busca tabla `leads`
   - Activa el switch ✅

---

## 🧪 Paso 3: Verificar en Local

Antes de redeploy, verifica que funciona localmente:

```bash
cd "C:\Users\diieg\OneDrive\Escritorio\Proyectos cursor\Pipeline vibe"

# 1. Asegúrate que .env.local existe
cat .env.local

# Debe contener:
# NEXT_PUBLIC_SUPABASE_URL=https://klrbkivooyllxzigztwp.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# 2. Probar conexión a Supabase
npm run test:supabase

# Resultado esperado:
# ✓ Tabla "leads" existe y es accesible
# ✓ Columnas encontradas: phone, nombres, estimated_value, stage, created_at, updated_at
# ✓ Total de leads: 8

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir http://localhost:3000/pipeline
# Debe mostrar los 8 leads sin errores
```

---

## 📊 Paso 4: Verificar Logs en Vercel

Si el error persiste:

1. **Ve a tu deployment en Vercel**

2. **Click en "View Function Logs"**

3. **Busca errores relacionados con**:
   - `Missing Supabase environment variables`
   - `Failed to fetch`
   - `CORS error`
   - `Authentication error`

4. **Logs útiles**:
   ```
   ❌ Missing Supabase environment variables!
   → Configura las env vars en Vercel

   ❌ Error fetching leads: {...}
   → Revisa RLS policies en Supabase

   ✅ 🔌 Setting up real-time subscription...
   → Todo OK, suscripción activa
   ```

---

## 🚨 Troubleshooting Común

### Error: "Missing Supabase environment variables"

**Causa:** Variables de entorno no configuradas en Vercel

**Solución:**
- Sigue el Paso 1 de esta guía
- Asegúrate de seleccionar **Production**, **Preview** y **Development**
- Redeploy después de guardar

### Error: "Failed to fetch" o "Network error"

**Causa:** RLS bloqueando acceso o tabla no existe

**Solución:**
1. Ve a Supabase → Database → Table Editor
2. Verifica que `leads` existe
3. Ve a Database → Tables → leads → RLS Policies
4. Crea policy "Allow all operations" si no existe

### Error: "CORS policy"

**Causa:** Vercel domain no está en CORS allowed origins

**Solución:**
- En Supabase → Settings → API
- Scroll a "CORS Configuration"
- Agrega tu dominio de Vercel: `https://tu-proyecto.vercel.app`

### Leads vacíos (sin error)

**Causa:** Tabla existe pero no tiene datos

**Solución:**
```sql
-- Ir a SQL Editor en Supabase y ejecutar:
INSERT INTO leads (phone, nombres, estimated_value, stage) VALUES
  ('+56912345678', 'Carlos Martínez', 15000, 'Prospecto'),
  ('+56987654321', 'María González', 25000, 'Prospecto'),
  ('+56923456789', 'Juan Rodríguez', 50000, 'Contactado'),
  ('+56945678901', 'Ana López', 8000, 'Contactado'),
  ('+56934567890', 'Pedro García', 20000, 'Interesado'),
  ('+56956789012', 'Laura Fernández', 12000, 'Interesado'),
  ('+56967890123', 'Diego Sánchez', 30000, 'Propuesta enviada'),
  ('+56978901234', 'Sofía Ramírez', 40000, 'Propuesta enviada');
```

---

## ✅ Checklist Post-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] Tabla `leads` existe en Supabase
- [ ] RLS policy configurada correctamente
- [ ] Real-time habilitado en Supabase
- [ ] 8 registros de ejemplo presentes
- [ ] Redeploy ejecutado después de cambios
- [ ] Logs de Vercel sin errores
- [ ] Aplicación carga sin error en producción
- [ ] Drag & Drop funciona en producción

---

## 📞 Soporte Adicional

Si el error persiste después de seguir todos los pasos:

1. **Copia el mensaje de error completo** de la consola (F12)
2. **Verifica los logs de Vercel**
3. **Revisa el SQL Editor en Supabase**:
   ```sql
   -- Ejecutar para verificar datos:
   SELECT * FROM leads LIMIT 5;
   ```

---

## 🎉 Deploy Exitoso

Una vez configurado correctamente, tu app en Vercel debería:

- ✅ Cargar el pipeline Kanban con 8 leads
- ✅ Permitir drag & drop entre columnas
- ✅ Sincronizar cambios en tiempo real
- ✅ Mostrar dashboard con métricas
- ✅ No mostrar errores en consola

**URL de producción:** https://tu-proyecto.vercel.app

---

*Última actualización: 2025-11-20*
