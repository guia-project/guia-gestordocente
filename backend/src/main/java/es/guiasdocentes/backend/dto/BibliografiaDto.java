package es.guiasdocentes.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BibliografiaDto {
    @JsonProperty("Tipo")
    private String tipo;

    @JsonProperty("Referencia")
    private String referencia;
}