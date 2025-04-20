package com.meet.chatty.repository;

import com.meet.chatty.dto.response.UserResponse;
import com.meet.chatty.model.User;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {


    Optional<User> findByEmail(String email);

    List<User> findAllByIdNot(String loggedInUserId);

    @Aggregation(pipeline = {
            "{ $match: { '_id': { $ne: ?0 } } }",
            "{ $project: { " +
                    "_id: 1, " +
                    "fullName: 1, " +
                    "profilePic: '$profilePic.profilePicUrl', " +
                    "email: 1, " +
                    "createdAt: 1 " +
                    "} }"
    })
    List<UserResponse> findUserSidebarByIdNot(String userId);
}
