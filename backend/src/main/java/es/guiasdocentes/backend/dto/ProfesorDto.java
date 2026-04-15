package es.guiasdocentes.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ProfesorDto {

    @JsonProperty("Nombre")
    private String nombre;

    @JsonProperty("Es coordinador")
    private boolean esCoordinador;

    @JsonProperty("Email")
    private String email;

    @JsonProperty("Telefono")
    private String telefono;

    @JsonProperty("Despacho")
    private String despacho;

    @JsonProperty("Horario tutorías")
    private String horarioTutorias;

    @JsonProperty("URL web")
    private String urlWeb;

    @JsonProperty("Grupo")
    private String grupo;
}
