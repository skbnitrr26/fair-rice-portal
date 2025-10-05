package com.sumitcoder.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sumitcoder.dto.GrievanceCommentDto;
import com.sumitcoder.dto.GrievanceDto;
import com.sumitcoder.entity.Grievance;
import com.sumitcoder.entity.GrievanceComment;
import com.sumitcoder.exception.ResourceNotFoundException;
import com.sumitcoder.repository.GrievanceCommentRepository;
import com.sumitcoder.repository.GrievanceRepository;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GrievanceService {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private GrievanceCommentRepository grievanceCommentRepository;

    @Transactional
    public GrievanceDto createGrievance(GrievanceDto grievanceDto, MultipartFile imageFile) {
        Grievance grievance = new Grievance();
        grievance.setTrackingId(generateTrackingId());
        grievance.setSubject(grievanceDto.getSubject());
        grievance.setContent(grievanceDto.getContent());
        grievance.setContactInfo(grievanceDto.getContactInfo());

        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = fileStorageService.storeFile(imageFile);
            grievance.setImageFilename(filename);
        }
        
        Grievance savedGrievance = grievanceRepository.save(grievance);
        return convertToDto(savedGrievance);
    }

    /**
     * UPDATED: This method now fetches grievances in a paginated format.
     */
    public Page<GrievanceDto> getAllGrievances(Pageable pageable) {
        Page<Grievance> grievancesPage = grievanceRepository.findAll(pageable);
        return grievancesPage.map(this::convertToDto);
    }

    @Transactional
    public GrievanceDto updateGrievanceStatus(Long id, String status) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found with id: " + id));

        grievance.setStatus(status);
        Grievance updatedGrievance = grievanceRepository.save(grievance);
        return convertToDto(updatedGrievance);
    }

    public GrievanceDto getGrievanceByTrackingId(String trackingId) {
        Grievance grievance = grievanceRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found with tracking id: " + trackingId));
        return convertToDto(grievance);
    }

    /**
     * NEW: Method to add a comment to a specific grievance.
     */
    @Transactional
    public GrievanceCommentDto addCommentToGrievance(Long grievanceId, GrievanceCommentDto commentDto) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found with id: " + grievanceId));

        GrievanceComment comment = new GrievanceComment();
        comment.setContent(commentDto.getContent());
        comment.setGrievance(grievance);

        GrievanceComment savedComment = grievanceCommentRepository.save(comment);
        return convertCommentToDto(savedComment);
    }

    // --- Helper Methods ---

    private GrievanceDto convertToDto(Grievance grievance) {
        GrievanceDto dto = new GrievanceDto();
        dto.setId(grievance.getId());
        dto.setTrackingId(grievance.getTrackingId());
        dto.setSubject(grievance.getSubject());
        dto.setContent(grievance.getContent());
        dto.setContactInfo(grievance.getContactInfo());
        dto.setStatus(grievance.getStatus());
        dto.setCreatedAt(grievance.getCreatedAt());

        if (grievance.getImageFilename() != null) {
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(grievance.getImageFilename())
                    .toUriString();
            dto.setImageUrl(imageUrl);
        }
        
        if (grievance.getComments() != null) {
            dto.setComments(grievance.getComments().stream()
                    .map(this::convertCommentToDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private GrievanceCommentDto convertCommentToDto(GrievanceComment comment) {
        GrievanceCommentDto dto = new GrievanceCommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }

    private String generateTrackingId() {
        return "GRV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

