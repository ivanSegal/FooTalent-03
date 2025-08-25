CREATE TABLE employees (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    CONSTRAINT fk_employee_user FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
);