package com.sumitcoder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sumitcoder.dto.DistributionRecordDto;
import com.sumitcoder.dto.FamilyDto;
import com.sumitcoder.entity.Family;
import com.sumitcoder.exception.ResourceNotFoundException;
import com.sumitcoder.repository.FamilyRepository;
import com.sumitcoder.service.DistributionService;

import java.util.List;

@RestController
@RequestMapping("/api/families")
public class FamilyController {

    @Autowired
    private FamilyRepository familyRepository;

    @Autowired
    private DistributionService distributionService;

    /**
     * PUBLIC endpoint for the frontend to fetch family details after entering a contact number.
     * This is used for the auto-fill feature.
     * @param contactNumber The 10-digit contact number.
     * @return The details of the corresponding family.
     */
    @GetMapping("/public/by-contact/{contactNumber}")
    public ResponseEntity<FamilyDto> getFamilyByContactNumber(@PathVariable String contactNumber) {
        Family family = familyRepository.findByContactNumber(contactNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Family not found for this contact number: " + contactNumber));
        
        FamilyDto familyDto = new FamilyDto();
        familyDto.setId(family.getId());
        familyDto.setFamilyHeadName(family.getFamilyHeadName());
        familyDto.setContactNumber(family.getContactNumber());
        familyDto.setNumMembers(family.getNumMembers());
        familyDto.setVillageName(family.getVillageName());
        familyDto.setUniqueFamilyId(family.getUniqueFamilyId());

        return ResponseEntity.ok(familyDto);
    }
    
    /**
     * SECURE endpoint to get the full distribution history for a single family.
     * This is used by the "View History" button in the admin panel.
     * @param familyId The ID of the family.
     * @return A list of all distribution records for that family.
     */
    @GetMapping("/admin/{familyId}/history")
    public ResponseEntity<List<DistributionRecordDto>> getFamilyHistory(@PathVariable Long familyId) {
        List<DistributionRecordDto> history = distributionService.getRecordsForFamily(familyId);
        return ResponseEntity.ok(history);
    }
}

