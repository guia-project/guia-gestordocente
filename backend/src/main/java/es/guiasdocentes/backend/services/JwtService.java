package es.guiasdocentes.backend.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; // Importante
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Servicio encargado de la gestión de JSON Web Tokens (JWT).
 */
@Service
public class JwtService {

    private final Key key;
    private final long expirationTime = 86400000; // 24h

    // Inyectamos la clave desde application.properties
    public JwtService(@Value("${jwt.secret}") String secret) {
        // Al recibirla en el constructor, generamos el objeto Key de forma segura
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Genera un nuevo Token JWT firmado criptográficamente.
     */
    public String generarToken(String usuarioId, String email) {
        return Jwts.builder()
                .setSubject(usuarioId)
                .claim("email", email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}