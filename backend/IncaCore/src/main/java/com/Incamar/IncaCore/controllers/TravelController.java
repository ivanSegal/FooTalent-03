package com.Incamar.IncaCore.controllers;

import com.Incamar.IncaCore.documentation.travel.CreateTravelEndpointDoc;
import com.Incamar.IncaCore.documentation.travel.GetTotalHoursByDetailEndpointDoc;
import com.Incamar.IncaCore.documentation.travel.GetTravelsByDetailEndpointDoc;
import com.Incamar.IncaCore.dtos.travel.TravelRequestDto;
import com.Incamar.IncaCore.dtos.travel.TravelResponseDto;
import com.Incamar.IncaCore.services.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/travels")
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;

    @CreateTravelEndpointDoc
    @PostMapping
    public ResponseEntity<TravelResponseDto> create(@Validated @RequestBody TravelRequestDto dto) {
        return ResponseEntity.ok(travelService.create(dto));
    }

    @GetTravelsByDetailEndpointDoc
    @GetMapping("/detail/{detailId}")
    public ResponseEntity<List<TravelResponseDto>> getByDetail(@PathVariable Long detailId) {
        return ResponseEntity.ok(travelService.getByDetailId(detailId));
    }

    @GetTotalHoursByDetailEndpointDoc
    @GetMapping("/detail/{detailId}/total-hours")
    public ResponseEntity<Integer> getTotalHours(@PathVariable Long detailId) {
        return ResponseEntity.ok(travelService.getTotalTraveledHours(detailId));
    }
}

