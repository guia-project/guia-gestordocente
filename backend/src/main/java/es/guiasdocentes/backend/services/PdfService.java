package es.guiasdocentes.backend.services;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import es.guiasdocentes.backend.models.GuiaDocenteDocument;

import java.io.ByteArrayOutputStream;

/**
 * Servicio encargado de la generación de documentos PDF.
 * Actúa como el "motor de renderizado" de la aplicación, utilizando Thymeleaf para 
 * inyectar datos dinámicos en una plantilla HTML, y Flying Saucer (ITextRenderer) 
 * para convertir ese HTML resultante en un archivo PDF binario.
 */
@Service
public class PdfService {

    private final TemplateEngine templateEngine;

    /**
     * Constructor del servicio con Inyección de Dependencias.
     *
     * @param templateEngine Motor de plantillas de Thymeleaf proporcionado por Spring Boot.
     */
    public PdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    /**
     * Genera un archivo PDF personalizado a partir de los datos de una Guía Docente.
     * * El proceso consta de dos fases:
     * 1. Creación del HTML: Se inyectan las variables (datos, color, logo) en 'guia-template.html'.
     * 2. Creación del PDF: Se "imprime" el HTML renderizado a un flujo de bytes (byte array).
     *
     * @param guia       El documento de la base de datos con toda la información académica.
     * @param colorHex   El color hexadecimal elegido por el usuario (ej. "#0056b3") para personalizar los títulos.
     * @param logoBase64 La imagen del logotipo de la universidad codificada en formato Base64.
     * @return Un array de bytes (byte[]) que representa el archivo PDF físico, listo para ser descargado por el cliente.
     * @throws Exception Si ocurre algún error durante el parseo del HTML o la generación del PDF.
     */
    public byte[] generarGuiaPdf(GuiaDocenteDocument guia, String colorHex, String logoBase64) throws Exception {
        
        // 1. Cargamos los datos de la guía en el "Contexto" de Thymeleaf
        // El Contexto es como una caja donde metemos las variables que el HTML necesita leer.
        Context context = new Context();
        context.setVariable("guia", guia);
        context.setVariable("colorHex", colorHex);
        context.setVariable("logoBase64", logoBase64);

        // 2. Procesamos la plantilla HTML ('guia-template.html' ubicada en src/main/resources/templates)
        // Thymeleaf sustituirá etiquetas como th:text="${guia.nombreDocumento}" por los datos reales.
        String htmlProcesado = templateEngine.process("guia-template", context);

        // 3. Preparamos el flujo de memoria donde escribiremos el archivo PDF resultante
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        // 4. Usamos Flying Saucer (ITextRenderer) para convertir el código HTML en un PDF visual
        ITextRenderer renderer = new ITextRenderer();
        
        // Configuramos el renderizador con nuestro HTML parseado
        renderer.setDocumentFromString(htmlProcesado);
        renderer.layout(); // Calcula márgenes, posiciones y saltos de página
        renderer.createPDF(outputStream); // "Imprime" el resultado en la memoria (outputStream)

        // 5. Devolvemos el resultado en bruto (bytes)
        return outputStream.toByteArray();
    }
}