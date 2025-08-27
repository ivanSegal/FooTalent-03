package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.dtos.vesselItem.VesselItemReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemRes;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemSearchReq;
import com.Incamar.IncaCore.dtos.vesselItem.VesselItemUpdateReq;
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
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/vassel-item")
@RequiredArgsConstructor
@Tag(name = "04 - Items Embarcaciones",
        description = "Endpoints para gestión de items de embarcaciones")
public class VesselItemController {

    private final VesselItemService vesselItemService;

    @SecurityRequirement(name = "bearer-key")
    @GetMapping
    public ResponseEntity<?> getAllWithSearch(@ParameterObject @Valid VesselItemSearchReq request, @ParameterObject Pageable pageable){
        Page<VesselItemRes> response = vesselItemService.getAllWithSearch(request,pageable);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Operación exitosa"));
    }

    @SecurityRequirement(name = "bearer-key")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id){
        VesselItemRes response = vesselItemService.getById(id);
        return ResponseEntity.ok()
                .body(ApiResult.success(response,"Operacion exitosa"));
    }

    @SecurityRequirement(name = "bearer-key")
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody VesselItemReq request){
        vesselItemService.create(request);
        return ResponseEntity.ok()
                .body(ApiResult.success("Item agregado a la embarcacion exitosamente"));
    }

    @SecurityRequirement(name = "bearer-key")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody VesselItemUpdateReq request){
        vesselItemService.update(id,request);
        return ResponseEntity.ok()
                .body(ApiResult.success("Item de embarcacion actualizado"));
    }


}
