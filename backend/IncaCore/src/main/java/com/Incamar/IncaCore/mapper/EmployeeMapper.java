package com.Incamar.IncaCore.mapper;

import com.Incamar.IncaCore.dto.request.RegisterReq;
import com.Incamar.IncaCore.entity.Employee;
import com.Incamar.IncaCore.entity.User;
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
