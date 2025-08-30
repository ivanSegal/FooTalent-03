package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.stock.*;
import com.Incamar.IncaCore.dtos.stock.StockRequesDto;
import com.Incamar.IncaCore.dtos.stock.StockResponseDto;
import com.Incamar.IncaCore.dtos.stock.StockUpdateDto;
import com.Incamar.IncaCore.services.StockService;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stocks")
@Tag(name = "13 - Stocks",
        description = "Endpoints para gestión de stock de los items de almacen.")
public class StockController {

    private final StockService stockService;

    @CreateStockEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @PostMapping("/create")
    public ApiResult<?> createStock(@RequestBody @Valid StockRequesDto stockRequesDto) {
        StockResponseDto stockResponseDto = stockService.createStock(stockRequesDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResult.success(stockResponseDto, "Stock creado correctamente.")).getBody();
    }

    @GetStockByIdEndpointDoc
    @GetMapping("/{id}")
    public ResponseEntity<ApiResult<?>> getStockById(@PathVariable Long id) {
        StockResponseDto responseDto = stockService.getStockById(id);
        return ResponseEntity.ok(ApiResult.success(responseDto, "Stock obtenido exitosamente."));
    }

    @DeleteStockEndpointDoc
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResult<?>> deleteStock(@PathVariable Long id) {
        stockService.deleteById(id);
        return ResponseEntity.ok(ApiResult.success("Stock eliminado exitosamente."));
    }

    @GetAllStocksEndpointDoc
    @GetMapping
    public ResponseEntity<ApiResult<?>> getAllStock(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(ApiResult.success(stockService.getAllStock(pageable),
                "Se visualizan exitosamente todos los stocks."));

    }

    @SearchStocksEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY') OR " +
            "@securityService.hasRoleAndDepartment('OPERATOR','INVENTORY')")
    @GetMapping("/search")
    public ResponseEntity<ApiResult<?>> searchStock(@RequestParam("nombre") String nameItem, @ParameterObject Pageable pageable) {
        Page<StockResponseDto> result = stockService.searchStockByNameOfItem(nameItem, pageable);
        return ResponseEntity.ok(ApiResult.success(result,"Stocks obtenidos exitosamente."));
    }

    @UpdateStockEndpointDoc
    @PreAuthorize("hasRole('ADMIN') OR @securityService.hasRoleAndDepartment('SUPERVISOR','INVENTORY')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResult<?>> editStock(@PathVariable Long id,
                                                      @Valid @RequestBody StockUpdateDto stockUpdateDto) {
        StockResponseDto stockResponseDto =  stockService.editStock(id, stockUpdateDto);
        return ResponseEntity.ok(ApiResult.success(stockResponseDto,"Stock editado exitosamente."));
    }
}