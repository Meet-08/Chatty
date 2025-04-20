package com.meet.chatty.utils;

import jakarta.servlet.http.HttpServletResponse;

public class CookieUtils {


    public static void addCookie(HttpServletResponse response,
                                 String name, String value, int days) {
        int maxAge = days * 24 * 60 * 60;


        String sb = name + "=" + value +
                "; Max-Age=" + maxAge +
                "; Path=/" +
                "; HttpOnly" +
                "; Secure" +
                "; SameSite=None";

        response.addHeader("Set-Cookie", sb);
    }


    public static void deleteCookie(HttpServletResponse response,
                                    String name) {

        String sb = name + "=; Max-Age=0; Path=/; HttpOnly" +
                "; Secure" +
                "; SameSite=None";

        response.addHeader("Set-Cookie", sb);
    }
}
