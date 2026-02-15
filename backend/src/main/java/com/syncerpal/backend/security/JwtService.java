package com.syncerpal.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

  private final Key signingKey;
  private final long expirationMillis;

  public JwtService(
      @Value("${syncerpal.jwt.secret}") String secret,
      @Value("${syncerpal.jwt.expirationSeconds}") long expirationSeconds) {
    this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMillis = expirationSeconds * 1000;
  }

  public String createToken(String username, String role) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + expirationMillis);

    return Jwts.builder()
        .subject(username)
        .claims(Map.of("role", role))
        .issuedAt(now)
        .expiration(expiry)
        .signWith(signingKey)
        .compact();
  }

  public Jws<Claims> parseAndValidate(String token) {
    return Jwts.parser()
        .verifyWith((javax.crypto.SecretKey) signingKey)
        .build()
        .parseSignedClaims(token);
  }

  public String getUsername(String token) {
    return parseAndValidate(token).getPayload().getSubject();
  }

  public String getRole(String token) {
    Object role = parseAndValidate(token).getPayload().get("role");
    return role == null ? null : role.toString();
  }
}
