package ec.edu.espe.herreraanahy_examen3_distribuidas.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "planes_seguro")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanSeguro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del plan es obligatorio")
    @Size(max = 100, message = "El nombre debe tener máximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotNull(message = "El tipo de seguro es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoSeguro tipo;

    @NotNull(message = "La prima base es obligatoria")
    @DecimalMin(value = "0.01", message = "La prima base debe ser mayor a 0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal primaBase;

    @NotNull(message = "La cobertura máxima es obligatoria")
    @DecimalMin(value = "0.01", message = "La cobertura máxima debe ser mayor a 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal coberturaMax;

    @OneToMany(mappedBy = "planSeguro", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Poliza> polizas;

    public enum TipoSeguro {
        VIDA, AUTO, SALUD
    }
}
