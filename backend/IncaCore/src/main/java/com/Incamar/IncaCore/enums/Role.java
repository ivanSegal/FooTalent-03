package com.Incamar.IncaCore.enums;

public enum Role {
    ADMIN("Administrador"),
    OPERATIONS_MANAGER("Encargado de Operaciones"),
    WAREHOUSE_STAFF("Personal de Almacén");

    private final String description;

    Role(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
