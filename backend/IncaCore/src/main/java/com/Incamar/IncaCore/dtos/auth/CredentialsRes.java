package com.Incamar.IncaCore.dtos.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Auth.Credentials",
description = "Manda una respuesta con las credednciales de un usuario")
public record CredentialsRes(
        String username,
        String password,
        String adminMessage
) {
}
