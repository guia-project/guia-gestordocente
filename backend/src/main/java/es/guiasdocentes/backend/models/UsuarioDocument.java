package es.guiasdocentes.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Entidad que representa a un Usuario dentro del sistema.
 * Esta clase mapea directamente la estructura de los datos con la colección "usuarios" en MongoDB.
 */
@Document(collection = "usuarios")
public class UsuarioDocument {

    /**
     * Identificador único del usuario.
     * La anotación @Id le indica a Spring Data que mapee este campo con el campo reservado "_id" de MongoDB.
     * Al ser de tipo String, MongoDB generará automáticamente un ObjectId alfanumérico al guardarlo.
     */
    @Id
    private String id;
    
    /** * Correo electrónico institucional o personal del usuario. 
     * Actúa como nombre de usuario (username) principal para el inicio de sesión. 
     */
    private String email;
    
    /** * Contraseña del usuario. 
     * Por motivos de seguridad, este campo NUNCA almacena la contraseña en texto plano, 
     * sino su hash criptográfico generado mediante BCrypt. 
     */
    private String password;
    
    /** Nombre completo o de visualización del docente/usuario. */
    private String nombre;

    /**
     * Constructor vacío por defecto.
     * Es estrictamente obligatorio para que Spring Data MongoDB (e infraestructuras como Jackson)
     * puedan instanciar el objeto mediante Reflexión al leer los datos de la base de datos.
     */
    public UsuarioDocument() {}

    /**
     * Constructor parametrizado para facilitar la creación de nuevos usuarios en la lógica de negocio.
     * No incluye el 'id' porque este es generado automáticamente por la base de datos.
     *
     * @param email    El correo electrónico del usuario.
     * @param password La contraseña (idealmente ya encriptada) del usuario.
     * @param nombre   El nombre para mostrar.
     */
    public UsuarioDocument(String email, String password, String nombre) {
        this.email = email;
        this.password = password;
        this.nombre = nombre;
    }

    // --- GETTERS Y SETTERS ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}