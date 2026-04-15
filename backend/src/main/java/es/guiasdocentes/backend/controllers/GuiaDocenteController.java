package es.guiasdocentes.backend.controllers;

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

import es.guiasdocentes.backend.services.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.multipart.MultipartFile;

import es.guiasdocentes.backend.dto.GuiaDocenteDto;
import es.guiasdocentes.backend.models.GuiaDocenteDocument;
import es.guiasdocentes.backend.repositories.GuiaDocenteRepository;
import es.guiasdocentes.backend.services.AIService;

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

    /**
     * Constructor del controlador con Inyección de Dependencias.
     * Spring Boot se encarga automáticamente de proporcionarnos las instancias de los servicios y repositorios.
     *
     * @param repository Repositorio para operaciones CRUD en MongoDB.
     * @param pdfService Servicio encargado de la lógica de generación de PDFs.
     * @param aiService  Servicio para procesar texto usando Inteligencia Artificial Generativa.
     */
    @Autowired
    public GuiaDocenteController(GuiaDocenteRepository repository, PdfService pdfService, AIService aiService) {
        this.repository = repository;
        this.pdfService = pdfService;
        this.aiService = aiService;
    }

    /**
     * Crea y guarda una nueva Guía Docente en la base de datos.
     * Convierte el DTO (Data Transfer Object) recibido desde React en un Documento de MongoDB.
     *
     * @param nuevaGuiaDto Objeto que contiene los datos de la guía enviados desde el formulario frontend.
     * @return El documento guardado en la base de datos (incluyendo su nuevo ID generado).
     */
    @PostMapping("/crear")
    public GuiaDocenteDocument crearGuia(@RequestBody GuiaDocenteDto nuevaGuiaDto) {

        GuiaDocenteDocument documento = new GuiaDocenteDocument();
        documento.setNombreDocumento(nuevaGuiaDto.getNombreDocumento());
        documento.setDatosGenerales(nuevaGuiaDto.getDatosGenerales());
        documento.setProfesorado(nuevaGuiaDto.getProfesorado());
        documento.setOtrosDatos(nuevaGuiaDto.getOtrosDatos());

        GuiaDocenteDocument guardado = repository.save(documento);

        System.out.println("Guardado en MongoDB con el ID: " + guardado.getId());
        return guardado;
    }

    /**
     * Recupera todas las guías docentes almacenadas en la base de datos.
     *
     * @return Una lista con todos los documentos de guías docentes.
     */
    @GetMapping("/todas")
    public List<GuiaDocenteDocument> obtenerTodas() {
        return repository.findAll();
    }

    /**
     * Genera y descarga un archivo PDF de una guía docente específica, aplicando personalizaciones.
     * Nota: Utilizamos un método POST en lugar de GET para poder recibir un cuerpo (body) grande,
     * ya que el logo personalizado en formato Base64 puede pesar varios megabytes.
     *
     * @param id El identificador único de la guía en la base de datos.
     * @param request Objeto que contiene las opciones de personalización (color Hex y Logo Base64).
     * @return Una respuesta HTTP que contiene el archivo PDF como un flujo de bytes (byte array).
     */
    @PostMapping("/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable String id, @RequestBody PersonalizacionRequest request) {
        try {
            // Buscamos la guía en la base de datos por su ID
            GuiaDocenteDocument guia = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Guía no encontrada"));
            
            // Si no envían color, ponemos el azul por defecto
            String colorFormateado = "#" + (request.getColor() != null ? request.getColor() : "0056b3");
            String logoBase64 = request.getLogo();

            // Generamos el PDF pasándole la guía, el color y el logo
            byte[] pdfBytes = pdfService.generarGuiaPdf(guia, colorFormateado, logoBase64);

            // Configuramos la respuesta
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
     * Recibe un archivo PDF físico, extrae su texto y utiliza Inteligencia Artificial
     * para clasificar y mapear la información al formato JSON de nuestra aplicación.
     *
     * @param file El archivo PDF subido por el usuario a través del formulario Multipart.
     * @return Un String en formato JSON estructurado devuelto por la IA.
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
     * Elimina de forma permanente una guía docente de la base de datos.
     *
     * @param id El identificador único de la guía que se desea borrar.
     * @return Un mensaje de confirmación de éxito o error.
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
     * Busca la guía original por su ID y sobrescribe todos sus campos con los nuevos datos.
     *
     * @param id El identificador único de la guía a modificar.
     * @param guiaActualizada Los nuevos datos de la guía recibidos desde el formulario frontend.
     * @return Un mensaje de confirmación de éxito o error.
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