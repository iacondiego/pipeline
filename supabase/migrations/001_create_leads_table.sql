-- Drop existing table if it exists (to start fresh with new schema)
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table with phone as primary key
CREATE TABLE IF NOT EXISTS leads (
  phone VARCHAR(20) PRIMARY KEY,
  nombres VARCHAR(255) NOT NULL,
  estimated_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stage VARCHAR(50) NOT NULL DEFAULT 'Prospecto',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by stage
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);

-- Create index for created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Create index for phone lookups
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
-- TODO: Restrict this in production based on authentication
CREATE POLICY "Allow all operations on leads" ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing with phone numbers
INSERT INTO leads (phone, nombres, estimated_value, stage) VALUES
  ('+56912345678', 'Carlos Martínez', 15000, 'Prospecto'),
  ('+56987654321', 'María González', 25000, 'Prospecto'),
  ('+56923456789', 'Juan Rodríguez', 50000, 'Contactado'),
  ('+56945678901', 'Ana López', 8000, 'Contactado'),
  ('+56934567890', 'Pedro García', 20000, 'Interesado'),
  ('+56956789012', 'Laura Fernández', 12000, 'Interesado'),
  ('+56967890123', 'Diego Sánchez', 30000, 'Propuesta enviada'),
  ('+56978901234', 'Sofía Ramírez', 40000, 'Propuesta enviada');
