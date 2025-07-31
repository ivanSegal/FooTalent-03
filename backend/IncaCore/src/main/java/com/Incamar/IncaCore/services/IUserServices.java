package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.models.AppUser;

import java.util.List;

public interface IUserServices {

     List<AppUser> getAllUsers();

     AppUser getUserById(Long id);

     void createUser(String name, String lastname, String mail, String password);

     void deleteUserById(Long id);

     AppUser editUser(Long id,AppUser u);
}
