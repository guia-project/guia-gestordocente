package es.guiasdocentes.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DatosGeneralesDto {

    @JsonProperty("Nombre asignatura")
    private String nombreAsignatura;

    @JsonProperty("Código asignatura")
    private String codigoAsignatura;

    @JsonProperty("No créditos")
    private String creditos;

    @JsonProperty("Titulación")
    private String titulacion;
    
    @JsonProperty("Curso")
    private String curso;

    @JsonProperty("Curso implantación")
    private String cursoImplantacion;

    @JsonProperty("Año plan de estudios")
    private String anioPlanEstudios;

    @JsonProperty("Semestre")
    private String semestre;

    @JsonProperty("Período de impartición")
    private String periodo;

    @JsonProperty("Carácter")
    private String caracter;

    @JsonProperty("Idioma")
    private String idioma;

    @JsonProperty("Modalidad")
    private String modalidad;

    @JsonProperty("Módulo")
    private String modulo;

    @JsonProperty("Rama de conocimiento")
    private String rama;

    @JsonProperty("Área")
    private String area;

    @JsonProperty("Departamento")
    private String departamento;

    @JsonProperty("Centro")
    private String centro;

}
