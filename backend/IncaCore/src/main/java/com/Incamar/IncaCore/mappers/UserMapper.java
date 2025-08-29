package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.auth.RegisterReq;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.users.UpdateUserReq;
import com.Incamar.IncaCore.dtos.users.UserSearchRes;
import com.Incamar.IncaCore.enums.AccountStatus;
import com.Incamar.IncaCore.enums.Role;
import com.Incamar.IncaCore.models.User;
import org.mapstruct.*;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring", imports = {AccountStatus.class, Role.class})
public interface UserMapper {

    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "email", expression = "java(request.email() == null ? null : request.email().toLowerCase())")
    @Mapping(target = "accountStatus", expression = "java(AccountStatus.ACTIVE)")
    @Mapping(target = "department", expression = "java(request.role() == Role.ADMIN? null : request.department())")
    User toUser(RegisterReq request, String encodedPassword);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "firstName", source = "employee.firstName")
    @Mapping(target = "lastName", source = "employee.lastName")
    JwtDataDto toJwtDataDto(User user);

    @Mapping(target = "firstName", source = "employee.firstName")
    @Mapping(target = "lastName", source = "employee.lastName")
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "accountStatus", expression = "java(user.getAccountStatus().name())")
    UserSearchRes toUserSearchRes(User user);

    default Page<UserSearchRes> toUserSearchRes(Page<User> users) {
        return users.map(this::toUserSearchRes);
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "role", source = "dto.role")
    @Mapping(target = "department", source = "dto.department")
    @Mapping(target = "accountStatus", source = "dto.accountStatus")
    @Mapping(target = "employee.firstName", source = "dto.firstName")
    @Mapping(target = "employee.lastName", source = "dto.lastName")
    void updateUserFromDto(UpdateUserReq dto, @MappingTarget User user);
}
