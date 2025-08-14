package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.user.UpdateUserReq;
import com.Incamar.IncaCore.dtos.user.UserSearchReq;
import com.Incamar.IncaCore.dtos.user.UserSearchRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {

    Page<UserSearchRes> searchUsers(UserSearchReq params, Pageable pageable);

    UserSearchRes findById(UUID id);

    void updateById(UUID id, UpdateUserReq request);
}
