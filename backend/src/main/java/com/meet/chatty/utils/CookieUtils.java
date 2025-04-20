package com.meet.chatty.utils;

import jakarta.servlet.http.HttpServletResponse;


public class CookieUtils {

    public static void addCookie(HttpServletResponse response,
                                 String name, String value, int days, String domain) {
        // Build manual Set-Cookie header including Secure and SameSite=None
        String headerValue = String.format(
                "%s=%s; Max-Age=%d; Domain=%s; Path=/; HttpOnly; Secure; SameSite=None",
                name, value, days * 24 * 60 * 60, domain
        );
        // Append the header—don’t overwrite
        response.addHeader("Set-Cookie", headerValue);
    }

    public static void deleteCookie(HttpServletResponse response,
                                    String name, String domain) {
        String headerValue = String.format(
                "%s=; Max-Age=0; Domain=%s; Path=/; HttpOnly; Secure; SameSite=None",
                name, domain
        );
        response.addHeader("Set-Cookie", headerValue);
    }
}

