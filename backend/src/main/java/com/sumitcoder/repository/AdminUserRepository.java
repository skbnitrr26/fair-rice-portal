package com.sumitcoder.repository;

import com.sumitcoder.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    
    // This method is used for logging in
    Optional<AdminUser> findByUsername(String username);

    // NEW: This method will be used to find a user by their unique password reset token
    Optional<AdminUser> findByResetToken(String resetToken);
}

