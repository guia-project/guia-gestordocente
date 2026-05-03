package es.guiasdocentes.backend;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Clase auxiliar (DTO/Modelo) que representa un tema o apartado del bloque de contenidos,
 * asociado a un nivel jerárquico.
 * Se utiliza principalmente para estructurar y mapear de forma automática listas anidadas 
 * del temario de la asignatura, permitiendo distinguir entre temas principales y subtemas 
 * al interactuar con el Frontend o al recibir datos estructurados desde la Inteligencia Artificial.
 */
public class ItemTemaNivel {

    /**
     * El título o descripción del tema/apartado.
     * La anotación @JsonProperty("Tema") asegura que la librería Jackson asocie automáticamente 
     * este campo cuando reciba o genere un objeto JSON que contenga exactamente la clave "Tema".
     */
    @JsonProperty("Tema")
    private String tema;

    /**
     * El nivel de profundidad o sangría del tema dentro de la estructura del temario.
     * Habitualmente, el valor 0 indica un bloque o tema principal (ej. "Tema 1"),
     * y los valores mayores (1, 2, etc.) indican apartados secundarios (ej. "1.1", "1.1.1").
     * La anotación @JsonProperty("Nivel") fuerza el mapeo exacto con la clave "Nivel" en el JSON.
     */
    @JsonProperty("Nivel")
    private Integer nivel;

    /**
     * Obtiene el nombre o descripción del tema.
     *
     * @return Una cadena de caracteres (String) con el contenido del tema.
     */
    public String getTema() { 
        return tema; 
    }

    /**
     * Establece el nombre o descripción del tema.
     *
     * @param tema El nuevo título del tema o apartado que se desea asignar.
     */
    public void setTema(String tema) { 
        this.tema = tema; 
    }

    /**
     * Obtiene el nivel de jerarquía del tema dentro del índice general.
     *
     * @return Un número entero (Integer) representativo del nivel o profundidad.
     */
    public Integer getNivel() { 
        return nivel; 
    }

    /**
     * Establece el nivel jerárquico del tema para organizar la estructura en árbol del temario.
     *
     * @param nivel El nuevo nivel a asignar (ej. 0 para tema principal, 1 para subtema).
     */
    public void setNivel(Integer nivel) { 
        this.nivel = nivel; 
    }
}