package com.meet.chatty.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {

    private String _id;

    private String fullName;

    private String email;

    private String profilePic;

    private LocalDateTime createdAt;

}
