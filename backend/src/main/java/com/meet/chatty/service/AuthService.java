package com.meet.chatty.service;

import com.meet.chatty.dto.request.LoginRequest;
import com.meet.chatty.dto.request.SignupRequest;
import com.meet.chatty.dto.response.UserResponse;
import com.meet.chatty.error.UserException;
import com.meet.chatty.model.Image;
import com.meet.chatty.model.User;
import com.meet.chatty.repository.UserRepository;
import com.meet.chatty.utils.CookieUtils;
import com.meet.chatty.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CloudinaryService cloudinaryService;

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


        User savedUser = userRepository.save(user);

        jwtUtil.createToken(
                savedUser.getId(),
                response
        );
        return ResponseEntity.status(201).body(
                UserResponse.builder()
                        ._id(savedUser.getId())
                        .fullName(savedUser.getFullName())
                        .email(savedUser.getEmail())
                        .profilePic(savedUser.getProfilePic().getProfilePicUrl())
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

    public ResponseEntity<UserResponse> updateProfile(
            HttpServletRequest request,
            MultipartFile profilePic
    ) {
        User user = (User) request.getAttribute("user");
        Image image = user.getProfilePic();

        try {
            if (!image.getProfilePicUrl().isEmpty())
                cloudinaryService.deleteImage(image.getPublicId());

            Map upload = cloudinaryService.uploadImage(profilePic);

            image.setProfilePicUrl(upload.get("secure_url").toString());
            image.setPublicId(upload.get("public_id").toString());

            user.setProfilePic(image);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(
                    UserResponse.builder()
                            ._id(updatedUser.getId())
                            .fullName(updatedUser.getFullName())
                            .email(updatedUser.getEmail())
                            .profilePic(updatedUser.getProfilePic().getProfilePicUrl())
                            .build()
            );

        } catch (IOException e) {
            throw new UserException("Cloudinary Error Image Upload Failed", 500);
        }
    }

    public ResponseEntity<UserResponse> checkAuth(HttpServletRequest req) {

        User user = (User) req.getAttribute("user");
        if (user == null)
            throw new UserException("User Not Found", 404);
        return ResponseEntity.ok(
                UserResponse.builder()
                        ._id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .profilePic(user.getProfilePic().getProfilePicUrl())
                        .build()
        );
    }
}
