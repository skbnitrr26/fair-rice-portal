package com.sumitcoder.repository;

import com.sumitcoder.entity.DistributionRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DistributionRecordRepository extends JpaRepository<DistributionRecord, Long> {

    List<DistributionRecord> findByFamilyIdOrderByIdDesc(Long familyId);

    // This method is for getting all records with pagination
    Page<DistributionRecord> findAll(Pageable pageable);

    // This single method can be used for filtering by any date range
    // (e.g., a specific month or an entire year)
    Page<DistributionRecord> findAllByDistributionDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
}

