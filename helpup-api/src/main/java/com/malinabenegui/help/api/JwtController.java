package com.malinabenegui.help.api;


import com.malinabenegui.help.models.httpResponseParsers.HttpSimpleStringResponse;
import com.malinabenegui.help.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/jwt")
@CrossOrigin
public class JwtController {
    @Autowired
    private JwtUtil jwtUtil;

    @RequestMapping("/username")
    private ResponseEntity<HttpSimpleStringResponse> parseUsernameFromJWT(@RequestHeader("Authorization") String header) {
        return new ResponseEntity<>(new HttpSimpleStringResponse(jwtUtil.extractUsername(header.substring(7))), HttpStatus.ACCEPTED);
    }
}
