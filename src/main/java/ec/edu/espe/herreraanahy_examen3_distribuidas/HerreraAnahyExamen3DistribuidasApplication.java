package ec.edu.espe.herreraanahy_examen3_distribuidas;

import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Cliente;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.PlanSeguro.TipoSeguro;
import ec.edu.espe.herreraanahy_examen3_distribuidas.repositories.ClienteRepository;
import ec.edu.espe.herreraanahy_examen3_distribuidas.repositories.PlanSeguroRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class HerreraAnahyExamen3DistribuidasApplication {

    public static void main(String[] args) {
        SpringApplication.run(HerreraAnahyExamen3DistribuidasApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(ClienteRepository clienteRepo, PlanSeguroRepository planRepo) {
        return args -> {
            // Datos iniciales de Clientes
            if (clienteRepo.count() == 0) {
                clienteRepo.save(
                        createCliente("Juan Carlos Pérez García", "1712345678", "juan.perez@email.com", "0991234567"));
                clienteRepo.save(createCliente("María Elena López Sánchez", "1723456789", "maria.lopez@email.com",
                        "0982345678"));
                clienteRepo.save(createCliente("Carlos Alberto Martínez", "1734567890", "carlos.martinez@email.com",
                        "0973456789"));
                clienteRepo.save(createCliente("Ana Lucía Rodríguez Mora", "1745678901", "ana.rodriguez@email.com",
                        "0964567890"));
                clienteRepo.save(createCliente("Pedro José González Villa", "1756789012", "pedro.gonzalez@email.com",
                        "0955678901"));
                System.out.println("✅ Clientes de prueba creados");
            }

            // Datos iniciales de Planes de Seguro
            if (planRepo.count() == 0) {
                planRepo.save(createPlan("Plan Vida Básico", TipoSeguro.VIDA, 25.00, 50000.00));
                planRepo.save(createPlan("Plan Vida Premium", TipoSeguro.VIDA, 75.00, 150000.00));
                planRepo.save(createPlan("Plan Auto Básico", TipoSeguro.AUTO, 35.00, 25000.00));
                planRepo.save(createPlan("Plan Auto Completo", TipoSeguro.AUTO, 85.00, 75000.00));
                planRepo.save(createPlan("Plan Salud Individual", TipoSeguro.SALUD, 45.00, 30000.00));
                planRepo.save(createPlan("Plan Salud Familiar", TipoSeguro.SALUD, 120.00, 100000.00));
                System.out.println("✅ Planes de seguro de prueba creados");
            }
        };
    }

    private Cliente createCliente(String nombres, String identificacion, String email, String telefono) {
        Cliente cliente = new Cliente();
        cliente.setNombres(nombres);
        cliente.setIdentificacion(identificacion);
        cliente.setEmail(email);
        cliente.setTelefono(telefono);
        return cliente;
    }

    private PlanSeguro createPlan(String nombre, TipoSeguro tipo, double primaBase, double coberturaMax) {
        PlanSeguro plan = new PlanSeguro();
        plan.setNombre(nombre);
        plan.setTipo(tipo);
        plan.setPrimaBase(BigDecimal.valueOf(primaBase));
        plan.setCoberturaMax(BigDecimal.valueOf(coberturaMax));
        return plan;
    }
}
