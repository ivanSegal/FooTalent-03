package com.Incamar.IncaCore.service.impl;


import com.Incamar.IncaCore.dto.request.UserSearchReq;
import com.Incamar.IncaCore.dto.response.UserSearchRes;
import com.Incamar.IncaCore.entity.User;
import com.Incamar.IncaCore.mapper.UserMapper;
import com.Incamar.IncaCore.repository.UserRepository;
import com.Incamar.IncaCore.service.UserService;
import com.Incamar.IncaCore.utils.UsernameGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UsernameGenerator usernameGenerator;

    @Override
    public Page<UserSearchRes> searchUsers(UserSearchReq params, Pageable pageable) {
         Page<User> users = userRepository.searchUsers(params.username(), params.email(),
                params.role(), params.accountStatus(), params.name(), pageable);

         return userMapper.toUserSearchRes(users);
    }
}
