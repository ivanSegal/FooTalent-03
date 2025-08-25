package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.models.InventoryMovement;
import com.Incamar.IncaCore.utils.ApiResult;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController("/inventory-movements")
public class IventoryMovementController {

    public ApiResult<?> addMovement(InventoryMovement inventoryMovement) {

    }
}
