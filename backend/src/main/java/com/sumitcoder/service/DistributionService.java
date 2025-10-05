package com.sumitcoder.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sumitcoder.dto.DistributionRecordDto;
import com.sumitcoder.dto.FamilyDto;
import com.sumitcoder.entity.DistributionRecord;
import com.sumitcoder.entity.Family;
import com.sumitcoder.repository.DistributionRecordRepository;
import com.sumitcoder.repository.FamilyRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DistributionService {

    @Autowired
    private FamilyRepository familyRepository;

    @Autowired
    private DistributionRecordRepository distributionRecordRepository;

    @Value("${app.rice-per-person-kg}")
    private double ricePerPersonKg;

    @Transactional
    public DistributionRecordDto createPublicRecord(DistributionRecordDto recordDto) {
        Optional<Family> existingFamilyOpt = familyRepository.findByContactNumber(recordDto.getContactNumber());

        Family family;
        if (existingFamilyOpt.isPresent()) {
            family = existingFamilyOpt.get();
            family.setFamilyHeadName(recordDto.getFamilyHeadName());
            family.setNumMembers(recordDto.getNumMembers());
            family.setVillageName(recordDto.getVillageName());
        } else {
            family = new Family();
            family.setFamilyHeadName(recordDto.getFamilyHeadName());
            family.setContactNumber(recordDto.getContactNumber());
            family.setNumMembers(recordDto.getNumMembers());
            family.setVillageName(recordDto.getVillageName());
        }
        
        Family savedFamily = familyRepository.save(family);

        DistributionRecord newRecord = new DistributionRecord();
        newRecord.setRiceReceivedKg(recordDto.getRiceReceivedKg());
        newRecord.setDistributionDate(recordDto.getDistributionDate());
        newRecord.setFamily(savedFamily);

        DistributionRecord savedRecord = distributionRecordRepository.save(newRecord);
        
        return convertToDto(savedRecord);
    }

    /**
     * UPDATED: This method now correctly uses the single findAllByDistributionDateBetween
     * method for all date-based filtering.
     */
    public Page<DistributionRecordDto> getAllRecords(Integer year, Integer month, Pageable pageable) {
        Page<DistributionRecord> recordsPage;

        if (year != null && month != null) {
            // Case 1: Filter by a specific month and year
            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            recordsPage = distributionRecordRepository.findAllByDistributionDateBetween(startDate, endDate, pageable);
        } else if (year != null) {
            // Case 2: Filter by an entire year
            LocalDate startDate = LocalDate.of(year, 1, 1);
            LocalDate endDate = LocalDate.of(year, 12, 31);
            recordsPage = distributionRecordRepository.findAllByDistributionDateBetween(startDate, endDate, pageable);
        } else {
            // Case 3: No filters provided, fetch all records
            recordsPage = distributionRecordRepository.findAll(pageable);
        }

        return recordsPage.map(this::convertToDto);
    }

    public List<DistributionRecordDto> getRecordsForFamily(Long familyId) {
        return distributionRecordRepository.findByFamilyIdOrderByIdDesc(familyId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private DistributionRecordDto convertToDto(DistributionRecord record) {
        DistributionRecordDto dto = new DistributionRecordDto();
        dto.setId(record.getId());
        dto.setRiceReceivedKg(record.getRiceReceivedKg());
        dto.setDistributionDate(record.getDistributionDate());

        if (record.getFamily() != null) {
            Family familyEntity = record.getFamily();
            FamilyDto familyDto = new FamilyDto();
            familyDto.setId(familyEntity.getId());
            familyDto.setFamilyHeadName(familyEntity.getFamilyHeadName());
            familyDto.setContactNumber(familyEntity.getContactNumber());
            familyDto.setNumMembers(familyEntity.getNumMembers());
            familyDto.setVillageName(familyEntity.getVillageName());
            familyDto.setUniqueFamilyId(familyEntity.getUniqueFamilyId());
            
            dto.setFamily(familyDto);
            dto.setUniqueFamilyId(familyEntity.getUniqueFamilyId());

            BigDecimal entitlement = BigDecimal.valueOf(familyEntity.getNumMembers() * ricePerPersonKg);
            BigDecimal riceReceived = record.getRiceReceivedKg();
            BigDecimal deficit = entitlement.subtract(riceReceived).max(BigDecimal.ZERO);

            dto.setEntitlementKg(entitlement);
            dto.setDeficitKg(deficit);
        }
        
        return dto;
    }
}

