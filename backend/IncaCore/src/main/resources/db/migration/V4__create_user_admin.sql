INSERT INTO users (id,username,password,email,role,is_temporary_password,account_status,created_at,updated_at)
VALUES (
    gen_random_uuid(),
    'jperez01',
    '$2a$10$bNTIJoN929SFN5/yYzpsjuGCZt2MYSRQrdWGjpGao2Px5VH0QE2rS', -- P@ssw0rd!
    'testuser@example.com',
    'ADMIN',
    FALSE,
    'ACTIVE',
    NOW(),
    NOW()
);

INSERT INTO employees (id,first_name,last_name,phone,address)
VALUES (
     (SELECT id FROM users WHERE username = 'jperez01'),
     'Juan',
     'Pérez',
     '555123456',
     'Calle Falsa 123'
);