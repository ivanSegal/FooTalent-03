package com.Incamar.IncaCore.enums;

// This enum is currently empty, but it can be used to define various user roles in the future.
public enum Role {
  ADMIN("Administrador (Dueño del negocio)"),
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
