package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.vesselItem.*;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemRes;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemSearchReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemUpdateReq;
import com.Incamar.IncaCore.dtos.vesselItemHours.VesselItemHoursRes;
import com.Incamar.IncaCore.services.VesselItemService;
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

import java.util.List;


@RestController
@RequestMapping("/api/vessel-item")
@RequiredArgsConstructor
@Tag(name = "04 - Items Embarcaciones",
        description = "Endpoints para gestión de items de embarcaciones")
public class VesselItemController {

    private final VesselItemService vesselItemService;

    @GetAllVesselItemEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping
    public ResponseEntity<?> getAllWithSearch(@ParameterObject @Valid VesselItemSearchReq request, @ParameterObject Pageable pageable){
        Page<VesselItemRes> response = vesselItemService.getAllWithSearch(request,pageable);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Operación exitosa"));
    }

    @GetVesselItemByIdEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id){
        VesselItemRes response = vesselItemService.getById(id);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Operacion exitosa"));
    }

    @CreateVesselItemEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody VesselItemReq request){
        VesselItemRes response = vesselItemService.create(request);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Item agregado exitosamente"));
    }

    @UpdateVesselItemEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody VesselItemUpdateReq request){
        VesselItemRes response = vesselItemService.update(id,request);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Item de embarcacion actualizado"));
    }

    @DeleteVesselIemEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        vesselItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @MantenimenceVesselItemsEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','VESSEL') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','VESSEL') ")
    @GetMapping("/maintenance-required")
    public ResponseEntity<?> getItemsRequiringMaintenanceWithoutActiveOrders() {
        List<VesselItemRes> response = vesselItemService.findItemsRequiringMaintenanceWithoutActiveOrders();
        return ResponseEntity.ok().body(ApiResult.success(response,"Lista de componentes que requieren mantenimiento"));
    }

    @NotificationEmailVesselItemEndpoindDoc
    @PostMapping("/maintenance-alert")
    public ResponseEntity<?> sendMaintenanceAlert(@RequestParam String email) {
        vesselItemService.vesselItemsAlert(email);
        return ResponseEntity.ok().body(ApiResult.success("Se ha enviaddo un correo con la información requerida"));
    }


}
