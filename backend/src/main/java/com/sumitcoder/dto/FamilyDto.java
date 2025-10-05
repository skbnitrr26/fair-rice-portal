package com.sumitcoder.dto;

public class FamilyDto {

    private Long id;
    private String familyHeadName;
    private String contactNumber;
    private int numMembers;
    private String villageName;
    private String uniqueFamilyId;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFamilyHeadName() {
        return familyHeadName;
    }

    public void setFamilyHeadName(String familyHeadName) {
        this.familyHeadName = familyHeadName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public int getNumMembers() {
        return numMembers;
    }

    public void setNumMembers(int numMembers) {
        this.numMembers = numMembers;
    }

    public String getVillageName() {
        return villageName;
    }

    public void setVillageName(String villageName) {
        this.villageName = villageName;
    }
    
    public String getUniqueFamilyId() {
        return uniqueFamilyId;
    }
    
    public void setUniqueFamilyId(String uniqueFamilyId) {
        this.uniqueFamilyId = uniqueFamilyId;
    }
}

