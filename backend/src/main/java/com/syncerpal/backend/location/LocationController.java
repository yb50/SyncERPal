package com.syncerpal.backend.location;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
public class LocationController {

  private final LocationRepository locationRepository;

  public LocationController(LocationRepository locationRepository) {
    this.locationRepository = locationRepository;
  }

  @PreAuthorize("hasAnyRole('ADMIN','WORKER')")
  @GetMapping("/api/locations")
  public List<Location> getLocations() {
    return locationRepository.findAll();
  }
}
