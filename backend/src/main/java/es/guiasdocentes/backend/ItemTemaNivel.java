package es.guiasdocentes.backend;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ItemTemaNivel {
    @JsonProperty("Tema")
    private String tema;

    @JsonProperty("Nivel")
    private Integer nivel;

    // Genera los Getters y Setters (o usa @Data si tienes Lombok)
    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }
    public Integer getNivel() { return nivel; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }
}