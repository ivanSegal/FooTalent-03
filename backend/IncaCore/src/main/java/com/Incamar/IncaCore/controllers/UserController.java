package com.Incamar.IncaCore.controllers;
import com.Incamar.IncaCore.models.AppUser;
import com.Incamar.IncaCore.services.IUserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/hola")
    public String TestController(){
        return "Hola Mundo";
    }

    @Autowired
    private IUserServices userServices;

    // GET: Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<AppUser>> getAllUsers() {
        return ResponseEntity.ok(userServices.getAllUsers());
    }

    // GET: Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable Long id) {
        AppUser user = userServices.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Crear un nuevo usuario
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody AppUser user) {
        userServices.createUser(
                user.getName(),
                user.getLastname(),
                user.getMail(),
                user.getPassword()
        );
        return ResponseEntity.ok("Usuario creado correctamente.");
    }

    // DELETE: Eliminar un usuario por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userServices.deleteUserById(id);
        return ResponseEntity.ok("Usuario eliminado correctamente.");
    }

    // PUT: Editar un usuario
    @PutMapping("/{id}")
    public ResponseEntity<AppUser> editUser(@PathVariable Long id, @RequestBody AppUser user) {
        AppUser updatedUser = userServices.editUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }
}
