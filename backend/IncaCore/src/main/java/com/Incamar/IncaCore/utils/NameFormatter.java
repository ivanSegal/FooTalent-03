package com.Incamar.IncaCore.utils;

import java.util.Arrays;
import java.util.stream.Collectors;

public class NameFormatter {
    public static String capitalizeName(String name) {
        if (name == null || name.isBlank()) {
            return name;
        }

        return Arrays.stream(name.trim().split("\\s+"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

}
