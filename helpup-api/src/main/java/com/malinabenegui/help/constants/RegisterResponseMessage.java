package com.malinabenegui.help.constants;

import com.malinabenegui.help.models.httpCustomResponse.HttpSimpleStringResponse;

public final class RegisterResponseMessage {
    public static final HttpSimpleStringResponse USED_MAIL_HTTP_RESPONSE = new HttpSimpleStringResponse("Mail already used");
    public static final HttpSimpleStringResponse USED_USERNAME_HTTP_RESPONSE = new HttpSimpleStringResponse("Username already used");
    public static final HttpSimpleStringResponse ACCEPTED_HTTP_RESPONSE = new HttpSimpleStringResponse("ACCEPTED");
}
