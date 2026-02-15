package com.syncerpal.backend.security;

import com.syncerpal.backend.user.User;
import com.syncerpal.backend.user.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DbUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;

  public DbUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    if (!user.isActive()) {
      throw new UsernameNotFoundException("User is inactive");
    }

    String roleName = "ROLE_" + user.getRole();

    return new org.springframework.security.core.userdetails.User(
        user.getUsername(),
        user.getPasswordHash(),
        List.of(new SimpleGrantedAuthority(roleName)));
  }
}
