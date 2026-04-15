package es.guiasdocentes.backend.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ActividadEvaluacionDto {
    @JsonProperty("Nombre")
    private String nombre;

    @JsonProperty("Descripción")
    private String descripcion;

    @JsonProperty("Tipo")
    private String tipo;

    @JsonProperty("Peso")
    private String peso;

    @JsonProperty("Nota mínima")
    private String notaMinima;
}