package com.meet.chatty.utils;

import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {

    public static void addCookie(HttpServletResponse response,
                                 String name, String value, int days) {
        // Build Set-Cookie header with Secure, HttpOnly, and SameSite=None
        String headerValue = String.format(
                "%s=%s; Max-Age=%d; Path=/; HttpOnly; Secure; SameSite=None",
                name, value, days * 24 * 60 * 60
        );
        response.addHeader("Set-Cookie", headerValue);
    }

    public static void deleteCookie(HttpServletResponse response,
                                    String name) {
        // Remove stray dot and correctly format deletion header
        String headerValue = String.format(
                "%s=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None",
                name
        );
        response.addHeader("Set-Cookie", headerValue);
    }
}
