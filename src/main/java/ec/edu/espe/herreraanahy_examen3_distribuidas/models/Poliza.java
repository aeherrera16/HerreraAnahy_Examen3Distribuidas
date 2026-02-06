package ec.edu.espe.herreraanahy_examen3_distribuidas.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "polizas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Poliza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El número de póliza es obligatorio")
    @Size(max = 50, message = "El número de póliza debe tener máximo 50 caracteres")
    @Column(nullable = false, unique = true, length = 50)
    private String numeroPoliza;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(nullable = false)
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    @Column(nullable = false)
    private LocalDate fechaFin;

    @NotNull(message = "La prima mensual es obligatoria")
    @DecimalMin(value = "0.01", message = "La prima mensual debe ser mayor a 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal primaMensual;

    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPoliza estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    @NotNull(message = "El cliente es obligatorio")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_seguro_id", nullable = false)
    @NotNull(message = "El plan de seguro es obligatorio")
    private PlanSeguro planSeguro;

    public enum EstadoPoliza {
        ACTIVA, CANCELADA
    }
}
