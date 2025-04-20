package com.meet.chatty.utils;

import jakarta.servlet.http.HttpServletResponse;


public class CookieUtils {

    public static void addCookie(HttpServletResponse response,
                                 String name, String value, int days) {
        // Build manual Set-Cookie header including Secure and SameSite=None
        String headerValue = String.format(
                "%s=%s; Max-Age=%d; Path=/; HttpOnly; Secure; SameSite=None",
                name, value, days * 24 * 60 * 60
        );
        // Append the header—don’t overwrite
        response.addHeader("Set-Cookie", headerValue);
    }

    public static void deleteCookie(HttpServletResponse response,
                                    String name) {
        String headerValue = String.format(
                "%s=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None",
                name
        );
        response.addHeader("Set-Cookie", headerValue);
    }
}

