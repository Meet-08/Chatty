package com.meet.chatty.error;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserException extends RuntimeException {

    private int statusCode;

    public UserException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
