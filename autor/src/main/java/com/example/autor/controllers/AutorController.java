package com.example.autor.controllers;

import com.example.autor.models.entities.Autor;
import com.example.autor.services.AutorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/autores")
public class AutorController {

    @Autowired
    private AutorService service;

    // GET /api/autores -> Listar todos
    @GetMapping
    public ResponseEntity<List<Autor>> listar() {
        return ResponseEntity.ok(service.buscarTodos());
    }

    // GET /api/autores/{id} -> Buscar uno solo
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Optional<Autor> autorOptional = service.buscarPorId(id);
        if (autorOptional.isPresent()) {
            return ResponseEntity.ok(autorOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/autores -> Crear
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Autor autor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(autor));
    }

    // PUT /api/autores/{id} -> Editar
    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@Valid @RequestBody Autor autor, @PathVariable Long id) {
        Optional<Autor> autorOptional = service.buscarPorId(id);

        if (autorOptional.isPresent()) {
            Autor autorDB = autorOptional.get();
            autorDB.setNombre(autor.getNombre());
            autorDB.setFechaNacimiento(autor.getFechaNacimiento());
            autorDB.setNacionalidad(autor.getNacionalidad());
            autorDB.setStatus(autor.getStatus());
            return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(autorDB));
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE /api/autores/{id} -> Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Optional<Autor> autorOptional = service.buscarPorId(id);
        if (autorOptional.isPresent()) {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
