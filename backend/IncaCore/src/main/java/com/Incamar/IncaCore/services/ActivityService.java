package com.Incamar.IncaCore.services;

import com.Incamar.IncaCore.dtos.activity.ActivityRequestDto;
import com.Incamar.IncaCore.dtos.activity.ActivityResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActivityService {
    Page<ActivityResponseDto> getAllActivities(Pageable pageable);
    ActivityResponseDto getActivityById(Long id);
    ActivityResponseDto createActivity(ActivityRequestDto dto);
    ActivityResponseDto editActivity(Long id,
                                                     ActivityRequestDto activityRequestDto);
    void deleteActivityById(Long id);
    Page<ActivityResponseDto> searchActivitiesByMaintenanceOrderId(Long Id, Pageable pageable);
    Page<ActivityResponseDto> searchActivitiesByVesselName(String vesselName, Pageable pageable);
}
