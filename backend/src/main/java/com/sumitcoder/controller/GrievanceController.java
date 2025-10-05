package com.sumitcoder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sumitcoder.dto.GrievanceCommentDto;
import com.sumitcoder.dto.GrievanceDto;
import com.sumitcoder.service.GrievanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/grievances")
public class GrievanceController {

    @Autowired
    private GrievanceService grievanceService;

    @PostMapping(value = "/public", consumes = { "multipart/form-data" })
    public ResponseEntity<GrievanceDto> createGrievance(
            @RequestPart("grievance") String grievanceJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {
        
        ObjectMapper objectMapper = new ObjectMapper();
        GrievanceDto grievanceDto = objectMapper.readValue(grievanceJson, GrievanceDto.class);
        
        GrievanceDto createdGrievance = grievanceService.createGrievance(grievanceDto, imageFile);
        return new ResponseEntity<>(createdGrievance, HttpStatus.CREATED);
    }

    @GetMapping("/public/status/{trackingId}")
    public ResponseEntity<GrievanceDto> getGrievanceStatus(@PathVariable String trackingId) {
        GrievanceDto grievanceDto = grievanceService.getGrievanceByTrackingId(trackingId);
        return ResponseEntity.ok(grievanceDto);
    }

    /**
     * UPDATED: Secure endpoint for an admin to view grievances.
     * It now supports pagination to handle a large number of grievances efficiently.
     * @param page The page number to retrieve (defaults to 0).
     * @param size The number of grievances per page (defaults to 10).
     * @return A Page object containing grievances and pagination details.
     */
    @GetMapping("/admin")
    public ResponseEntity<Page<GrievanceDto>> getAllGrievances(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Create a Pageable object to fetch grievances, sorted by newest first
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<GrievanceDto> grievancesPage = grievanceService.getAllGrievances(pageable);
        return ResponseEntity.ok(grievancesPage);
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<GrievanceDto> updateGrievanceStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        GrievanceDto updatedGrievance = grievanceService.updateGrievanceStatus(id, status);
        return ResponseEntity.ok(updatedGrievance);
    }

    @PostMapping("/admin/{grievanceId}/comments")
    public ResponseEntity<GrievanceCommentDto> addComment(
            @PathVariable Long grievanceId,
            @Valid @RequestBody GrievanceCommentDto commentDto) {
        GrievanceCommentDto createdComment = grievanceService.addCommentToGrievance(grievanceId, commentDto);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }
}

