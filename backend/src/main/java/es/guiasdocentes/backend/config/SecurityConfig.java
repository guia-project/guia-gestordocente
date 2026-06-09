package es.guiasdocentes.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Clase de configuración central para Spring Security.
 * Define la arquitectura de seguridad de la aplicación basándose en tokens (JWT)
 * y una política sin estado (Stateless). Se encarga de gestionar los accesos a las rutas,
 * la política de CORS y la inyección del filtro personalizado de autenticación.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    /**
     * Constructor con Inyección de Dependencias.
     * 
     * @param jwtAuthFilter Filtro personalizado que interceptará las peticiones HTTP
     *                      para extraer y validar el token JWT.
     */
    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    /**
     * Define el algoritmo de encriptación (hashing) que se utilizará para las contraseñas.
     * BCrypt es el estándar actual en la industria por su resistencia a ataques de fuerza bruta.
     *
     * @return Una instancia de BCryptPasswordEncoder.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura la cadena de filtros de seguridad (Security Filter Chain).
     * Es el núcleo donde se establecen las reglas de qué se permite y qué se bloquea en la API.
     *
     * @param http El objeto HttpSecurity proporcionado por Spring.
     * @return La cadena de filtros de seguridad ya construida.
     * @throws Exception Si ocurre algún error durante la configuración.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Desactivado por ser una API REST orientada a tokens
            
            // Hacemos que la API no use cookies de sesión
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(auth -> auth
                // Solo /api/auth/login y /api/auth/registro son públicos
                .requestMatchers("/api/auth/**").permitAll()
                
                // Todas las demás rutas requieren un token válido
                .anyRequest().authenticated()
            )
            
            // Ponemos a nuestro "portero" (el filtro JWT) a revisar los tokens ANTES 
            // del filtro estándar de autenticación por usuario/contraseña de Spring Security.
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configura la política CORS (Cross-Origin Resource Sharing).
     * Especifica qué dominios externos tienen permiso para interactuar con esta API,
     * evitando bloqueos de seguridad del navegador al conectar el Frontend en React.
     *
     * @return La fuente de configuración CORS con los orígenes, métodos y cabeceras permitidos.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Orígenes: Frontend en desarrollo (5173) y entornos Docker/Producción (localhost/127.0.0.1)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost", "http://127.0.0.1", "http://localhost:9003"));
        
        // Métodos permitidos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Cabeceras permitidas
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuración a todas las rutas de la API
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}