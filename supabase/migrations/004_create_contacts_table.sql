-- Migración: Crear tabla de Contactos
-- Fecha: 2025-11-20
-- Descripción: Crear tabla contacts y relación con leads (oportunidades)

-- 1. Crear tabla contacts
CREATE TABLE IF NOT EXISTS contacts (
  phone VARCHAR(20) PRIMARY KEY,
  nombres VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  empresa VARCHAR(255),
  cargo VARCHAR(255),
  notas TEXT,
  tags TEXT[], -- Array de tags para categorizar contactos
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Agregar comentarios a las columnas
COMMENT ON TABLE contacts IS 'Tabla de contactos del CRM';
COMMENT ON COLUMN contacts.phone IS 'Número de teléfono (clave primaria)';
COMMENT ON COLUMN contacts.nombres IS 'Nombre completo del contacto';
COMMENT ON COLUMN contacts.email IS 'Correo electrónico del contacto';
COMMENT ON COLUMN contacts.empresa IS 'Empresa donde trabaja el contacto';
COMMENT ON COLUMN contacts.cargo IS 'Cargo o posición del contacto';
COMMENT ON COLUMN contacts.notas IS 'Notas adicionales sobre el contacto';
COMMENT ON COLUMN contacts.tags IS 'Etiquetas para categorizar el contacto (ej: VIP, Recurrente, etc.)';

-- 3. Modificar tabla leads para agregar relación con contacts
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20) REFERENCES contacts(phone) ON DELETE SET NULL;

COMMENT ON COLUMN leads.contact_phone IS 'Referencia al contacto asociado con esta oportunidad';

-- 4. Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_contacts_nombres ON contacts USING gin (to_tsvector('spanish', nombres));
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_empresa ON contacts(empresa);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_leads_contact_phone ON leads(contact_phone);

-- 5. Crear trigger para actualizar updated_at en contacts
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contacts_timestamp
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_contacts_updated_at();

-- 6. Migrar datos existentes de leads a contacts
INSERT INTO contacts (phone, nombres, created_at, updated_at)
SELECT DISTINCT phone, nombres, created_at, updated_at
FROM leads
WHERE phone NOT IN (SELECT phone FROM contacts)
ON CONFLICT (phone) DO NOTHING;

-- 7. Actualizar leads para vincular con contacts
UPDATE leads
SET contact_phone = phone
WHERE contact_phone IS NULL;

-- 8. Habilitar RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 9. Crear política para permitir acceso público (ajustar según necesidades)
CREATE POLICY "Enable read access for all users" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON contacts
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON contacts
  FOR DELETE USING (true);

-- 10. Verificar resultado
SELECT
  c.phone,
  c.nombres,
  c.email,
  c.empresa,
  COUNT(l.phone) as total_oportunidades
FROM contacts c
LEFT JOIN leads l ON l.contact_phone = c.phone
GROUP BY c.phone, c.nombres, c.email, c.empresa
ORDER BY c.created_at DESC
LIMIT 10;
