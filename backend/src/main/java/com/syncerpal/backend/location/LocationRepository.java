package com.syncerpal.backend.location;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {}