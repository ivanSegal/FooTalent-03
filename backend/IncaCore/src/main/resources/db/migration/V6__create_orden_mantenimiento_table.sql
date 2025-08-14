CREATE TABLE orden_mantenimiento (
    id BIGSERIAL PRIMARY KEY,
    embarcacion_id BIGINT NOT NULL,
    usuario_peticion_id UUID NOT NULL,
    tipo_mantenimiento VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'SOLICITADO',
    descripcion TEXT,
    fecha_mantenimiento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orden_embarcacion FOREIGN KEY (embarcacion_id)
    REFERENCES embarcaciones(id)ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_orden_usuario FOREIGN KEY (usuario_peticion_id)
    REFERENCES users(id)ON DELETE CASCADE ON UPDATE CASCADE
);