package es.guiasdocentes.backend.dto;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SemanaCronogramaDto {
    @JsonProperty("Semana")
    private String semana;

    @JsonProperty("Actividades")
    private List<ActividadSemanaDto> actividades;
}