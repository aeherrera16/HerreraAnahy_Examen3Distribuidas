package ec.edu.espe.herreraanahy_examen3_distribuidas.services;

import ec.edu.espe.herreraanahy_examen3_distribuidas.exceptions.ResourceNotFoundException;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro.TipoSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.repositories.PlanSeguroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PlanSeguroServiceImpl implements PlanSeguroService {

    @Autowired
    private PlanSeguroRepository planSeguroRepository;

    @Override
    public List<PlanSeguro> findAll() {
        return planSeguroRepository.findAll();
    }

    @Override
    public Optional<PlanSeguro> findById(Long id) {
        return planSeguroRepository.findById(id);
    }

    @Override
    public List<PlanSeguro> findByTipo(TipoSeguro tipo) {
        return planSeguroRepository.findByTipo(tipo);
    }

    @Override
    public PlanSeguro save(PlanSeguro planSeguro) {
        return planSeguroRepository.save(planSeguro);
    }

    @Override
    public PlanSeguro update(Long id, PlanSeguro planSeguroDetails) {
        PlanSeguro planSeguro = planSeguroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan de seguro no encontrado con id: " + id));

        planSeguro.setNombre(planSeguroDetails.getNombre());
        planSeguro.setTipo(planSeguroDetails.getTipo());
        planSeguro.setPrimaBase(planSeguroDetails.getPrimaBase());
        planSeguro.setCoberturaMax(planSeguroDetails.getCoberturaMax());

        return planSeguroRepository.save(planSeguro);
    }

    @Override
    public void deleteById(Long id) {
        if (!planSeguroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Plan de seguro no encontrado con id: " + id);
        }
        planSeguroRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return planSeguroRepository.existsById(id);
    }
}
