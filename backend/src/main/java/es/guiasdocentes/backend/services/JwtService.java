package es.guiasdocentes.backend.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final Key key;
    private final long expirationTime = 86400000; // 24h

    // Inyectamos la clave desde application.properties
    public JwtService(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generarToken(String usuarioId, String email) {
        return Jwts.builder()
                .setSubject(usuarioId)
                .claim("email", email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // --- NUEVOS MÉTODOS PARA LEER Y VALIDAR EL TOKEN ---

    public String extraerUsuarioId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extraerEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    public boolean esTokenValido(String token, String usuarioId) {
        final String idExtraido = extraerUsuarioId(token);
        return (idExtraido.equals(usuarioId) && !esTokenCaducado(token));
    }

    private boolean esTokenCaducado(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extraerTodosLosClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extraerTodosLosClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}