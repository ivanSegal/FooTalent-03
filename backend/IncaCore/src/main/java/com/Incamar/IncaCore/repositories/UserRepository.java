package com.Incamar.IncaCore.repositories;


import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.enums.AccountStatus;
import com.Incamar.IncaCore.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

  Optional<User> findByUsername(String username);

  boolean existsByUsername(String username);

  @Query("""
    SELECT u FROM User u
    LEFT JOIN u.employee e
    WHERE
        (:username IS NULL OR :username = '' OR LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%'))) AND
        (:email IS NULL OR :email = '' OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND
        (:role IS NULL OR CAST(:role AS string) = '' OR u.role = :role) AND
        (:accountStatus IS NULL OR CAST(:accountStatus AS string) = '' OR u.accountStatus = :accountStatus) AND
        (:fullName IS NULL OR :fullName = '' OR LOWER(CONCAT(e.firstName, ' ', e.lastName)) LIKE LOWER(CONCAT('%', :fullName, '%')))
""")
  Page<User> searchUsers(
          @Param("username") String username,
          @Param("email") String email,
          @Param("role") Role role,
          @Param("accountStatus") AccountStatus accountStatus,
          @Param("fullName") String fullName,
          Pageable pageable
  );


}
