package com.meet.chatty.controller;

import com.meet.chatty.dto.request.LoginRequest;
import com.meet.chatty.dto.request.SignupRequest;
import com.meet.chatty.dto.response.UserResponse;
import com.meet.chatty.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(
            @Valid @RequestBody SignupRequest request,
            HttpServletResponse response
    ) {
        return authService.signUp(request, response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        return authService.login(request, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            HttpServletResponse response
    ) {
        return authService.logout(response);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(

    ) {
        return ResponseEntity.ok().build();
    }

}
