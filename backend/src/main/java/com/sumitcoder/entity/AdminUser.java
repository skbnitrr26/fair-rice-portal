package com.sumitcoder.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
public class AdminUser implements UserDetails { // <-- IMPLEMENTS UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String resetToken;

    private LocalDateTime resetTokenExpiry;

    // --- Existing Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; } // This is required by UserDetails
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; } // This is required by UserDetails
    public void setPassword(String password) { this.password = password; }
    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

    // --- NEW METHODS REQUIRED BY UserDetails INTERFACE ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // For this project, every admin has the same simple role.
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // You can add logic here for account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // You can add logic here for account locking
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // You can add logic here for credential expiration
    }

    @Override
    public boolean isEnabled() {
        return true; // You can add logic here to disable users
    }
}
