package es.guiasdocentes.backend.controllers;

import es.guiasdocentes.backend.models.UsuarioDocument;
import es.guiasdocentes.backend.repositories.UsuarioRepository;
import es.guiasdocentes.backend.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * Controlador REST encargado de gestionar la autenticación y autorización de la aplicación.
 * Maneja los flujos de registro de nuevos usuarios y el inicio de sesión mediante la emisión de tokens JWT.
 */
@RestController
@RequestMapping("/api/auth")
// Añadimos los puertos de Docker para evitar bloqueos CORS en producción
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost", "http://localhost:80"})
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Constructor del controlador con Inyección de Dependencias.
     *
     * @param usuarioRepository Repositorio para acceder a los datos de los usuarios en MongoDB.
     * @param passwordEncoder   Codificador BCrypt para encriptar y verificar contraseñas de forma segura.
     * @param jwtService        Servicio encargado de la generación y validación de JSON Web Tokens (JWT).
     */
    @Autowired
    public AuthController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * Verifica que el correo electrónico no esté registrado previamente y encripta la contraseña
     * antes de almacenar el documento en la base de datos.
     *
     * @param nuevoUsuario Objeto que contiene los datos del usuario (nombre, email, password en texto plano).
     * @return ResponseEntity con código 200 (OK) y mensaje de éxito, o código 400 (Bad Request) si el email ya existe.
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioDocument nuevoUsuario) {
        // Comprobar si el email ya existe en la base de datos
        if (usuarioRepository.findByEmail(nuevoUsuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email ya está en uso"));
        }

        // Encriptar la contraseña mediante BCrypt (¡Obligatorio por estándares de seguridad!)
        nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));

        // Guardar el usuario en MongoDB
        usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado con éxito"));
    }

    /**
     * Autentica a un usuario en el sistema y genera un token de sesión.
     * Compara el email y verifica que la contraseña en texto plano coincida con el hash almacenado.
     *
     * @param credenciales Objeto que contiene el email y la contraseña proporcionados en el formulario de login.
     * @return ResponseEntity con código 200 (OK) incluyendo el token JWT y los datos básicos del usuario,
     * o código 401 (Unauthorized) si las credenciales son incorrectas.
     */
    @PostMapping("/login")
    public ResponseEntity<?> iniciarSesion(@RequestBody UsuarioDocument credenciales) {
        // Buscar al usuario en la base de datos por su email
        Optional<UsuarioDocument> usuarioOpt = usuarioRepository.findByEmail(credenciales.getEmail());

        // Si el usuario no existe, devolvemos un error 401 (No autorizado)
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }

        UsuarioDocument usuario = usuarioOpt.get();

        // Comprobar si la contraseña proporcionada coincide con el hash encriptado de la base de datos
        if (!passwordEncoder.matches(credenciales.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }

        // Si las credenciales son válidas, generamos la llave de acceso (Token JWT)
        String token = jwtService.generarToken(usuario.getId(), usuario.getEmail());

        // Devolvemos un JSON estructurado con el token y la información de sesión para el Frontend
        return ResponseEntity.ok(Map.of(
                "token", token,
                "nombre", usuario.getNombre(),
                "usuarioId", usuario.getId()
        ));
    }
}