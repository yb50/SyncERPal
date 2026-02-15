package com.syncerpal.backend.auth;

import com.syncerpal.backend.security.JwtService;
import com.syncerpal.backend.user.User;
import com.syncerpal.backend.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @PostMapping("/api/auth/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

    User user = userRepository.findByUsername(request.getUsername())
        .orElse(null);

    if (user == null || !user.isActive()) {
      return ResponseEntity.status(401).build();
    }

    boolean ok = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
    if (!ok) {
      return ResponseEntity.status(401).build();
    }

    String token = jwtService.createToken(user.getUsername(), user.getRole());

    return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole()));
  }
}
