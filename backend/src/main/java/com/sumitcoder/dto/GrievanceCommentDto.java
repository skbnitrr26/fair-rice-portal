package com.sumitcoder.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class GrievanceCommentDto {

    private Long id;

    @NotBlank(message = "Comment content cannot be empty")
    private String content;

    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
