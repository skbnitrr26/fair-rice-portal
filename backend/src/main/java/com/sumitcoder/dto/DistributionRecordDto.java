package com.sumitcoder.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

// This annotation tells the JSON converter to not include null fields in the response.
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DistributionRecordDto {

    private Long id;

    // Fields for the public submission form
    @NotBlank(message = "Family head name is required")
    private String familyHeadName;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @NotNull(message = "Number of members is required")
    @Min(value = 1, message = "There must be at least 1 family member")
    private Integer numMembers;

    @NotBlank(message = "Village name is required")
    private String villageName;

    @NotNull(message = "Rice received is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rice received must be greater than 0")
    private BigDecimal riceReceivedKg;
    
    @NotNull(message = "Distribution date is required")
    private LocalDate distributionDate;

    // Field that will be populated and returned to the client
    private String uniqueFamilyId;
    
    // Nested object to hold family details for the admin view
    private FamilyDto family;

    // NEW: Fields for the admin dashboard (calculated by the backend)
    private BigDecimal entitlementKg;
    private BigDecimal deficitKg;


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFamilyHeadName() { return familyHeadName; }
    public void setFamilyHeadName(String familyHeadName) { this.familyHeadName = familyHeadName; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public Integer getNumMembers() { return numMembers; }
    public void setNumMembers(Integer numMembers) { this.numMembers = numMembers; }
    public String getVillageName() { return villageName; }
    public void setVillageName(String villageName) { this.villageName = villageName; }
    public BigDecimal getRiceReceivedKg() { return riceReceivedKg; }
    public void setRiceReceivedKg(BigDecimal riceReceivedKg) { this.riceReceivedKg = riceReceivedKg; }
    public LocalDate getDistributionDate() { return distributionDate; }
    public void setDistributionDate(LocalDate distributionDate) { this.distributionDate = distributionDate; }
    public String getUniqueFamilyId() { return uniqueFamilyId; }
    public void setUniqueFamilyId(String uniqueFamilyId) { this.uniqueFamilyId = uniqueFamilyId; }
    public FamilyDto getFamily() { return family; }
    public void setFamily(FamilyDto family) { this.family = family; }
    
    // NEW: Getters and Setters for calculated fields
    public BigDecimal getEntitlementKg() { return entitlementKg; }
    public void setEntitlementKg(BigDecimal entitlementKg) { this.entitlementKg = entitlementKg; }
    public BigDecimal getDeficitKg() { return deficitKg; }
    public void setDeficitKg(BigDecimal deficitKg) { this.deficitKg = deficitKg; }
}

