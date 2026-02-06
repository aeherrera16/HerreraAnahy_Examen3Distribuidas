package ec.edu.espe.herreraanahy_examen3_distribuidas.services;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Cliente;

import java.util.List;
import java.util.Optional;

public interface ClienteService {

    List<Cliente> findAll();

    Optional<Cliente> findById(Long id);

    Optional<Cliente> findByIdentificacion(String identificacion);

    Cliente save(Cliente cliente);

    Cliente update(Long id, Cliente cliente);

    void deleteById(Long id);

    boolean existsById(Long id);
}
