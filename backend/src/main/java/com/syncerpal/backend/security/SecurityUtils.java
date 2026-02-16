package com.syncerpal.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

  private SecurityUtils() {
  }

  public static String getCurrentUsername() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null)
      return null;
    if (!auth.isAuthenticated())
      return null;

    Object principal = auth.getPrincipal();
    if (principal == null)
      return null;

    return principal.toString();
  }
}
