package com.Incamar.IncaCore.mapper;

import com.Incamar.IncaCore.dto.JwtDataDto;
import com.Incamar.IncaCore.dto.request.RegisterReq;
import com.Incamar.IncaCore.dto.response.UserSearchRes;
import com.Incamar.IncaCore.entity.User;
import com.Incamar.IncaCore.enums.AccountStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring", imports = {AccountStatus.class})
public interface UserMapper {

    @Mapping(target = "username", source = "username")
    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "email", expression = "java(request.email() == null ? null : request.email().toLowerCase())")
    @Mapping(target = "accountStatus", expression = "java(AccountStatus.ACTIVE)")
    @Mapping(target = "temporaryPassword", constant = "true")
    User toUser(RegisterReq request, String username, String encodedPassword);

    @Mapping(target = "id", source = "id")
    JwtDataDto toJwtDataDto(User user);

    @Mapping(target = "fullName", expression = "java(user.getEmployee() != null ? user.getEmployee().getFirstName() + \" \" + user.getEmployee().getLastName() : null)")
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "accountStatus", expression = "java(user.getAccountStatus().name())")
    UserSearchRes toUserSearchRes(User user);

    default Page<UserSearchRes> toUserSearchRes(Page<User> users) {
        return users.map(this::toUserSearchRes);
    }
}
