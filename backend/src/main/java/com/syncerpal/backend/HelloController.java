/*
 * Health check endpoint used to verify that:
 * - Spring Boot app is running
 * - Backend is reachable from frontend / Docker
 *
 * Used during development and deployment verification.
*/

package com.syncerpal.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/api/health")
    public String health() {
        return "SyncERPal backend is running";
    }
}