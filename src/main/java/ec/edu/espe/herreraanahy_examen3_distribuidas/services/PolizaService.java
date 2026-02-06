package ec.edu.espe.herreraanahy_examen3_distribuidas.services;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza.EstadoPoliza;

import java.util.List;
import java.util.Optional;

public interface PolizaService {

    List<Poliza> findAll();

    Optional<Poliza> findById(Long id);

    Optional<Poliza> findByNumeroPoliza(String numeroPoliza);

    List<Poliza> findByClienteId(Long clienteId);

    List<Poliza> findByPlanSeguroId(Long planSeguroId);

    List<Poliza> findByEstado(EstadoPoliza estado);

    Poliza save(Poliza poliza);

    Poliza update(Long id, Poliza poliza);

    Poliza cambiarEstado(Long id, EstadoPoliza nuevoEstado);

    void deleteById(Long id);

    boolean existsById(Long id);
}
