package com.Incamar.IncaCore.utils;

import org.springframework.stereotype.Component;

import java.text.Normalizer;

@Component
public class UsernameGenerator {

    public String generate(String firstName, String lastName) {
        // Normalizamos y limpiamos nombres y apellidos
        String[] nombres = firstName.trim().split("\\s+");
        String[] apellidos = lastName.trim().split("\\s+");

        char firstInitial = normalizeAndClean(nombres[0]).charAt(0);

        String firstSurname = normalizeAndClean(apellidos[0]);

        String suffixNumber = "01";

        return firstInitial + firstSurname + suffixNumber;
    }

    private String normalizeAndClean(String input) {
        String normalized = Normalizer.normalize(input.trim(), Normalizer.Form.NFD);
        String clean = normalized.replaceAll("\\p{M}", "");
        clean = clean.toLowerCase();
        clean = clean.replaceAll("[^a-z]", "");
        return clean;
    }

}
