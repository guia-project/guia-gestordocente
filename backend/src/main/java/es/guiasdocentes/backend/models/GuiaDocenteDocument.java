package es.guiasdocentes.backend.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import es.guiasdocentes.backend.dto.DatosGeneralesDto;
import es.guiasdocentes.backend.dto.OtrosDatosDto;
import es.guiasdocentes.backend.dto.ProfesorDto;
import lombok.Data;

/**
 * Entidad principal que representa una Guía Docente en el sistema.
 * Mapea toda la estructura jerárquica de la guía con la colección "guias_docentes" en MongoDB.
 * Utiliza Lombok (@Data) para autogenerar el código repetitivo (getters, setters, constructores).
 */
@Data
@Document(collection = "guias_docentes")
public class GuiaDocenteDocument {

    /**
     * Identificador único del documento. 
     * Autogenerado por MongoDB al insertar el registro (formato ObjectId).
     */
    @Id
    private String id;
    
    /**
     * Identificador del usuario (propietario) que creó o subió esta guía.
     * Sirve como clave foránea (foreign key) lógica para enlazar guías con sus autores.
     */
    private String usuarioId;

    /** Nombre de referencia o título del documento (ej. "Guía Sistemas Distribuidos 2026"). */
    private String nombreDocumento;
    
    /** * Subdocumento embebido con la información básica de la asignatura 
     * (código, créditos, semestre, etc.). 
     */
    private DatosGeneralesDto datosGenerales;
    
    /** * Lista embebida de subdocumentos. 
     * Almacena a todos los profesores involucrados en la asignatura. 
     */
    private List<ProfesorDto> profesorado;
    
    /** * Subdocumento embebido que contiene la información de texto largo y complejo:
     * competencias, cronograma, actividades de evaluación y bibliografía.
     */
    private OtrosDatosDto otrosDatos;

    // NOTA: Lombok ya genera getUsuarioId() y setUsuarioId(String) automáticamente gracias a @Data.
    // Se dejan declarados explícitamente en caso de requerir lógica personalizada en el futuro.
    public String getUsuarioId() { return usuarioId; }
    public void setUsuarioId(String usuarioId) { this.usuarioId = usuarioId; }
}