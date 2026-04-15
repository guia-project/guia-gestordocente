package es.guiasdocentes.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * Servicio de Inteligencia Artificial encargado del procesamiento de lenguaje natural (NLP).
 * Proporciona funcionalidades para extraer texto de archivos PDF y transformarlo en 
 * objetos JSON estructurados mediante la integración con modelos de lenguaje de OpenAI (GPT).
 */
@Service
public class AIService {

    /** Clave de API privada de OpenAI cargada desde la configuración del sistema. */
    @Value("${openai.api.key}")
    private String apiKey;

    /** Cliente para realizar peticiones HTTP a servicios externos. */
    private final RestTemplate restTemplate = new RestTemplate();
    
    /** Motor de procesamiento de JSON de Jackson. */
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Extrae el contenido textual de un archivo PDF utilizando la librería Apache PDFBox.
     * Convierte el flujo de datos del archivo subido en una cadena de texto plana.
     *
     * @param archivoPdf El archivo binario subido desde el frontend.
     * @return El texto completo extraído del documento.
     * @throws Exception Si el archivo está corrupto o no se puede leer.
     */
    public String extraerTextoDePdf(MultipartFile archivoPdf) throws Exception {
        try (InputStream inputStream = archivoPdf.getInputStream();
             PDDocument documento = PDDocument.load(inputStream)) {
            PDFTextStripper textStripper = new PDFTextStripper();
            return textStripper.getText(documento);
        }
    }

    /**
     * Envía el texto de una guía docente a la API de OpenAI y solicita su estructuración.
     * Utiliza técnicas de "Prompt Engineering" para obligar a la IA a devolver un JSON
     * que encaje exactamente con el modelo de datos de nuestra aplicación.
     *
     * @param textoPdf El texto bruto extraído previamente del PDF.
     * @return Una cadena en formato JSON estructurado lista para ser procesada.
     * @throws Exception Si la comunicación con la API de OpenAI falla o el JSON devuelto es inválido.
     */
    public String obtenerJsonIA(String textoPdf) throws Exception {
        
        String url = "https://api.openai.com/v1/chat/completions";
        
        // DEFINICIÓN DEL PROMPT (Instrucciones para la IA)
        // Se define un rol de experto, un objetivo claro y un esquema de salida estricto.
        String prompt = "Actúa como un experto en extracción de datos estructurados. " +
                "Analiza el siguiente texto extraído de un PDF de una guía docente universitaria. " +
                "Tu objetivo es devolver ESTRICTAMENTE un objeto JSON válido que coincida con este formato exacto, " +
                "rellenando los campos con la información que encuentres. Si no encuentras algo, déjalo vacío (\"\"). " +
                "NO devuelvas absolutamente nada más que el JSON, ni bloques de código (```json), ni saludos. \n\n" +
                "IMPORTANTE: Presta especial atención a extraer las 'Competencias', el 'Cronograma' y las 'Actividades de evaluación' " +
                "como Listas de Objetos (JSON Arrays) siguiendo estrictamente la estructura proporcionada.\n\n" +
                "FORMATO REQUERIDO:\n" +
                "{\n" +
                "  \"Datos Generales\": { \"Nombre asignatura\": \"\", \"Código asignatura\": \"\", \"No créditos\": \"\", \"Titulación\": \"\", \"Curso\": \"\", \"Curso implantación\": \"\", \"Año plan de estudios\": \"\", \"Semestre\": \"\", \"Período de impartición\": \"\", \"Carácter\": \"\", \"Idioma\": \"\", \"Modalidad\": \"\", \"Módulo\": \"\", \"Rama de conocimiento\": \"\", \"Área\": \"\", \"Departamento\": \"\", \"Centro\": \"\" },\n" +
                "  \"Profesorado\": [ { \"Nombre\": \"\", \"Email\": \"\", \"Telefono\": \"\", \"Despacho\": \"\", \"Horario tutorías\": \"\", \"URL web\": \"\", \"Grupo\": \"\", \"Es coordinador\": false } ],\n" +
                "  \"Otros Datos\": {\n" +
                "    \"Conocimientos previos recomendados\": [ \"conocimiento 1\", \"conocimiento 2\" ],\n" +
                "    \"Objetivos\": [ \"objetivo 1\", \"objetivo 2\" ],\n" +
                "    \"Contenidos\": [ { \"Tema\": \"\", \"Nivel\": 0 } ],\n" +
                "    \"Metodología\": \"\",\n" +
                "    \"Evaluación\": \"\",\n" +
                "    \"Normas realización pruebas\": \"\",\n" +
                "    \"Ausencia máxima\": \"\",\n" +
                "    \"Otra información\": \"\",\n" +
                "    \"Competencias\": [\n" +
                "      { \"Tipo\": \"Básica, General, Específica o Transversal\", \"Código\": \"\", \"Descripción\": \"\" }\n" +
                "    ],\n" +
                "    \"Bibliografía\": [\n" +
                "      { \"Tipo\": \"Libro, Recurso Web, Artículo u Otro\", \"Referencia\": \"\" }\n" +
                "    ],\n" +
                "    \"Actividades de evaluación\": [\n" +
                "      { \"Nombre\": \"\", \"Descripción\": \"\", \"Tipo\": \"Progresiva, Global o Extraordinaria\", \"Peso\": \"\", \"Nota mínima\": \"\" }\n" +
                "    ],\n" +
                "    \"Cronograma\": [\n" +
                "      { \"Semana\": \"\", \"Actividades\": [ { \"Tipo\": \"Lección Magistral, Práctica o Evaluación\", \"Descripción\": \"\", \"Horas\": \"\" } ] }\n" +
                "    ]\n" +
                "  }\n" +
                "}\n\n" +
                "TEXTO DE LA GUÍA A ANALIZAR:\n";

        // CONFIGURACIÓN DE LA PETICIÓN
        Map<String, Object> systemMessage = Map.of("role", "system", "content", prompt);
        Map<String, Object> userMessage = Map.of("role", "user", "content", "TEXTO DEL PDF:\n" + textoPdf);

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o-mini", // Modelo optimizado para velocidad y coste
                "messages", List.of(systemMessage, userMessage),
                "temperature", 0.1 // Temperatura baja para maximizar la precisión y evitar "alucinaciones"
        );

        // EJECUCIÓN DE LA LLAMADA HTTP
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        String response = restTemplate.postForObject(url, entity, String.class);

        // PROCESAMIENTO DE LA RESPUESTA
        // La API de OpenAI devuelve un objeto complejo; extraemos solo el contenido del mensaje.
        JsonNode rootNode = objectMapper.readTree(response);
        String jsonResult = rootNode.path("choices").get(0).path("message").path("content").asText();

        // LIMPIEZA: Eliminamos posibles etiquetas de Markdown que la IA pueda incluir por error
        jsonResult = jsonResult.replace("```json", "").replace("```", "").trim();

        return jsonResult;
    }
}