package es.guiasdocentes.backend.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ActividadSemanaDto {
    @JsonProperty("Clasificación")
    private String clasificacion;

    @JsonProperty("Tipo")
    private String tipo;

    @JsonProperty("Descripción")
    private String descripcion;

    @JsonProperty("Horas")
    private String horas;
}