package com.sumitcoder.repository;

import com.sumitcoder.entity.Grievance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    
    Optional<Grievance> findByTrackingId(String trackingId);
    
    long countByCreatedAtAfter(LocalDateTime timestamp);

    /**
     * UPDATED: This method now finds all grievances and returns them as a paginated result.
     * The sorting (e.g., by creation date) will be handled by the Pageable object
     * passed from the service layer, so we can use the standard findAll method.
     * @param pageable The pagination information (page number, size, and sort order).
     * @return A page of grievances.
     */
    Page<Grievance> findAll(Pageable pageable);
}

