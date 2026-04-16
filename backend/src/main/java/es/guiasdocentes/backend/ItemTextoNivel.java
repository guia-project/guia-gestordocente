package es.guiasdocentes.backend;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ItemTextoNivel {
    @JsonProperty("Texto")
    private String texto;

    @JsonProperty("Nivel")
    private Integer nivel;

    // Genera los Getters y Setters (o usa @Data si tienes Lombok)
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public Integer getNivel() { return nivel; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }
}