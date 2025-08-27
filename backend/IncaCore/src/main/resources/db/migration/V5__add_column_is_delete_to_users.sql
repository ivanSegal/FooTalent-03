-- Añadir la columna is_deleted con valor por defecto false
ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

-- Opcional: asegurar que todos los registros existentes sean false
UPDATE users SET is_deleted = FALSE;