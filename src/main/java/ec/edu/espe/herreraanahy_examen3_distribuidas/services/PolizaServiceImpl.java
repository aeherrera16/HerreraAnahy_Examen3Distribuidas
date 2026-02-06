package ec.edu.espe.herreraanahy_examen3_distribuidas.services;

import ec.edu.espe.herreraanahy_examen3_distribuidas.exceptions.ResourceNotFoundException;
import ec.edu.espe.herreraanahy_examen3_distribuidas.exceptions.DuplicateResourceException;
import ec.edu.espe.herreraanahy_examen3_distribuidas.exceptions.BusinessException;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza.EstadoPoliza;
import ec.edu.espe.herreraanahy_examen3_distribuidas.repositories.PolizaRepository;
import ec.edu.espe.herreraanahy_examen3_distribuidas.repositories.ClienteRepository;
import ec.edu.espe.herreraanahy_examen3_distribuidas.repositories.PlanSeguroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PolizaServiceImpl implements PolizaService {

    @Autowired
    private PolizaRepository polizaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PlanSeguroRepository planSeguroRepository;

    @Override
    public List<Poliza> findAll() {
        return polizaRepository.findAll();
    }

    @Override
    public Optional<Poliza> findById(Long id) {
        return polizaRepository.findById(id);
    }

    @Override
    public Optional<Poliza> findByNumeroPoliza(String numeroPoliza) {
        return polizaRepository.findByNumeroPoliza(numeroPoliza);
    }

    @Override
    public List<Poliza> findByClienteId(Long clienteId) {
        return polizaRepository.findByClienteId(clienteId);
    }

    @Override
    public List<Poliza> findByPlanSeguroId(Long planSeguroId) {
        return polizaRepository.findByPlanSeguroId(planSeguroId);
    }

    @Override
    public List<Poliza> findByEstado(EstadoPoliza estado) {
        return polizaRepository.findByEstado(estado);
    }

    @Override
    public Poliza save(Poliza poliza) {
        // Validar que no exista duplicado por número de póliza
        if (polizaRepository.existsByNumeroPoliza(poliza.getNumeroPoliza())) {
            throw new DuplicateResourceException("Ya existe una póliza con el número: " + poliza.getNumeroPoliza());
        }

        // Validar que el cliente existe
        if (poliza.getCliente() != null && poliza.getCliente().getId() != null) {
            if (!clienteRepository.existsById(poliza.getCliente().getId())) {
                throw new ResourceNotFoundException("Cliente no encontrado con id: " + poliza.getCliente().getId());
            }
        }

        // Validar que el plan de seguro existe
        if (poliza.getPlanSeguro() != null && poliza.getPlanSeguro().getId() != null) {
            if (!planSeguroRepository.existsById(poliza.getPlanSeguro().getId())) {
                throw new ResourceNotFoundException(
                        "Plan de seguro no encontrado con id: " + poliza.getPlanSeguro().getId());
            }
        }

        // Validar fechas
        if (poliza.getFechaInicio() != null && poliza.getFechaFin() != null) {
            if (poliza.getFechaFin().isBefore(poliza.getFechaInicio())) {
                throw new BusinessException("La fecha de fin debe ser posterior a la fecha de inicio");
            }
        }

        return polizaRepository.save(poliza);
    }

    @Override
    public Poliza update(Long id, Poliza polizaDetails) {
        Poliza poliza = polizaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Póliza no encontrada con id: " + id));

        // Verificar si el número de póliza cambió y ya existe
        if (!poliza.getNumeroPoliza().equals(polizaDetails.getNumeroPoliza())
                && polizaRepository.existsByNumeroPoliza(polizaDetails.getNumeroPoliza())) {
            throw new DuplicateResourceException(
                    "Ya existe una póliza con el número: " + polizaDetails.getNumeroPoliza());
        }

        // Validar fechas
        if (polizaDetails.getFechaInicio() != null && polizaDetails.getFechaFin() != null) {
            if (polizaDetails.getFechaFin().isBefore(polizaDetails.getFechaInicio())) {
                throw new BusinessException("La fecha de fin debe ser posterior a la fecha de inicio");
            }
        }

        poliza.setNumeroPoliza(polizaDetails.getNumeroPoliza());
        poliza.setFechaInicio(polizaDetails.getFechaInicio());
        poliza.setFechaFin(polizaDetails.getFechaFin());
        poliza.setPrimaMensual(polizaDetails.getPrimaMensual());
        poliza.setEstado(polizaDetails.getEstado());

        // Actualizar cliente si se proporciona
        if (polizaDetails.getCliente() != null && polizaDetails.getCliente().getId() != null) {
            poliza.setCliente(clienteRepository.findById(polizaDetails.getCliente().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Cliente no encontrado con id: " + polizaDetails.getCliente().getId())));
        }

        // Actualizar plan de seguro si se proporciona
        if (polizaDetails.getPlanSeguro() != null && polizaDetails.getPlanSeguro().getId() != null) {
            poliza.setPlanSeguro(planSeguroRepository.findById(polizaDetails.getPlanSeguro().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Plan de seguro no encontrado con id: " + polizaDetails.getPlanSeguro().getId())));
        }

        return polizaRepository.save(poliza);
    }

    @Override
    public Poliza cambiarEstado(Long id, EstadoPoliza nuevoEstado) {
        Poliza poliza = polizaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Póliza no encontrada con id: " + id));

        poliza.setEstado(nuevoEstado);
        return polizaRepository.save(poliza);
    }

    @Override
    public void deleteById(Long id) {
        if (!polizaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Póliza no encontrada con id: " + id);
        }
        polizaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return polizaRepository.existsById(id);
    }
}
