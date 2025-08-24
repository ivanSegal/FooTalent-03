package com.Incamar.IncaCore.security;

import com.Incamar.IncaCore.enums.AccountStatus;
import com.Incamar.IncaCore.enums.Department;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.models.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CustomUserDetails implements UserDetails {
    private final User user;
    private final UUID id;
    private final String username;
    private final String password;
    private final Role role;
    private final Department department;
    private final AccountStatus accountStatus;

    public CustomUserDetails(User user) {
        this.user = user;
        this.id = user.getId();
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
        this.department =  user.getDepartment();
        this.accountStatus = user.getAccountStatus();
    }

    public UUID getId() { return id; }
    public Department getDepartment(){return department;}
    public Role getRole(){return role;}
    public User getUser() {return user;}

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }


    @Override public String getUsername() { return username; }
    @Override public String getPassword() { return password; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return accountStatus != AccountStatus.BLOCKED; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return accountStatus == AccountStatus.ACTIVE; }
}
