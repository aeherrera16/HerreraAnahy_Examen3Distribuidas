package com.example.autor.services;

import com.example.autor.models.entities.Autor;

import java.util.List;
import java.util.Optional;

public interface AutorService {
    List<Autor> buscarTodos();
    Optional<Autor> buscarPorId(Long id);
    Autor guardar(Autor autor);
    void eliminar(Long id);
}
