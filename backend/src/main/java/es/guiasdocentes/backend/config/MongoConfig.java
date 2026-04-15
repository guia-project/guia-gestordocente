package es.guiasdocentes.backend.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

/**
 * Clase de configuración manual para la conexión con MongoDB.
 * Reemplaza la autoconfiguración por defecto de Spring Boot para garantizar
 * que la aplicación se conecta exactamente a la URI proporcionada por las
 * variables de entorno (esencial para el despliegue en contenedores Docker).
 */
@Configuration
public class MongoConfig {

    /**
     * URI de conexión a la base de datos inyectada desde las propiedades de la aplicación
     * o desde las variables de entorno del sistema (ej. docker-compose.yml).
     */
    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    /**
     * Crea y configura el cliente de conexión física con el servidor de MongoDB.
     * * @return Una instancia de MongoClient conectada a la URI especificada.
     */
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(mongoUri);
    }

    /**
     * Crea la plantilla de Spring Data genérica para interactuar con MongoDB.
     * Es la herramienta principal que usan los Repositorios por debajo para 
     * realizar las consultas (CRUD) a la base de datos específica.
     * * @return Una instancia de MongoTemplate conectada a la base de datos "guiasdocentes".
     */
    @Bean
    public MongoTemplate mongoTemplate() {
        // Enlazamos el cliente creado arriba con el nombre exacto de nuestra base de datos
        return new MongoTemplate(mongoClient(), "guiasdocentes");
    }
}