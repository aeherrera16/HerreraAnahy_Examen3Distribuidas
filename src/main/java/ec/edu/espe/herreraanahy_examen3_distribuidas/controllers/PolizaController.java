package ec.edu.espe.herreraanahy_examen3_distribuidas.controllers;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Poliza.EstadoPoliza;
import ec.edu.espe.herreraanahy_examen3_distribuidas.services.PolizaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/polizas")
@CrossOrigin(origins = "*")
public class PolizaController {

    @Autowired
    private PolizaService polizaService;

    @GetMapping
    public ResponseEntity<List<Poliza>> getAllPolizas() {
        List<Poliza> polizas = polizaService.findAll();
        return ResponseEntity.ok(polizas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Poliza> getPolizaById(@PathVariable Long id) {
        return polizaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/numero/{numeroPoliza}")
    public ResponseEntity<Poliza> getPolizaByNumero(@PathVariable String numeroPoliza) {
        return polizaService.findByNumeroPoliza(numeroPoliza)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Poliza>> getPolizasByCliente(@PathVariable Long clienteId) {
        List<Poliza> polizas = polizaService.findByClienteId(clienteId);
        return ResponseEntity.ok(polizas);
    }

    @GetMapping("/plan/{planSeguroId}")
    public ResponseEntity<List<Poliza>> getPolizasByPlanSeguro(@PathVariable Long planSeguroId) {
        List<Poliza> polizas = polizaService.findByPlanSeguroId(planSeguroId);
        return ResponseEntity.ok(polizas);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Poliza>> getPolizasByEstado(@PathVariable EstadoPoliza estado) {
        List<Poliza> polizas = polizaService.findByEstado(estado);
        return ResponseEntity.ok(polizas);
    }

    @PostMapping
    public ResponseEntity<Poliza> createPoliza(@Valid @RequestBody Poliza poliza) {
        Poliza nuevaPoliza = polizaService.save(poliza);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPoliza);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Poliza> updatePoliza(@PathVariable Long id, @Valid @RequestBody Poliza poliza) {
        Poliza polizaActualizada = polizaService.update(id, poliza);
        return ResponseEntity.ok(polizaActualizada);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Poliza> cambiarEstadoPoliza(@PathVariable Long id, @RequestBody Map<String, String> request) {
        EstadoPoliza nuevoEstado = EstadoPoliza.valueOf(request.get("estado"));
        Poliza polizaActualizada = polizaService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(polizaActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoliza(@PathVariable Long id) {
        polizaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
