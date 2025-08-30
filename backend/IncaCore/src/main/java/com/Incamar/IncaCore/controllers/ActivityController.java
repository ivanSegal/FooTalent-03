package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.activity.*;
import com.Incamar.IncaCore.dtos.activity.ActivityRequestDto;
import com.Incamar.IncaCore.dtos.activity.ActivityResponseDto;
import com.Incamar.IncaCore.dtos.maintenanceOrder.MaintenanceOrderRequestDto;
import com.Incamar.IncaCore.security.CustomUserDetails;
import com.Incamar.IncaCore.services.ActivityService;
import com.Incamar.IncaCore.utils.ApiResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance-activities")
@RequiredArgsConstructor
@Tag(name = "07 - Actividades de Mantenimiento", description = "Endpoints para la gestión de " +
        "actividades realizadas en los mantenimientos")
public class ActivityController {
    private final ActivityService activityService;

    @GetAllActivitiesEndpointDoc
    @GetMapping
    public ResponseEntity<Page<ActivityResponseDto>> getAllActivities(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(activityService.getAllActivities(pageable));
    }

    @GetActivityByIdEndpointDoc
    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponseDto> getActivityById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    @CreateActivityEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','MAINTENANCE') ")
    @PostMapping
    public ResponseEntity<ApiResult<?>> createActivity(@Validated(MaintenanceOrderRequestDto.Create.class) @RequestBody ActivityRequestDto requestDto
            , Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        ActivityResponseDto createdActivity = activityService.createActivity(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResult.success(createdActivity,
                "Actividades de Mantenimiento creada correctamente."));
    }

    @DeleteActivityEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivityById(id);
        return ResponseEntity.noContent().build();
    }

    @UpdateActivityEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE')")
    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponseDto> updateActivity(
            @PathVariable Long id, @Valid @RequestBody ActivityRequestDto requestDto
    ) {
        ActivityResponseDto updatedActivity = activityService.editActivity(id, requestDto);
        return ResponseEntity.ok(updatedActivity);
    }

    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','MAINTENANCE') ")
    @SearchActivitiesByMaintenanceOrderIdEndpointDoc
    @GetMapping("/search")
    public ResponseEntity<Page<ActivityResponseDto>> searchActivitiesByMaintenanceOrderId(
            @RequestParam("maintenanceOrderId") Long maintenanceOrderId,
            @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(activityService.searchActivitiesByMaintenanceOrderId(maintenanceOrderId, pageable));
    }

    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','MAINTENANCE') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','MAINTENANCE') ")
    @SearchActivitiesByVesselNameEndpointDoc
    @GetMapping("/searchByVessel")
    public ResponseEntity<Page<ActivityResponseDto>> searchActivitiesByVesselName(
            @RequestParam("vesselName") String vesselName,
            @ParameterObject Pageable pageable
    ) {
        return ResponseEntity.ok(activityService.searchActivitiesByVesselName(vesselName, pageable));
    }
}
