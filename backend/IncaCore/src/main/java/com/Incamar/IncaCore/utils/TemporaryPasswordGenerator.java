package com.Incamar.IncaCore.utils;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class TemporaryPasswordGenerator {

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%&?";

    private static final String ALL = UPPER + LOWER + DIGITS + SPECIAL;

    private static final SecureRandom random = new SecureRandom();

    public String generate(int length) {
        if (length < 8) {
            throw new IllegalArgumentException("La longitud mínima debe ser 8 para incluir todos los tipos de caracteres");
        }

        StringBuilder password = new StringBuilder(length);

        // Garantizar al menos un carácter de cada tipo
        password.append(randomChar(UPPER));
        password.append(randomChar(LOWER));
        password.append(randomChar(DIGITS));
        password.append(randomChar(SPECIAL));

        // Rellenar el resto con caracteres aleatorios
        for (int i = 4; i < length; i++) {
            password.append(randomChar(ALL));
        }

        // Mezclar para evitar posiciones predecibles
        return shuffleString(password.toString());
    }

    private char randomChar(String chars) {
        return chars.charAt(random.nextInt(chars.length()));
    }

    private String shuffleString(String input) {
        char[] characters = input.toCharArray();
        for (int i = characters.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);

            // Intercambiar posiciones i y j
            char temp = characters[i];
            characters[i] = characters[j];
            characters[j] = temp;
        }
        return new String(characters);
    }
}
