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

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public JwtAuthenticationFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

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

        jwt = authHeader.substring(7); // Quitamos la palabra "Bearer "
        
        try {
            // Usamos tu método personalizado
            usuarioId = jwtService.extraerUsuarioId(jwt);

            if (usuarioId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Buscamos por ID en lugar de email, ya que tu token lo permite
                Optional<UsuarioDocument> usuarioOpt = usuarioRepository.findById(usuarioId);

                if (usuarioOpt.isPresent() && jwtService.esTokenValido(jwt, usuarioId)) {
                    UsuarioDocument usuario = usuarioOpt.get();

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            usuario, null, new ArrayList<>()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Le decimos a Spring "Este usuario está autenticado y tiene permiso"
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            System.err.println("Token inválido o manipulado: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}