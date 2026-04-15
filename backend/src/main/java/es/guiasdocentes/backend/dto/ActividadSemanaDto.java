package es.guiasdocentes.backend.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ActividadSemanaDto {
    @JsonProperty("Tipo")
    private String tipo;

    @JsonProperty("Descripción")
    private String descripcion;

    @JsonProperty("Horas")
    private String horas;
}