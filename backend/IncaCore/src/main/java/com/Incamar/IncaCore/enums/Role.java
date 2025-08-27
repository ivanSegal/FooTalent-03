package com.Incamar.IncaCore.enums;

// This enum is currently empty, but it can be used to define various user roles in the future.
public enum Role {
  ADMIN("Administrador"),
  SUPERVISOR("Encargado"),
  OPERATOR("Personal");

  private final String description;

  Role(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
