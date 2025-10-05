package com.sumitcoder.repository;

import com.sumitcoder.entity.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    /**
     * UPDATED: This method now finds all announcements and returns them as a paginated result.
     * The sorting (e.g., by creation date) will be handled by the Pageable object
     * passed from the service layer.
     * @param pageable The pagination information (page number, size, and sort order).
     * @return A page of announcements.
     */
    Page<Announcement> findAll(Pageable pageable);
}

