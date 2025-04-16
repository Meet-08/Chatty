package com.meet.chatty.service;

import com.meet.chatty.dto.request.SendMessageRequest;
import com.meet.chatty.model.Message;
import com.meet.chatty.model.User;
import com.meet.chatty.repository.MessageRepository;
import com.meet.chatty.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final CloudinaryService cloudinaryService;


    public ResponseEntity<List<User>> getUserForSidebar(HttpServletRequest request) {
        String loggedInUserId = ((User) request.getAttribute("user")).getId();
        List<User> users = userRepository.findAllByIdNot(loggedInUserId);
        return ResponseEntity.ok(users);
    }

    public ResponseEntity<List<Message>> getMessages(String userToChatId, HttpServletRequest request) {
        String myId = ((User) request.getAttribute("user")).getId();
        List<Message> messages = messageRepository.findChatMessages(myId, userToChatId);
        return ResponseEntity.ok(messages);
    }

    public ResponseEntity<?> sendMessage(SendMessageRequest messageRequest, String senderId, String receiverId) {

        try {

            String imageUrl = "";

            if (messageRequest.getImage() != null) {
                Map upload = cloudinaryService.uploadImage(messageRequest.getImage());
                imageUrl = upload.get("secure_url").toString();
            }

            Message newMessage = Message.builder()
                    .senderId(senderId)
                    .receiverId(receiverId)
                    .text(messageRequest.getText())
                    .image(imageUrl)
                    .build();

            messageRepository.save(newMessage);

            //to-do: realtime functionality goes here
            return ResponseEntity.status(201).body(newMessage);


        } catch (IOException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
