package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.travel.TravelRequestDto;
import com.Incamar.IncaCore.dtos.travel.TravelResponseDto;

import java.util.List;

public interface TravelService {

    TravelResponseDto create(TravelRequestDto dto);
    List<TravelResponseDto> getByDetailId(Long detailId);
    int getTotalTraveledHours(Long detailId);
}
