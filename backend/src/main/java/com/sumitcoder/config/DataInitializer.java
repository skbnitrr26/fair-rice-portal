package com.sumitcoder.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sumitcoder.entity.AdminUser;
import com.sumitcoder.repository.AdminUserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // These values are read from your application.properties file
    @Value("${app.initial-admin.username}")
    private String initialAdminUsername;

    @Value("${app.initial-admin.password}")
    private String initialAdminPassword;

    @Override
    public void run(String... args) throws Exception {
        // This code runs on application startup
        // Check if there are any admin users in the database
        if (adminUserRepository.count() == 0) {
            // If no admins exist, create the initial one
            AdminUser initialAdmin = new AdminUser();
            initialAdmin.setUsername(initialAdminUsername);
            // IMPORTANT: Always encode the password before saving!
            initialAdmin.setPassword(passwordEncoder.encode(initialAdminPassword));
            
            adminUserRepository.save(initialAdmin);
            
            System.out.println("***********************************************************");
            System.out.println("Initial admin user created with username: " + initialAdminUsername);
            System.out.println("***********************************************************");
        }
    }
}
