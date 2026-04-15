package es.guiasdocentes.backend.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OtrosDatosDto {

    // AHORA SON LISTAS SIMPLES
    @JsonProperty("Conocimientos previos recomendados")
    private List<String> conocimientosPrevios;

    @JsonProperty("Objetivos")
    private List<String> objetivos;

    @JsonProperty("Contenidos")
    private List<TemaDto> contenidos;

    @JsonProperty("Metodología")
    private String metodologia;

    @JsonProperty("Bibliografía")
    private List<BibliografiaDto> bibliografia;

    @JsonProperty("Evaluación")
    private String evaluacion;

    @JsonProperty("Actividades de evaluación")
    private List<ActividadEvaluacionDto> actividadesEvaluacion;

    @JsonProperty("Cronograma")
    private List<SemanaCronogramaDto> cronograma;

    @JsonProperty("Normas realización pruebas")
    private String normasRealizacionPruebas;

    @JsonProperty("Ausencia máxima")
    private String ausenciaMaxima;

    @JsonProperty("Otra información")
    private String otraInformacion;

    @JsonProperty("Competencias")
    private List<CompetenciaDto> competencias;
}