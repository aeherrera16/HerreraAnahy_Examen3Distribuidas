package ec.edu.espe.herreraanahy_examen3_distribuidas.repositories;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro.TipoSeguro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanSeguroRepository extends JpaRepository<PlanSeguro, Long> {

    List<PlanSeguro> findByTipo(TipoSeguro tipo);

    List<PlanSeguro> findByNombreContainingIgnoreCase(String nombre);
}
