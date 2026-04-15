package es.guiasdocentes.backend.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class GuiaDocenteDto {

    @JsonProperty("Nombre del documento")
    private String nombreDocumento;

    @JsonProperty("Datos Generales")
    private DatosGeneralesDto datosGenerales;

    @JsonProperty("Profesorado")
    private List<ProfesorDto> profesorado;

    @JsonProperty("Otros Datos")
    private OtrosDatosDto otrosDatos;

}
