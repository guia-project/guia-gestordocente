package es.guiasdocentes.backend.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TemaDto {
    @JsonProperty("Tema")
    private String tema;

    @JsonProperty("Nivel")
    private Integer nivel;
}