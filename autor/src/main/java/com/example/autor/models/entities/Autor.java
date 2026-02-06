package com.example.autor.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "autor")
public class Autor {
    // Identificador único del autor
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    // Nombre completo del autor (varchar(100))
    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    // Fecha de nacimiento del autor (opcional)
    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;

    // Nacionalidad del autor (opcional, varchar(50))
    @Column(name = "nacionalidad", length = 50)
    private String nacionalidad;

    // Estado del autor (ACTIVE/INACTIVE) (varchar(20))
    @Column(name = "status", length = 20, nullable = false)
    private String status;

    // Constructor por defecto
    public Autor() {
    }

    // Constructor con campos
    public Autor(Long id, String nombre, Date fechaNacimiento, String nacionalidad, String status) {
        this.id = id;
        this.nombre = nombre;
        this.fechaNacimiento = fechaNacimiento;
        this.nacionalidad = nacionalidad;
        this.status = status;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
