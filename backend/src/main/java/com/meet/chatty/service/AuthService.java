package com.meet.chatty.service;

import com.meet.chatty.dto.request.LoginRequest;
import com.meet.chatty.dto.request.SignupRequest;
import com.meet.chatty.dto.response.UserResponse;
import com.meet.chatty.error.UserException;
import com.meet.chatty.model.User;
import com.meet.chatty.repository.UserRepository;
import com.meet.chatty.utils.CookieUtils;
import com.meet.chatty.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public ResponseEntity<UserResponse> signUp(
            SignupRequest request,
            HttpServletResponse response
    ) {
        var u = userRepository.findByEmail(request.getEmail());

        if (u.isPresent()) throw new UserException("Email already in use", 400);

        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        jwtUtil.createToken(
                new HashMap<>(),
                user.getId(),
                response
        );

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(201).body(
                UserResponse.builder()
                        ._id(savedUser.getId())
                        .fullName(savedUser.getFullName())
                        .email(savedUser.getEmail())
                        .profilePic(savedUser.getProfilePic())
                        .build()
        );
    }

    public ResponseEntity<UserResponse> login(LoginRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(
                () -> new UserException("Invalid Credentials", 400)
        );

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new UserException("Invalid Credentials", 400);

        jwtUtil.createToken(
                new HashMap<>(),
                user.getId(),
                response
        );

        return ResponseEntity.ok(
                UserResponse.builder()
                        ._id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .build()
        );
    }

    public ResponseEntity<String> logout(HttpServletResponse response) {
        CookieUtils.deleteCookie(
                response,
                "auth_token"
        );

        return ResponseEntity.status(200).body("Logged out successfully");
    }
}
