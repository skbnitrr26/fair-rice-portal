package com.sumitcoder.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    private String trackingId;

    @Column(nullable = false)
    private String subject;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String contactInfo;

    private String imageFilename; 

    @Column(nullable = false)
    private String status = "New";

    @CreationTimestamp
    private LocalDateTime createdAt;

    // NEW: Relationship to store all comments for this grievance
    @OneToMany(mappedBy = "grievance", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("createdAt ASC") // Show oldest comments first
    private List<GrievanceComment> comments = new ArrayList<>();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTrackingId() { return trackingId; }
    public void setTrackingId(String trackingId) { this.trackingId = trackingId; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public String getImageFilename() { return imageFilename; }
    public void setImageFilename(String imageFilename) { this.imageFilename = imageFilename; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // NEW: Getters and setters for the comments list
    public List<GrievanceComment> getComments() { return comments; }
    public void setComments(List<GrievanceComment> comments) { this.comments = comments; }
}

