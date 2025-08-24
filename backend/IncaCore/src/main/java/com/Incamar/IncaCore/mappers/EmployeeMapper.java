package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.auth.RegisterReq;
import com.Incamar.IncaCore.models.Employee;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.utils.NameFormatter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = NameFormatter.class)
public interface EmployeeMapper {

    @Mapping(target = "firstName", expression = "java(NameFormatter.capitalizeName(request.firstName()))")
    @Mapping(target = "lastName", expression = "java(NameFormatter.capitalizeName(request.lastName()))")
    @Mapping(target = "user", source = "user")
    Employee toEmployee(RegisterReq request, User user);
}
