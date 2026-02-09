package com.syncerpal.backend.location;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class LocationController {

  private final LocationRepository locationRepository;

  public LocationController(LocationRepository locationRepository) {
    this.locationRepository = locationRepository;
  }

  @GetMapping("/api/locations")
  public List<Location> getLocations() {
    return locationRepository.findAll();
  }
}
