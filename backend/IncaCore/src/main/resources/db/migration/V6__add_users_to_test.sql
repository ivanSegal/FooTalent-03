-- Crear usuarios de prueba para SUPERVISOR y OPERATOR en todos los departamentos
DO $$
DECLARE
new_user_id UUID;
BEGIN
    -- SUPERVISOR - INVENTORY
    new_user_id := gen_random_uuid();
INSERT INTO users (id, password, email, role, department, account_status, created_at, updated_at, is_deleted)
VALUES (
           new_user_id,
           '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS', -- P@ssw0rd!
           'supervisor.inventory@example.com',
           'SUPERVISOR',
           'INVENTORY',
           'ACTIVE',
           NOW(),
           NOW(),
           FALSE
       );
INSERT INTO employees (id, first_name, last_name, phone, address)
VALUES (new_user_id, 'Carlos', 'Inventario', '555111111', 'Bodega 1');

-- SUPERVISOR - MAINTENANCE
new_user_id := gen_random_uuid();
INSERT INTO users (id, password, email, role, department, account_status, created_at, updated_at, is_deleted)
VALUES (
           new_user_id,
           '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS',
           'supervisor.maintenance@example.com',
           'SUPERVISOR',
           'MAINTENANCE',
           'ACTIVE',
           NOW(),
           NOW(),
           FALSE
       );
INSERT INTO employees (id, first_name, last_name, phone, address)
VALUES (new_user_id, 'Luis', 'Mantenimiento', '555222222', 'Taller 1');

-- SUPERVISOR - VESSEL
new_user_id := gen_random_uuid();
INSERT INTO users (id, password, email, role, department, account_status, created_at, updated_at, is_deleted)
VALUES (
           new_user_id,
           '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS',
           'supervisor.vessel@example.com',
           'SUPERVISOR',
           'VESSEL',
           'ACTIVE',
           NOW(),
           NOW(),
           FALSE
       );
INSERT INTO employees (id, first_name, last_name, phone, address)
VALUES (new_user_id, 'Ana', 'Vessel', '555333333', 'Puerto 1');

-- OPERATOR - INVENTORY
new_user_id := gen_random_uuid();
INSERT INTO users (id, password, email, role, department, account_status, created_at, updated_at, is_deleted)
VALUES (
           new_user_id,
           '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS',
           'operator.inventory@example.com',
           'OPERATOR',
           'INVENTORY',
           'ACTIVE',
           NOW(),
           NOW(),
           FALSE
       );
INSERT INTO employees (id, first_name, last_name, phone, address)
VALUES (new_user_id, 'Marta', 'Operadora', '555444444', 'Bodega 2');

-- OPERATOR - MAINTENANCE
new_user_id := gen_random_uuid();
INSERT INTO users (id, password, email, role, department, account_status, created_at, updated_at, is_deleted)
VALUES (
           new_user_id,
           '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS',
           'operator.maintenance@example.com',
           'OPERATOR',
           'MAINTENANCE',
           'ACTIVE',
           NOW(),
           NOW(),
           FALSE
       );
INSERT INTO employees (id, first_name, last_name, phone, address)
VALUES (new_user_id, 'José', 'Operador', '555555555', 'Taller 2');

-- OPERATOR - VESSEL
new_user_id := gen_random_uuid();
INSERT INTO users (id, password, email, role, department, account_status, created_at, updated_at, is_deleted)
VALUES (
           new_user_id,
           '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS',
           'operator.vessel@example.com',
           'OPERATOR',
           'VESSEL',
           'ACTIVE',
           NOW(),
           NOW(),
           FALSE
       );
INSERT INTO employees (id, first_name, last_name, phone, address)
VALUES (new_user_id, 'Pedro', 'Marino', '555666666', 'Puerto 2');
END $$ LANGUAGE plpgsql;
