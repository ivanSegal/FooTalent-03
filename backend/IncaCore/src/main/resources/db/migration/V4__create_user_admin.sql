-- Definir el UUID antes de insertarlo
DO $$
DECLARE
new_user_id UUID := gen_random_uuid();
BEGIN
    -- Insertar en users
INSERT INTO users (id,password,email,role,account_status,created_at,updated_at)
VALUES (
           new_user_id,
           '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS', -- P@ssw0rd!
           'juan.perez@example.com',
           'ADMIN',
           'ACTIVE',
           NOW(),
           NOW()
       );

-- Insertar en employees con el mismo id
INSERT INTO employees (id,first_name,last_name,phone,address)
VALUES (
           new_user_id,
           'Juan',
           'Pérez',
           '555123456',
           'Calle Falsa 123'
       );
END $$;