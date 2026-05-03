package es.guiasdocentes.backend;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Clase auxiliar (DTO/Modelo) que representa un elemento de texto asociado a un nivel jerárquico.
 * Se utiliza principalmente para mapear y estructurar listas anidadas que provienen del Frontend 
 * o de las respuestas JSON generadas por la Inteligencia Artificial (por ejemplo: listas de 
 * Conocimientos Previos recomendados u Objetivos de la asignatura).
 */
public class ItemTextoNivel {

    /**
     * El contenido principal o descripción del elemento.
     * La anotación @JsonProperty("Texto") asegura que la librería Jackson mapee automáticamente 
     * este campo cuando se recibe o se envía un JSON que contiene exactamente la clave "Texto" (con mayúscula).
     */
    @JsonProperty("Texto")
    private String texto;

    /**
     * El nivel de sangría, jerarquía o profundidad del elemento dentro de una lista.
     * Por lo general, un valor de 0 representa un elemento principal o padre, 
     * y valores superiores (1, 2...) representan sub-elementos o hijos.
     * La anotación @JsonProperty("Nivel") asegura el mapeo exacto con la clave "Nivel" en el JSON.
     */
    @JsonProperty("Nivel")
    private Integer nivel;

    /**
     * Obtiene el contenido textual del elemento.
     *
     * @return Una cadena de caracteres (String) con el texto.
     */
    public String getTexto() { 
        return texto; 
    }

    /**
     * Establece el contenido textual del elemento.
     *
     * @param texto El nuevo texto que se desea asignar al elemento.
     */
    public void setTexto(String texto) { 
        this.texto = texto; 
    }

    /**
     * Obtiene el nivel jerárquico o de profundidad del elemento.
     *
     * @return Un número entero (Integer) que representa el nivel.
     */
    public Integer getNivel() { 
        return nivel; 
    }

    /**
     * Establece el nivel jerárquico del elemento para organizar listas anidadas.
     *
     * @param nivel El nuevo nivel a asignar (ej. 0 para principal, 1 para secundario, etc.).
     */
    public void setNivel(Integer nivel) { 
        this.nivel = nivel; 
    }
}