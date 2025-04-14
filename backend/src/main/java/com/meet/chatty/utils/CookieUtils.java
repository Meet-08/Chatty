package com.meet.chatty.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {

    public static void addCookie(HttpServletResponse response, String name, String value, int days) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production
        cookie.setMaxAge(days * 24 * 60 * 60);
        response.addCookie(cookie);

        // Manually add SameSite attribute
        String headerValue = String.format("%s=%s; Max-Age=%d; Path=/; HttpOnly; SameSite=Strict",
                name, value, days * 24 * 60 * 60);
        response.setHeader("Set-Cookie", headerValue);
    }

    public static void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        // Manually add SameSite attribute
        String headerValue = String.format("%s=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict", name);
        response.setHeader("Set-Cookie", headerValue);
    }
}
