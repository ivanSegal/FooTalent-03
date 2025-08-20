package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.boletaServicio.BoletaServicioRequestDto;
import com.Incamar.IncaCore.dtos.boletaServicio.BoletaServicioResponseDto;
import com.Incamar.IncaCore.dtos.users.JwtDataDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IBoletaServicioService {

    Page<BoletaServicioResponseDto> getAllBoletasServicio(Pageable pageable);

    BoletaServicioResponseDto getBoletaServicioById(Long id);

    BoletaServicioResponseDto createBoletaServicio(BoletaServicioRequestDto requestDto, JwtDataDto jwtDataDto);

    BoletaServicioResponseDto editBoletaServicio(Long id, BoletaServicioRequestDto requestDto);

    void deleteBoletaServicioById(Long id);

    Page<BoletaServicioResponseDto> searchBoletaServicioByBoat(String boatName, Pageable pageable);

}
