package ec.edu.espe.herreraanahy_examen3_distribuidas.services;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro.TipoSeguro;

import java.util.List;
import java.util.Optional;

public interface PlanSeguroService {

    List<PlanSeguro> findAll();

    Optional<PlanSeguro> findById(Long id);

    List<PlanSeguro> findByTipo(TipoSeguro tipo);

    PlanSeguro save(PlanSeguro planSeguro);

    PlanSeguro update(Long id, PlanSeguro planSeguro);

    void deleteById(Long id);

    boolean existsById(Long id);
}
