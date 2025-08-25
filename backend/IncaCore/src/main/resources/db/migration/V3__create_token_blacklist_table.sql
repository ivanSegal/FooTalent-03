CREATE TABLE token_blacklist (
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    expiration_date TIMESTAMP NOT NULL
);