package com.Incamar.IncaCore.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
@Data
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String phone;

    private String address;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;


}
