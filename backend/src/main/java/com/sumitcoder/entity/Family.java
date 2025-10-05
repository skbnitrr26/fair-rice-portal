package com.sumitcoder.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference; // <-- IMPORT THIS
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "families")
@Getter
@Setter
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String familyHeadName;

    @Column(nullable = false, unique = true)
    private String contactNumber;

    @Column(nullable = false)
    private Integer numMembers;

    private String villageName;

    private String uniqueFamilyId;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // <-- ADD THIS ANNOTATION
    private List<DistributionRecord> distributionRecords;
}

