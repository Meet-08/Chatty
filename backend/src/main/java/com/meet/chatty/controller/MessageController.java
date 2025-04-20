package com.meet.chatty.controller;


import com.meet.chatty.dto.request.SendMessageRequest;
import com.meet.chatty.dto.response.UserResponse;
import com.meet.chatty.model.Message;
import com.meet.chatty.model.User;
import com.meet.chatty.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUserForSidebar(
            HttpServletRequest request
    ) {
        return messageService.getUserForSidebar(request);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable("id") String userToChatId,
            HttpServletRequest request
    ) {
        return messageService.getMessages(userToChatId, request);
    }

    @PostMapping("/send/{id}")
    public ResponseEntity<?> sendMessage(
            SendMessageRequest messageRequest,
            @PathVariable("id") String receiverId,
            HttpServletRequest request
    ) {
        String senderId = ((User) request.getAttribute("user")).getId();
        return messageService.sendMessage(messageRequest, senderId, receiverId);
    }
}
