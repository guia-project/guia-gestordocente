package es.guiasdocentes.backend.controllers;

import org.apache.any23.Any23;
import org.apache.any23.source.DocumentSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import es.guiasdocentes.backend.models.UsuarioDocument;

import es.guiasdocentes.backend.services.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.multipart.MultipartFile;

import es.guiasdocentes.backend.dto.GuiaDocenteDto;
import es.guiasdocentes.backend.models.GuiaDocenteDocument;
import es.guiasdocentes.backend.repositories.GuiaDocenteRepository;
import es.guiasdocentes.backend.services.AIService;

import org.apache.any23.source.StringDocumentSource;
import org.apache.any23.writer.TurtleWriter;
import org.apache.any23.writer.TripleHandler;
import java.io.ByteArrayOutputStream;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

/**
 * Controlador REST que gestiona todas las operaciones relacionadas con las Guías Docentes.
 * Actúa como la interfaz de comunicación (API) entre el Frontend (React) y el Backend (Spring Boot).
 */
@RestController
@RequestMapping("/api/guias")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost", "http://localhost:80"})
public class GuiaDocenteController {

    private final GuiaDocenteRepository repository;
    private final PdfService pdfService;
    private final AIService aiService;
    private final SpringTemplateEngine templateEngine;

    /**
     * Constructor del controlador con Inyección de Dependencias.
     * Spring Boot se encarga automáticamente de proporcionarnos las instancias de los servicios y repositorios.
     *
     * @param repository Repositorio para operaciones CRUD en MongoDB.
     * @param pdfService Servicio encargado de la lógica de generación de PDFs.
     * @param aiService  Servicio para procesar texto usando Inteligencia Artificial Generativa.
     * @param templateEngine Motor de plantillas Thymeleaf.
     */
    @Autowired
    public GuiaDocenteController(GuiaDocenteRepository repository, PdfService pdfService, AIService aiService, SpringTemplateEngine templateEngine) {
        this.repository = repository;
        this.pdfService = pdfService;
        this.aiService = aiService;
        this.templateEngine = templateEngine;
    }

    /**
     * Extrae el ID del usuario que está haciendo la petición basándose en su Token JWT.
     * @return El ID del usuario autenticado.
     * @throws RuntimeException Si la petición llega sin usuario autenticado.
     */
    private String obtenerIdUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UsuarioDocument) {
            UsuarioDocument usuario = (UsuarioDocument) auth.getPrincipal();
            return usuario.getId();
        }
        throw new RuntimeException("No se ha encontrado un usuario autenticado");
    }

    /**
     * Crea y guarda una nueva Guía Docente en la base de datos asociada al usuario actual.
     *
     * @param nuevaGuiaDto Objeto que contiene los datos de la guía enviados desde el frontend.
     * @return El documento guardado en la base de datos.
     */
    @PostMapping("/crear")
    public ResponseEntity<?> crearGuia(@RequestBody GuiaDocenteDto nuevaGuiaDto) {
        try {
            GuiaDocenteDocument documento = new GuiaDocenteDocument();
            documento.setNombreDocumento(nuevaGuiaDto.getNombreDocumento());
            documento.setDatosGenerales(nuevaGuiaDto.getDatosGenerales());
            documento.setProfesorado(nuevaGuiaDto.getProfesorado());
            documento.setOtrosDatos(nuevaGuiaDto.getOtrosDatos());

            // 1. Obtenemos el ID del profesor que está logueado
            String miUsuarioId = obtenerIdUsuarioAutenticado();
            // 2. Asociamos la guía a ese profesor
            documento.setUsuarioId(miUsuarioId);

            GuiaDocenteDocument guardado = repository.save(documento);
            System.out.println("Guardado en MongoDB con el ID: " + guardado.getId() + " para el usuario: " + miUsuarioId);
            
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al crear la guía");
        }
    }

    /**
     * Recupera todas las guías docentes almacenadas que pertenecen al usuario autenticado.
     *
     * @return Una lista con los documentos de guías docentes del profesor.
     */
    @GetMapping("/todas")
    public ResponseEntity<?> obtenerTodas() {
        try {
            // Obtenemos solo las guías del usuario logueado usando el nuevo método del repositorio
            String miUsuarioId = obtenerIdUsuarioAutenticado();
            List<GuiaDocenteDocument> misGuias = repository.findByUsuarioId(miUsuarioId);
            return ResponseEntity.ok(misGuias);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al obtener las guías");
        }
    }

    /**
     * Genera y descarga un archivo PDF de una guía docente específica, aplicando personalizaciones.
     *
     * @param id El identificador único de la guía.
     * @param request Objeto que contiene las opciones de personalización.
     * @return Archivo PDF.
     */
    @PostMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable String id, @RequestBody PersonalizacionRequest request) {
        try {
            GuiaDocenteDocument guia = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Guía no encontrada"));
            
            String colorFormateado = "#" + (request.getColor() != null ? request.getColor() : "0056b3");
            String logoBase64 = request.getLogo();

            byte[] pdfBytes = pdfService.generarGuiaPdf(guia, colorFormateado, logoBase64);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "Guia_Docente_" + guia.getDatosGenerales().getCodigoAsignatura() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Procesa un PDF con Inteligencia Artificial.
     */
    @PostMapping("/procesar-pdf-ia")
    public ResponseEntity<String> procesarPdfConIa(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("Recibido archivo: " + file.getOriginalFilename());
            String textoPdf = aiService.extraerTextoDePdf(file);
            System.out.println("Texto extraído, analizando con IA...");
            String jsonDeGemini = aiService.obtenerJsonIA(textoPdf);
            System.out.println("Respuesta de OpenAI recibida con éxito.");
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(jsonDeGemini);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Error al procesar el PDF con IA\"}");
        }
    }

    /**
     * Elimina de forma permanente una guía docente.
     */
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarGuia(@PathVariable String id) {
        try {
            repository.deleteById(id);
            return ResponseEntity.ok("Guía eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al eliminar la guía");
        }
    }

    /**
     * Actualiza la información de una guía docente existente.
     */
    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editarGuia(@PathVariable String id, @RequestBody GuiaDocenteDto guiaActualizada) {
        try {
            GuiaDocenteDocument existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guía no encontrada"));
            
            existente.setNombreDocumento(guiaActualizada.getNombreDocumento());
            existente.setDatosGenerales(guiaActualizada.getDatosGenerales());
            existente.setProfesorado(guiaActualizada.getProfesorado());
            existente.setOtrosDatos(guiaActualizada.getOtrosDatos());
            
            repository.save(existente);
            return ResponseEntity.ok("Guía actualizada correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al actualizar la guía");
        }
    }

   @GetMapping("/descargar-turtle/{id}")
   public ResponseEntity<byte[]> descargarTurtle(@PathVariable String id) {
    try {
        GuiaDocenteDocument guia = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guía no encontrada"));

        Context context = new Context();
        context.setVariable("guia", guia);
        
        String htmlContent = templateEngine.process("guia-template", context);

        Any23 runner = new Any23();
        DocumentSource source = new StringDocumentSource(htmlContent, "https://guia.org/");
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        
        try (TripleHandler handler = new TurtleWriter(out)) {
            runner.extract(source, handler);
        }

        byte[] turtleData = out.toByteArray();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"guia_" + id + ".ttl\"")
                .contentType(MediaType.parseMediaType("text/turtle"))
                .body(turtleData);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().build();
    }
}

    /**
     * DTO interno estático utilizado específicamente para estructurar los datos
     * que React envía al solicitar la generación de un PDF personalizado.
     */
    public static class PersonalizacionRequest {
        private String color;
        private String logo;

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public String getLogo() { return logo; }
        public void setLogo(String logo) { this.logo = logo; }
    }
}