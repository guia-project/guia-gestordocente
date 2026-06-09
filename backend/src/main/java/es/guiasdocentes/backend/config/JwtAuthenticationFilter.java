package es.guiasdocentes.backend.config;

import es.guiasdocentes.backend.models.UsuarioDocument;
import es.guiasdocentes.backend.repositories.UsuarioRepository;
import es.guiasdocentes.backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

/**
 * Filtro de seguridad personalizado que intercepta cada petición HTTP entrante a la API.
 * Su función principal es actuar como "portero": extrae el token JWT de la cabecera "Authorization",
 * lo verifica y, si es válido, identifica al usuario en el sistema.
 * Extiende {@link OncePerRequestFilter} para garantizar que se ejecute una única vez por petición.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param jwtService        Servicio encargado de la lógica de extracción, lectura y validación de tokens JWT.
     * @param usuarioRepository Repositorio para buscar en la base de datos (MongoDB) la información del usuario.
     */
    @Autowired
    public JwtAuthenticationFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Lógica principal del filtro.
     * Analiza la petición entrante en busca de un token Bearer, extrae el identificador del usuario,
     * comprueba su existencia en la base de datos y, si todo es correcto, lo registra como 
     * un usuario autenticado en el contexto de Spring Security.
     *
     * @param request     La petición HTTP entrante enviada por el cliente.
     * @param response    La respuesta HTTP saliente.
     * @param filterChain La cadena de filtros de seguridad para continuar el flujo si el token es válido o está ausente.
     * @throws ServletException Si ocurre un error relacionado con el manejo de Servlets.
     * @throws IOException      Si ocurre un error de entrada/salida durante el procesamiento.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String usuarioId;

        // Si no hay token, la petición sigue, pero Spring Security la bloqueará más adelante
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        
        try {
            usuarioId = jwtService.extraerUsuarioId(jwt);

            if (usuarioId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Buscamos por ID
                Optional<UsuarioDocument> usuarioOpt = usuarioRepository.findById(usuarioId);

                if (usuarioOpt.isPresent() && jwtService.esTokenValido(jwt, usuarioId)) {
                    UsuarioDocument usuario = usuarioOpt.get();

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            usuario, null, new ArrayList<>()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            System.err.println("Token inválido o manipulado: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}