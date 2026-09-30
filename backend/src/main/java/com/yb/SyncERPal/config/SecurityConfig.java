package com.yb.SyncERPal.config;

import java.util.List;

import com.yb.SyncERPal.model.StandardErrorResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class SecurityConfig {

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    private final TokenAuthenticationFilter tokenAuthenticationFilter;
    private final ObjectMapper objectMapper;

    public SecurityConfig(
            TokenAuthenticationFilter tokenAuthenticationFilter,
            ObjectMapper objectMapper
    ) {
        this.tokenAuthenticationFilter = tokenAuthenticationFilter;
        this.objectMapper = objectMapper;
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
                        // Swagger/OpenAPI
                        // ==================================
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()

                        // ==================================
                        // Fallback
                        // Any endpoint not matched above is currently public
                        // ==================================

                        .anyRequest().permitAll()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) -> {
                            StandardErrorResponse errorResponse = new StandardErrorResponse(
                                    HttpStatus.UNAUTHORIZED.value(),
                                    HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                                    "Authentication is required.",
                                    request.getRequestURI()
                            );

                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");

                            objectMapper.writeValue(response.getWriter(), errorResponse);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            StandardErrorResponse errorResponse = new StandardErrorResponse(
                                    HttpStatus.FORBIDDEN.value(),
                                    HttpStatus.FORBIDDEN.getReasonPhrase(),
                                    "Access denied.",
                                    request.getRequestURI()
                            );

                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");

                            objectMapper.writeValue(response.getWriter(), errorResponse);
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

        configuration.setAllowedOrigins(List.of(allowedOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}