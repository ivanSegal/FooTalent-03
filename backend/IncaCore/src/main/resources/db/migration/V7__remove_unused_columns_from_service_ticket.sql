-- Eliminar columnas obsoletas de service_ticket
ALTER TABLE service_ticket
DROP COLUMN IF EXISTS code,
DROP COLUMN IF EXISTS checking_nro;
