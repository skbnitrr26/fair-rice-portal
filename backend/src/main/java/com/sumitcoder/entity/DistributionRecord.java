package com.sumitcoder.entity;

import com.fasterxml.jackson.annotation.JsonBackReference; // <-- IMPORT THIS
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "distribution_records")
@Getter
@Setter
public class DistributionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id", nullable = false)
    @JsonBackReference // <-- ADD THIS ANNOTATION
    private Family family;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal riceReceivedKg;

    @Column(nullable = false)
    private LocalDate distributionDate;

    @Lob
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

