package com.example.autor.repositories;

import com.example.autor.models.entities.Autor;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

@Transactional
public interface AutorRepository extends JpaRepository<Autor, Long> {
}
