package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.models.AppUser;
import com.Incamar.IncaCore.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserServices{
    @Autowired
    UserRepository userRepository;


    @Override
    public List<AppUser> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public AppUser getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void createUser(String name, String lastname, String mail, String password) {
        AppUser newUser = new AppUser();

        newUser.setName(name);
        newUser.setLastname(lastname);
        newUser.setMail(mail);
        newUser.setPassword(password);
        userRepository.save(newUser);
    }


    @Override
    public void deleteUserById(Long id) {
        if(userRepository.existsById(id)){
            userRepository.deleteById(id);
        }
    }

    @Override
    public AppUser editUser(Long id, AppUser u) {
        Optional<AppUser> optionalUser = userRepository.findById(id);
        if(optionalUser.isPresent()){
            AppUser auxUser = optionalUser.get();

           auxUser.setName((u.getName()));
           auxUser.setLastname(u.getLastname());
           auxUser.setMail(u.getMail());
           auxUser.setPassword(u.getPassword());

           return userRepository.save(auxUser);
        } else {
            return null;
        }

    }

}
