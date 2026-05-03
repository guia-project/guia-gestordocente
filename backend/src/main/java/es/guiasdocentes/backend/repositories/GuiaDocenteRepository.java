package es.guiasdocentes.backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import es.guiasdocentes.backend.models.GuiaDocenteDocument;

@Repository
public interface GuiaDocenteRepository extends MongoRepository<GuiaDocenteDocument, String> {

    List<GuiaDocenteDocument> findByUsuarioId(String usuarioId);
}