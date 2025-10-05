package com.sumitcoder.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sumitcoder.dto.PasswordChangeDto;
import com.sumitcoder.dto.ResetPasswordDto;
import com.sumitcoder.entity.AdminUser;
import com.sumitcoder.exception.ResourceNotFoundException;
import com.sumitcoder.repository.AdminUserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Allows a currently logged-in admin to change their own password.
     * @param username The username of the logged-in admin.
     * @param passwordChangeDto DTO containing old and new passwords.
     */
    @Transactional
    public void changePassword(String username, PasswordChangeDto passwordChangeDto) {
        AdminUser adminUser = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        if (!passwordEncoder.matches(passwordChangeDto.getOldPassword(), adminUser.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password.");
        }

        if (!passwordChangeDto.getNewPassword().equals(passwordChangeDto.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match.");
        }

        adminUser.setPassword(passwordEncoder.encode(passwordChangeDto.getNewPassword()));
        adminUserRepository.save(adminUser);
    }

    /**
     * Generates a password reset token for a given username.
     * The token is saved to the user record with a 1-hour expiry.
     * @param username The username of the admin who forgot their password.
     * @return The generated reset token.
     */
    @Transactional
    public String generatePasswordResetToken(String username) {
        AdminUser adminUser = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with username: " + username));

        String token = UUID.randomUUID().toString();
        adminUser.setResetToken(token);
        adminUser.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token is valid for 1 hour
        
        adminUserRepository.save(adminUser);
        
        return token;
    }

    /**
     * Resets a user's password using a valid, non-expired reset token.
     * @param resetPasswordDto DTO containing the token and new password.
     */
    @Transactional
    public void resetPassword(ResetPasswordDto resetPasswordDto) {
        if (!resetPasswordDto.getNewPassword().equals(resetPasswordDto.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match.");
        }

        AdminUser adminUser = adminUserRepository.findByResetToken(resetPasswordDto.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token."));

        if (adminUser.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            adminUser.setResetToken(null);
            adminUser.setResetTokenExpiry(null);
            adminUserRepository.save(adminUser);
            throw new IllegalArgumentException("Password reset token has expired.");
        }

        adminUser.setPassword(passwordEncoder.encode(resetPasswordDto.getNewPassword()));
        adminUser.setResetToken(null);
        adminUser.setResetTokenExpiry(null);
        
        adminUserRepository.save(adminUser);
    }
}

