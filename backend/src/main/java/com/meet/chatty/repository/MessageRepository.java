package com.meet.chatty.repository;

import com.meet.chatty.dto.response.UserResponse;
import com.meet.chatty.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    @Query("{$or: [ { $and: [ { 'senderId': ?0 }, { 'receiverId': ?1 } ] }, { $and: [ { 'senderId': ?1 }, { 'receiverId': ?0 } ] } ] }")
    List<Message> findChatMessages(String myId, String userToChatId);

    @Query(value = "{ '_id': { $ne: ?0 } }",
            fields = "{ '_id': 1, 'fullName': 1, 'profilePic.profilePicUrl': 1, 'email': 1, 'createdAt': 1 }")
    List<UserResponse> findUserSidebarByIdNot(String userId);


}
