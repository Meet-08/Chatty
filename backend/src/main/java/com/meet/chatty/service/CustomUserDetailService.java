package com.meet.chatty.service;

import com.meet.chatty.error.UserException;
import com.meet.chatty.model.User;
import com.meet.chatty.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserException("User not found", 404)
        );
        return org.springframework.security.core.userdetails.User
                .withUsername(id)
                .password(user.getPassword())
                .credentialsExpired(true)
                .build();
    }
}
