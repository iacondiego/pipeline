-- Migración: Transformación a CRM Inmobiliario
-- Fecha: 2025-11-20
-- Descripción: Cambiar estimated_value a interes_propiedad y actualizar etapas

-- 1. Renombrar columna estimated_value a interes_propiedad
ALTER TABLE leads
RENAME COLUMN estimated_value TO interes_propiedad;

-- 2. Actualizar comentarios de la columna
COMMENT ON COLUMN leads.interes_propiedad IS 'Tipo de propiedad de interés del lead (casa, departamento, terreno, etc.)';

-- 3. Cambiar tipo de dato de numeric a text para almacenar tipo de propiedad
ALTER TABLE leads
ALTER COLUMN interes_propiedad TYPE TEXT;

-- 4. Actualizar datos existentes con valores de ejemplo inmobiliarios
UPDATE leads SET interes_propiedad =
  CASE
    WHEN interes_propiedad::numeric BETWEEN 0 AND 20000 THEN 'Departamento'
    WHEN interes_propiedad::numeric BETWEEN 20000 AND 40000 THEN 'Casa'
    WHEN interes_propiedad::numeric BETWEEN 40000 AND 60000 THEN 'Casa + Jardín'
    ELSE 'Terreno'
  END
WHERE interes_propiedad IS NOT NULL;

-- 5. Actualizar etapas existentes a nuevas etapas inmobiliarias
UPDATE leads SET stage =
  CASE stage
    WHEN 'Prospecto' THEN 'En atención por IA'
    WHEN 'Contactado' THEN 'En atención humana'
    WHEN 'Interesado' THEN 'Interesado en visitar'
    WHEN 'Propuesta enviada' THEN 'Esperando respuesta'
    ELSE stage
  END;

-- 6. Verificar resultado
SELECT
  phone,
  nombres,
  interes_propiedad,
  stage,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 10;
