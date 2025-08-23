package com.Incamar.IncaCore.mappers;

import com.Incamar.IncaCore.dtos.users.UpdateUserReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemRes;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemUpdateReq;
import com.Incamar.IncaCore.models.User;
import com.Incamar.IncaCore.models.VesselItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring")
public interface VesselItemMapper {

     VesselItemRes toVesselItemRes(VesselItem vesselItem);


     default Page<VesselItemRes> toVesselItemRes(Page<VesselItem> vesselItems) {
          return vesselItems.map(this::toVesselItemRes);
     }


     @Mapping(target = "vessel", ignore = true)
     @Mapping(target = "component", ignore = true)
     @Mapping(target = "subcomponents", ignore = true)
     @Mapping(target = "id", ignore = true)
     VesselItem toVesselItem(VesselItemReq request);


     void update(VesselItemUpdateReq request, @MappingTarget VesselItem entity);


}
