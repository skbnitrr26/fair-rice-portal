package com.sumitcoder.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sumitcoder.entity.Family;

import java.util.Optional;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    
    Optional<Family> findByContactNumber(String contactNumber);

    /**
     * UPDATED: This method now finds all families and returns them as a paginated result.
     * The sorting will be handled by the Pageable object passed from the service layer.
     * @param pageable The pagination information (page number, size, and sort order).
     * @return A page of families.
     */
    Page<Family> findAll(Pageable pageable);
}

