CREATE TABLE embarcaciones (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    n_patente VARCHAR(255) NOT NULL,
    capitan VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL
);