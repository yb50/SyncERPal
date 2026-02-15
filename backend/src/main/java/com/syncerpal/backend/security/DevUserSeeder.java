package com.syncerpal.backend.security;

import com.syncerpal.backend.user.User;
import com.syncerpal.backend.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DevUserSeeder implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public DevUserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    userRepository.findByUsername("admin").ifPresent(user -> fix(user, "admin123"));
    userRepository.findByUsername("worker").ifPresent(user -> fix(user, "worker123"));
  }

  private void fix(User user, String plainPassword) {
    if ("PLACEHOLDER".equals(user.getPasswordHash())) {
      user.setPasswordHash(passwordEncoder.encode(plainPassword));
      userRepository.save(user);
    }
  }
}
