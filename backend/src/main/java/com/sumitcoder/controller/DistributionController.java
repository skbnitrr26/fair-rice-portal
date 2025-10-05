package com.sumitcoder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sumitcoder.dto.DistributionRecordDto;
import com.sumitcoder.service.DistributionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/records")
public class DistributionController {

    @Autowired
    private DistributionService distributionService;

    @PostMapping("/public")
    public ResponseEntity<DistributionRecordDto> createRecord(@Valid @RequestBody DistributionRecordDto recordDto) {
        DistributionRecordDto createdRecord = distributionService.createPublicRecord(recordDto);
        return new ResponseEntity<>(createdRecord, HttpStatus.CREATED);
    }

    /**
     * UPDATED: Secure endpoint for administrators to retrieve records.
     * It now accepts pagination parameters (page, size) in addition to date filters.
     * @param year The year to filter by (optional).
     * @param month The month to filter by (optional).
     * @param page The page number to retrieve (defaults to 0).
     * @param size The number of records per page (defaults to 10).
     * @return A Page object containing the records and pagination details.
     */
    @GetMapping
    public ResponseEntity<Page<DistributionRecordDto>> getAllRecords(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Create a Pageable object with sorting by ID in descending order (newest first)
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        
        Page<DistributionRecordDto> recordsPage = distributionService.getAllRecords(year, month, pageable);
        return ResponseEntity.ok(recordsPage);
    }
}

