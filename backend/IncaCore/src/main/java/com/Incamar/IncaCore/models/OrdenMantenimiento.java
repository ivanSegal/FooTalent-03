package com.Incamar.IncaCore.models;

import com.Incamar.IncaCore.enums.Estado;
import com.Incamar.IncaCore.enums.TipoMantenimiento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orden_mantenimiento")
public class OrdenMantenimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Embarcación (fk embarcacion_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_id", nullable = false)
    private Vessel vessel;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_mantenimiento", nullable = false)
    private TipoMantenimiento tipoMantenimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private Estado estado = Estado.SOLICITADO;

    // Usuario que crea la orden (fk usuario_peticion)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_peticion_id", nullable = false)
    private User usuarioPeticion;

    private String descripcion;

    @Column(name = "fecha_mantenimiento",
            updatable = false,
            insertable = false,
            nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaMantenimiento = LocalDateTime.now();


}
