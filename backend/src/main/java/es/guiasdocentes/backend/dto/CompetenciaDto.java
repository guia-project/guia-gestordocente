package es.guiasdocentes.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CompetenciaDto {
    @JsonProperty("Tipo")
    private String tipo;

    @JsonProperty("Código")
    private String codigo;

    @JsonProperty("Descripción")
    private String descripcion;
}