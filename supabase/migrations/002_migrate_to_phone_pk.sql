-- ============================================
-- MIGRACIÓN: Cambiar ID a PHONE como Primary Key
-- ============================================
-- Esta migración convierte la tabla leads para usar
-- phone como identificador único en lugar de id
--
-- IMPORTANTE: Ejecutar en Supabase SQL Editor
-- ============================================

-- Paso 1: Crear nueva tabla con phone como PK
CREATE TABLE IF NOT EXISTS leads_new (
  phone VARCHAR(20) PRIMARY KEY,
  nombres VARCHAR(255) NOT NULL,
  estimated_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stage VARCHAR(50) NOT NULL DEFAULT 'Prospecto',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 2: Migrar datos existentes (si los hay)
-- Si la tabla antigua tiene datos, intenta migrarlos
-- Nota: Los leads sin número de teléfono se omitirán
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'leads'
  ) THEN
    -- Intentar migrar datos existentes
    -- Como no hay columna phone en la tabla vieja, creamos números dummy
    INSERT INTO leads_new (phone, nombres, estimated_value, stage, created_at, updated_at)
    SELECT
      '+569' || LPAD(id::text, 8, '0') as phone,  -- Generar teléfono dummy basado en id
      name as nombres,
      estimated_value,
      stage,
      created_at,
      updated_at
    FROM leads
    ON CONFLICT (phone) DO NOTHING;
  END IF;
END $$;

-- Paso 3: Eliminar tabla antigua
DROP TABLE IF EXISTS leads CASCADE;

-- Paso 4: Renombrar nueva tabla
ALTER TABLE leads_new RENAME TO leads;

-- Paso 5: Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- Paso 6: Habilitar Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Paso 7: Crear policy para permitir todas las operaciones (desarrollo)
DROP POLICY IF EXISTS "Allow all operations on leads" ON leads;
CREATE POLICY "Allow all operations on leads" ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Paso 8: Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Paso 9: Crear trigger para updated_at
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Paso 10: Insertar datos de ejemplo (con teléfonos reales)
-- Primero eliminar todos los datos para evitar duplicados
TRUNCATE TABLE leads;

-- Insertar datos de ejemplo frescos
INSERT INTO leads (phone, nombres, estimated_value, stage) VALUES
  ('+56912345678', 'Carlos Martínez', 15000, 'Prospecto'),
  ('+56987654321', 'María González', 25000, 'Prospecto'),
  ('+56923456789', 'Juan Rodríguez', 50000, 'Contactado'),
  ('+56945678901', 'Ana López', 8000, 'Contactado'),
  ('+56934567890', 'Pedro García', 20000, 'Interesado'),
  ('+56956789012', 'Laura Fernández', 12000, 'Interesado'),
  ('+56967890123', 'Diego Sánchez', 30000, 'Propuesta enviada'),
  ('+56978901234', 'Sofía Ramírez', 40000, 'Propuesta enviada');

-- ============================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- ============================================
-- Ejecuta estas queries para verificar:

-- Ver estructura de la tabla
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'leads'
-- ORDER BY ordinal_position;

-- Ver datos
-- SELECT * FROM leads ORDER BY created_at DESC;

-- Contar registros
-- SELECT COUNT(*) as total FROM leads;

-- Distribución por etapa
-- SELECT stage, COUNT(*) as count FROM leads GROUP BY stage;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Esta migración es DESTRUCTIVA (elimina la tabla antigua)
-- 2. Los datos se migran pero con teléfonos dummy basados en id
-- 3. Luego se reemplazan con datos de ejemplo frescos
-- 4. Si tienes datos importantes, haz BACKUP primero
-- 5. Después de ejecutar, ve a Database > Replication y activa "leads"
-- ============================================
