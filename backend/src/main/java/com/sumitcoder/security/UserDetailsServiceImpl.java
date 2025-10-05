package com.sumitcoder.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sumitcoder.repository.AdminUserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin user not found with username: " + username));
    }
}
