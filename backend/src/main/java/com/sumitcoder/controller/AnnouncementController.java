package com.sumitcoder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sumitcoder.dto.AnnouncementDto;
import com.sumitcoder.service.AnnouncementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    /**
     * UPDATED: Public endpoint to get announcements.
     * It now supports pagination to handle a large number of announcements efficiently.
     * @param page The page number to retrieve (defaults to 0).
     * @param size The number of announcements per page (defaults to 10).
     * @return A Page object containing announcements and pagination details.
     */
    @GetMapping("/public")
    public ResponseEntity<Page<AnnouncementDto>> getPublicAnnouncements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Create a Pageable object to fetch announcements, sorted by newest first
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AnnouncementDto> announcementsPage = announcementService.getAllAnnouncements(pageable);
        return ResponseEntity.ok(announcementsPage);
    }

    @PostMapping("/admin")
    public ResponseEntity<AnnouncementDto> createAnnouncement(@Valid @RequestBody AnnouncementDto announcementDto) {
        return new ResponseEntity<>(announcementService.createAnnouncement(announcementDto), HttpStatus.CREATED);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<AnnouncementDto> updateAnnouncement(@PathVariable Long id, @Valid @RequestBody AnnouncementDto announcementDto) {
        AnnouncementDto updatedAnnouncement = announcementService.updateAnnouncement(id, announcementDto);
        return ResponseEntity.ok(updatedAnnouncement);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}

