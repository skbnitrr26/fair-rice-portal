package com.sumitcoder.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails; // Import UserDetails
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sumitcoder.dto.AuthRequest;
import com.sumitcoder.dto.AuthResponse;
import com.sumitcoder.entity.AdminUser;
import com.sumitcoder.repository.AdminUserRepository;
import com.sumitcoder.security.jwt.JwtTokenProvider;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AdminUserRepository adminUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // THE CORRECT FIX: Extract the UserDetails principal from the authentication object.
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(userDetails);
        
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
    
    /**
     * This endpoint is useful for development but should be secured or removed in production.
     * The DataInitializer class is now the primary way to create the first admin user securely.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AuthRequest registerRequest) {
        if (adminUserRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        AdminUser admin = new AdminUser();
        admin.setUsername(registerRequest.getUsername());
        admin.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        adminUserRepository.save(admin);
        
        return new ResponseEntity<>("Admin user registered successfully", HttpStatus.CREATED);
    }
}

