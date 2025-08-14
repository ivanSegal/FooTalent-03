package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import com.Incamar.IncaCore.dtos.auth.RegisterReq;
import com.Incamar.IncaCore.dtos.users.UpdateUserReq;
import com.Incamar.IncaCore.dtos.users.UserSearchRes;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.enums.AccountStatus;
import org.mapstruct.*;
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

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "email", source = "dto.email")
    @Mapping(target = "role", source = "dto.role")
    @Mapping(target = "accountStatus", source = "dto.accountStatus")
    void updateUserFromDto(UpdateUserReq dto, @MappingTarget User user);
}
