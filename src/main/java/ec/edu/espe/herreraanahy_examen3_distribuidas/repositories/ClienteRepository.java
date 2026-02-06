package ec.edu.espe.herreraanahy_examen3_distribuidas.repositories;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByIdentificacion(String identificacion);

    Optional<Cliente> findByEmail(String email);

    boolean existsByIdentificacion(String identificacion);

    boolean existsByEmail(String email);
}
