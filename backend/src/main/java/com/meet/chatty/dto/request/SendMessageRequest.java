package com.meet.chatty.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SendMessageRequest {

    private String text;

    private MultipartFile image;
}
