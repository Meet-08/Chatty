package com.meet.chatty.error;

public class JwtException extends RuntimeException {

    public JwtException(String message) {
        super(message);
    }
}
