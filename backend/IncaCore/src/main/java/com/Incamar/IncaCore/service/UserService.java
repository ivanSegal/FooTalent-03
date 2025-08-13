package com.Incamar.IncaCore.service;

import com.Incamar.IncaCore.dto.request.UserSearchReq;
import com.Incamar.IncaCore.dto.response.UserSearchRes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserSearchRes> searchUsers(UserSearchReq params, Pageable pageable);

}
