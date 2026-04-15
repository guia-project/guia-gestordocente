package es.guiasdocentes.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Clase de configuración central para Spring Security.
 * Define las reglas de seguridad de la aplicación, incluyendo la encriptación de contraseñas,
 * la protección contra ataques (CSRF), el control de acceso a las rutas (Endpoints) 
 * y la política de intercambio de recursos de origen cruzado (CORS).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Define el algoritmo de encriptación (hashing) que se utilizará para las contraseñas.
     * BCrypt es el estándar de la industria actual por su resistencia a ataques de fuerza bruta.
     *
     * @return Una instancia de BCryptPasswordEncoder.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configura la cadena de filtros de seguridad (Security Filter Chain) para las peticiones HTTP.
     * Es el núcleo donde se establecen las reglas de qué se permite y qué se bloquea en la API.
     *
     * @param http El objeto HttpSecurity proporcionado por Spring para configurar la seguridad web.
     * @return La cadena de filtros construida y configurada.
     * @throws Exception Si ocurre algún error durante la configuración.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Conectamos el filtro de CORS global que hemos definido más abajo
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            
            // 2. Desactivamos CSRF (Cross-Site Request Forgery). 
            // En APIs REST puras que no usan sesiones de navegador (cookies tradicionales), es seguro y habitual desactivarlo.
            .csrf(csrf -> csrf.disable())
            
            // 3. Reglas de Autorización de Rutas
            .authorizeHttpRequests(auth -> auth
                // Permitimos acceso libre a las rutas de login y registro
                .requestMatchers("/api/auth/**").permitAll() 
                
                // IMPORTANTE: Temporalmente abrimos todos los endpoints para facilitar el desarrollo
                // y la futura integración con el SSO de la Universidad.
                .anyRequest().permitAll()
            );

        return http.build();
    }

    /**
     * Configura la política CORS (Cross-Origin Resource Sharing).
     * Esta "aduana" le dice al navegador web qué dominios externos tienen permiso 
     * para hacer peticiones a nuestra API de Spring Boot.
     *
     * @return La fuente de configuración CORS con las reglas especificadas.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 1. Orígenes permitidos: El entorno de desarrollo (5173) y el entorno Docker (80 / localhost / 127.0.0.1)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost", "http://127.0.0.1"));
        
        // 2. Métodos HTTP permitidos (El OPTIONS es crítico para que funcione la subida de archivos/PDFs)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
        
        // 3. Cabeceras permitidas en las peticiones
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        
        // 4. Aplicamos esta configuración a absolutamente TODAS las rutas de nuestra API (/**)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}