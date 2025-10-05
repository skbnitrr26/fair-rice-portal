package com.sumitcoder.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.sumitcoder.dto.ForgotPasswordDto;
import com.sumitcoder.dto.PasswordChangeDto;
import com.sumitcoder.dto.ResetPasswordDto;
import com.sumitcoder.service.AdminUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * Secure endpoint for a logged-in admin to change their own password.
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PasswordChangeDto passwordChangeDto) {
        
        try {
            adminUserService.changePassword(userDetails.getUsername(), passwordChangeDto);
            return ResponseEntity.ok().body("Password updated successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred.");
        }
    }

    /**
     * NEW: Public endpoint to request a password reset token.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordDto forgotPasswordDto) {
        try {
            String token = adminUserService.generatePasswordResetToken(forgotPasswordDto.getUsername());
            
            // SECURITY: The token is printed to the server logs for the server owner to retrieve.
            System.out.println("============================================================");
            System.out.println("Password Reset Token for user '" + forgotPasswordDto.getUsername() + "': " + token);
            System.out.println("============================================================");

            return ResponseEntity.ok().body("A password reset token has been generated. Please check the server logs.");
        } catch (Exception e) {
            // Return a generic success message to prevent attackers from checking if a username exists.
            return ResponseEntity.ok().body("If a user with that username exists, a reset token has been generated.");
        }
    }

    /**
     * NEW: Public endpoint to reset the password using a valid token.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDto resetPasswordDto) {
        try {
            adminUserService.resetPassword(resetPasswordDto);
            return ResponseEntity.ok().body("Password has been successfully reset. You can now log in with your new password.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("An unexpected error occurred.");
        }
    }
}

