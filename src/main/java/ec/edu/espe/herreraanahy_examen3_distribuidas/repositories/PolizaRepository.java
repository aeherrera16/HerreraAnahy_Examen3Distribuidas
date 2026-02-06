package ec.edu.espe.herreraanahy_examen3_distribuidas.repositories;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza.EstadoPoliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolizaRepository extends JpaRepository<Poliza, Long> {

    Optional<Poliza> findByNumeroPoliza(String numeroPoliza);

    List<Poliza> findByClienteId(Long clienteId);

    List<Poliza> findByPlanSeguroId(Long planSeguroId);

    List<Poliza> findByEstado(EstadoPoliza estado);

    boolean existsByNumeroPoliza(String numeroPoliza);
}
