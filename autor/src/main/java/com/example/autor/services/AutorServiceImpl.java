package com.example.autor.services;

import com.example.autor.models.entities.Autor;
import com.example.autor.repositories.AutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AutorServiceImpl implements AutorService {

    @Autowired
    private AutorRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<Autor> buscarTodos() {
        return repository.findAll();
    }

    @Override
    public Optional<Autor> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public Autor guardar(Autor autor) {
        return repository.save(autor);
    }

    @Override
    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
