package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursReq;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursRes;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursUpdateReq;
import com.Incamar.IncaCore.services.VesselItemHoursService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vessel-item-hours")
@Tag(name = "07 - Items Horas Embarcación", description = "Gestión de horas acumuladas en items embarcaciones")
public class VesselItemHoursController {

    private final VesselItemHoursService vesselItemHoursService;

    @SecurityRequirement(name = "bearer-key")
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping
    public ResponseEntity<?> getAll(@ParameterObject Pageable pageable){
        Page<VesselItemHoursRes> response = vesselItemHoursService.getAll(pageable);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Resultados obtenidos"));
    }

    @SecurityRequirement(name = "bearer-key")
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping("{id}")
    public ResponseEntity<?> getById(@PathVariable Long id){
        VesselItemHoursRes response = vesselItemHoursService.getById(id);
        return ResponseEntity.ok()
                .body(ApiResult.success(response, "Operacion exitosa"));

    }

    @SecurityRequirement(name = "bearer-key")
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody VesselItemHoursReq request) {
        vesselItemHoursService.create(request);
        return ResponseEntity.ok()
                .body(ApiResult.success("Las horas se añadieron con exito"));
    }

    @SecurityRequirement(name = "bearer-key")
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL')")
    @PutMapping("{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody VesselItemHoursUpdateReq request){
        vesselItemHoursService.update(id,request);
        return ResponseEntity.ok().body(ApiResult.success("Actualizacion exitosa"));
    }
}
