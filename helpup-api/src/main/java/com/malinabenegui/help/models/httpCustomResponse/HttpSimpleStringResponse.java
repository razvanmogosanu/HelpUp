package com.malinabenegui.help.models.httpCustomResponse;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HttpSimpleStringResponse {
    private String registerResponseMessage;

    public HttpSimpleStringResponse(String registerResponseMessage) {
        this.registerResponseMessage = registerResponseMessage;
    }
}
