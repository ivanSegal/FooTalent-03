package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.travel.TravelRequestDto;
import com.Incamar.IncaCore.dtos.travel.TravelResponseDto;

import java.util.List;

public interface TravelService {

    TravelResponseDto create(TravelRequestDto dto);
    List<TravelResponseDto> getByDetailId(Long detailId);
    String getTotalTraveledTime(Long detailId);
    TravelResponseDto update(Long id, TravelRequestDto dto);
    void delete(Long id);
}
