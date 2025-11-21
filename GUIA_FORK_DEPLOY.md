# 🚀 Guía: Fork + Deploy Individual por Cliente

Esta guía te permite desplegar el proyecto para **múltiples clientes** de forma independiente. Cada cliente tendrá su propia instancia en Vercel con su propia base de datos Supabase.

---

## 📋 Requisitos Previos

- Cuenta en GitHub
- Cuenta en Vercel (conectada a GitHub)
- Cuenta en Supabase
- Git instalado localmente

---

## 🎯 Proceso por Cliente (30-45 minutos por cliente)

### PASO 1: Crear Base de Datos Supabase para el Cliente

1. Ve a [supabase.com](https://supabase.com) y haz clic en **"New Project"**

2. Configura el proyecto:
   ```
   Nombre: pipeline-[nombre-cliente]
   Database Password: [genera una segura]
   Region: [la más cercana al cliente]
   ```

3. Espera 2-3 minutos a que se cree el proyecto

4. Ve a **Settings → API** y copia:
   - `Project URL` (ejemplo: `https://abcdefgh.supabase.co`)
   - `anon public` key (ejemplo: `eyJhbGciOi...`)

5. Ve a **SQL Editor** y ejecuta las siguientes migraciones **en orden**:

   **a) Crear tabla `leads`:**
   ```sql
   -- Create leads table
   CREATE TABLE IF NOT EXISTS leads (
     phone VARCHAR(20) PRIMARY KEY,
     nombres VARCHAR(255) NOT NULL,
     interes_propiedad VARCHAR(255) NOT NULL,
     stage VARCHAR(50) NOT NULL DEFAULT 'Prospecto',
     contact_phone VARCHAR(20),
     notes TEXT,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
   CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

   -- Trigger for updated_at
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

   -- Enable RLS
   ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous access (for development)
   CREATE POLICY "Allow anonymous access" ON leads
   FOR ALL USING (true);
   ```

   **b) Crear tabla `contacts`:**
   ```sql
   -- Create contacts table
   CREATE TABLE IF NOT EXISTS contacts (
     phone VARCHAR(20) PRIMARY KEY,
     nombres VARCHAR(255) NOT NULL,
     email VARCHAR(255),
     ciudad VARCHAR(100),
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX IF NOT EXISTS idx_contacts_nombres ON contacts(nombres);
   CREATE INDEX IF NOT EXISTS idx_contacts_ciudad ON contacts(ciudad);

   -- Trigger for updated_at
   CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

   -- Enable RLS
   ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous access
   CREATE POLICY "Allow anonymous access" ON contacts
   FOR ALL USING (true);
   ```

   **c) Crear tabla `properties`:**
   ```sql
   -- Create properties table
   CREATE TABLE IF NOT EXISTS properties (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     numero INTEGER,
     agente VARCHAR(255) NOT NULL,
     telefono VARCHAR(20),
     property_id VARCHAR(100),
     estado VARCHAR(50) NOT NULL,
     propiedad VARCHAR(255),
     titulo_publicacion TEXT,
     direccion_publicacion TEXT,
     operacion VARCHAR(50),
     tipo VARCHAR(100),
     barrio VARCHAR(100),
     ambientes INTEGER,
     dormitorios INTEGER,
     banios INTEGER,
     cocheras INTEGER,
     superficie_total DECIMAL(10,2),
     superficie_cubierta DECIMAL(10,2),
     valor_lista DECIMAL(15,2),
     moneda VARCHAR(10),
     expensas DECIMAL(10,2),
     valor_original DECIMAL(15,2),
     observaciones TEXT,
     amenities TEXT,
     url_publicacion TEXT,
     link_sheet TEXT,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX IF NOT EXISTS idx_properties_estado ON properties(estado);
   CREATE INDEX IF NOT EXISTS idx_properties_tipo ON properties(tipo);
   CREATE INDEX IF NOT EXISTS idx_properties_barrio ON properties(barrio);
   CREATE INDEX IF NOT EXISTS idx_properties_operacion ON properties(operacion);

   -- Trigger for updated_at
   CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

   -- Enable RLS
   ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

   -- Allow anonymous access
   CREATE POLICY "Allow anonymous access" ON properties
   FOR ALL USING (true);
   ```

6. Ve a **Database → Replication** y activa las 3 tablas:
   - ✅ `leads`
   - ✅ `contacts`
   - ✅ `properties`

7. **(Opcional)** Importa datos de prueba si tienes CSVs

---

### PASO 2: Fork el Repositorio para el Cliente

#### Opción A: Fork desde GitHub UI (Recomendado para no-técnicos)

1. Ve al repositorio original: `https://github.com/iacondiego/pipeline`

2. Haz clic en **Fork** (arriba a la derecha)

3. Configura el fork:
   ```
   Repository name: pipeline-[nombre-cliente]
   Description: Pipeline Setterless - [Nombre Cliente]
   ✅ Copy the master branch only
   ```

4. Clic en **Create fork**

#### Opción B: Clonar y crear nuevo repo (Recomendado para técnicos)

```bash
# 1. Clonar el repositorio original
git clone https://github.com/iacondiego/pipeline.git pipeline-[nombre-cliente]
cd pipeline-[nombre-cliente]

# 2. Remover el remote original
git remote remove origin

# 3. Crear nuevo repositorio en GitHub (desde la web)
# https://github.com/new
# Nombre: pipeline-[nombre-cliente]

# 4. Agregar el nuevo remote
git remote add origin https://github.com/TU_USUARIO/pipeline-[nombre-cliente].git

# 5. Push al nuevo repositorio
git push -u origin master
```

---

### PASO 3: Deploy en Vercel

1. Ve a [vercel.com](https://vercel.com) y haz clic en **"Add New Project"**

2. **Import Git Repository:**
   - Selecciona el repositorio fork: `pipeline-[nombre-cliente]`
   - Clic en **Import**

3. **Configure Project:**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build (default)
   Output Directory: .next (default)
   Install Command: npm install (default)
   ```

4. **Environment Variables** - Agrega estas 2 variables:
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: [La URL de Supabase del PASO 1]

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [La anon key de Supabase del PASO 1]
   ```

5. Clic en **Deploy**

6. Espera 2-3 minutos al deploy

7. ¡Listo! Tu app estará en: `https://pipeline-[nombre-cliente].vercel.app`

---

### PASO 4: Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve al proyecto → **Settings → Domains**

2. Agrega el dominio del cliente:
   ```
   [nombre-cliente].tudominio.com
   o
   app.dominiodelcliente.com
   ```

3. Configura el DNS según las instrucciones de Vercel:
   - Tipo: `CNAME`
   - Nombre: `[nombre-cliente]` o `app`
   - Valor: `cname.vercel-dns.com`

4. Espera 5-10 minutos a que propague

---

## 📝 Checklist de Verificación Post-Deploy

Verifica que todo funcione correctamente:

- [ ] ✅ La app carga en el dominio de Vercel
- [ ] ✅ Dashboard muestra "0 leads" (sin error)
- [ ] ✅ Pipeline muestra las 7 columnas vacías
- [ ] ✅ Contactos carga sin error
- [ ] ✅ Propiedades carga sin error
- [ ] ✅ Navegación funciona entre secciones
- [ ] ✅ Puedes crear un lead de prueba en Supabase y aparece en tiempo real
- [ ] ✅ Drag & drop funciona en Pipeline
- [ ] ✅ Notas se pueden agregar y editar en leads

---

## 🔄 Actualizaciones Futuras

Cuando necesites actualizar el código para un cliente:

### Método 1: Sync Fork (GitHub UI)

1. Ve al repositorio fork del cliente en GitHub
2. Clic en **Sync fork** → **Update branch**
3. Vercel auto-deployrá automáticamente

### Método 2: Git Pull (Local)

```bash
# 1. Ir al directorio del cliente
cd pipeline-[nombre-cliente]

# 2. Agregar el repo original como upstream (solo primera vez)
git remote add upstream https://github.com/iacondiego/pipeline.git

# 3. Fetch cambios del original
git fetch upstream

# 4. Merge cambios
git merge upstream/master

# 5. Push al fork del cliente
git push origin master
```

### Método 3: Manual Download + Replace

1. Descarga el código actualizado del repo original
2. Reemplaza archivos (excepto `.env.local` si existe)
3. Commit y push:
   ```bash
   git add .
   git commit -m "update: sincronizar con versión latest"
   git push origin master
   ```

---

## 🎨 Personalizaciones por Cliente

Si un cliente necesita customización (colores, logo, etc.):

### Colores (Tailwind CSS)

Edita `tailwind.config.ts`:

```typescript
// Cliente A: Azul eléctrico (default)
'electric-500': '#00a0ff'

// Cliente B: Verde corporativo
'electric-500': '#10b981'

// Cliente C: Naranja vibrante
'electric-500': '#f97316'
```

### Logo y Branding

1. Reemplaza archivos en `public/`:
   ```
   public/logo.png
   public/favicon.ico
   ```

2. Actualiza `src/shared/components/Navigation.tsx` si es necesario

### Textos y Etiquetas

Busca y reemplaza en los archivos:
- "Setterless" → "Nombre del Cliente"
- Títulos personalizados
- Mensajes de onboarding

---

## 💰 Costos Estimados

Por cliente (mensual):

| Servicio | Plan | Costo |
|----------|------|-------|
| Vercel | Hobby (1 proyecto) | $0 |
| Vercel | Pro (proyectos ilimitados) | $20 |
| Supabase | Free (hasta 500MB DB) | $0 |
| Supabase | Pro (8GB DB + priority support) | $25 |
| **Total Free** | | **$0/mes** |
| **Total Pro** | | **$45/mes** |

**Recomendación:**
- 1-3 clientes: Todo en planes Free
- 4-10 clientes: Vercel Pro + Supabase Free
- 10+ clientes: Considera multi-tenant (Opción 1)

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solución:**
1. Ve a Vercel → Proyecto → Settings → Environment Variables
2. Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas
3. Redeploy: Deployments → ⋯ → Redeploy

### Error: "Could not fetch leads from Supabase"

**Solución:**
1. Ve a Supabase → Database → Replication
2. Activa la tabla `leads` ✅
3. Ve a SQL Editor y ejecuta:
   ```sql
   SELECT * FROM leads; -- Debe ejecutarse sin error
   ```
4. Verifica RLS policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'leads';
   ```

### Error: Build falla en Vercel

**Solución:**
1. Revisa los logs de build en Vercel
2. Ejecuta localmente:
   ```bash
   npm run build
   npm run typecheck
   npm run lint
   ```
3. Corrige errores y push nuevamente

### Drag & Drop no funciona

**Solución:**
- Verifica que estés en navegador moderno (Chrome, Firefox, Edge)
- Desactiva extensiones que bloqueen JavaScript
- Prueba en ventana incógnita

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs:**
   - Vercel: Deployments → Ver logs
   - Browser: F12 → Console
   - Supabase: Dashboard → Logs

2. **Documentación:**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Vercel Docs](https://vercel.com/docs)

3. **GitHub Issues:**
   - Reporta bugs en el repositorio original

---

## ✅ Resumen Rápido

**Por cada nuevo cliente:**

1. ✅ Crear proyecto Supabase → Copiar URL + Key
2. ✅ Ejecutar 3 migraciones SQL (leads, contacts, properties)
3. ✅ Activar Replication en las 3 tablas
4. ✅ Fork repositorio en GitHub
5. ✅ Deploy en Vercel con las 2 variables de entorno
6. ✅ Verificar que todo funcione
7. ✅ (Opcional) Configurar dominio personalizado

**Tiempo estimado:** 30-45 minutos por cliente

---

**¡Éxito en tus deploys! 🚀**
