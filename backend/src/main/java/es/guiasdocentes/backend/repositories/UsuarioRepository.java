package es.guiasdocentes.backend.repositories;

import es.guiasdocentes.backend.models.UsuarioDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<UsuarioDocument, String> {
    Optional<UsuarioDocument> findByEmail(String email);
}