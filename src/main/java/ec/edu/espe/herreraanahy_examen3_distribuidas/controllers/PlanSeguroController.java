package ec.edu.espe.herreraanahy_examen3_distribuidas.controllers;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro.TipoSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.services.PlanSeguroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planes-seguro")
@CrossOrigin(origins = "*")
public class PlanSeguroController {

    @Autowired
    private PlanSeguroService planSeguroService;

    @GetMapping
    public ResponseEntity<List<PlanSeguro>> getAllPlanesSeguro() {
        List<PlanSeguro> planes = planSeguroService.findAll();
        return ResponseEntity.ok(planes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanSeguro> getPlanSeguroById(@PathVariable Long id) {
        return planSeguroService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PlanSeguro>> getPlanesSeguroByTipo(@PathVariable TipoSeguro tipo) {
        List<PlanSeguro> planes = planSeguroService.findByTipo(tipo);
        return ResponseEntity.ok(planes);
    }

    @PostMapping
    public ResponseEntity<PlanSeguro> createPlanSeguro(@Valid @RequestBody PlanSeguro planSeguro) {
        PlanSeguro nuevoPlan = planSeguroService.save(planSeguro);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanSeguro> updatePlanSeguro(@PathVariable Long id,
            @Valid @RequestBody PlanSeguro planSeguro) {
        PlanSeguro planActualizado = planSeguroService.update(id, planSeguro);
        return ResponseEntity.ok(planActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlanSeguro(@PathVariable Long id) {
        planSeguroService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
