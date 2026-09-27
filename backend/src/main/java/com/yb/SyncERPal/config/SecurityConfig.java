package com.yb.SyncERPal.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final TokenAuthenticationFilter tokenAuthenticationFilter;

    public SecurityConfig(TokenAuthenticationFilter tokenAuthenticationFilter) {
        this.tokenAuthenticationFilter = tokenAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                .authorizeHttpRequests(auth -> auth
                        // ==================================
                        // CORS preflight requests
                        // ==================================

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ==================================
                        // Authentication / first-user setup
                        // ==================================

                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/auth/setup-required").permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/setup").permitAll()

                        .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/auth/logout").authenticated()

                        // ==================================
                        // User management - ADMIN only
                        // ==================================

                        .requestMatchers(HttpMethod.POST, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")

                        // ==================================
                        // Items
                        // Read: all authenticated users
                        // Write: ADMIN and MANAGER
                        // ==================================

                        .requestMatchers(HttpMethod.GET, "/items/**").authenticated()

                        .requestMatchers(HttpMethod.POST, "/items/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/items/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/items/**").hasAnyRole("ADMIN", "MANAGER")

                        // ==================================
                        // Locations
                        // Read: all authenticated users
                        // Write: ADMIN and MANAGER
                        // ==================================

                        .requestMatchers(HttpMethod.GET, "/locations/**").authenticated()

                        .requestMatchers(HttpMethod.POST, "/locations/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/locations/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/locations/**").hasAnyRole("ADMIN", "MANAGER")

                        // ==================================
                        // Stock movements
                        // All authenticated users can read and create movements
                        // ==================================

                        .requestMatchers(HttpMethod.GET, "/stock-movements/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/stock-movements/**").authenticated()

                        // ==================================
                        // Stock transfers
                        // All authenticated users can read and create transfers
                        // ==================================

                        .requestMatchers(HttpMethod.GET, "/stock-transfers/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/stock-transfers/**").authenticated()

                        // ==================================
                        // Inventory balances
                        // Read-only for authenticated users
                        // ==================================

                        .requestMatchers(HttpMethod.GET, "/inventory-balances/**").authenticated()

                        // ==================================
                        // Audit logs
                        // Currently readable by all authenticated users
                        // ==================================

                        .requestMatchers(HttpMethod.GET, "/audit-logs/**").authenticated()

                        // ==================================
                        // H2 console - development only
                        // ==================================

                        .requestMatchers("/h2-console/**").permitAll()

                        // ==================================
                        // Fallback
                        // Any endpoint not matched above is currently public
                        // ==================================

                        .anyRequest().permitAll()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("text/plain");
                            response.getWriter().write("Authentication is required.");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("text/plain");
                            response.getWriter().write("Access denied.");
                        })
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(formLogin -> formLogin.disable())
                .logout(logout -> logout.disable())
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}