package com.Incamar.IncaCore.controllers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/")
public class UserController {

    @GetMapping("/hola")
    public String TestController(){
        return "Hola Mundo";
    }
}
