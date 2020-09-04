package com.malinabenegui.help.api;

import com.malinabenegui.help.models.UserDetails;
import com.malinabenegui.help.models.httpResponseParsers.HttpSimpleStringResponse;
import com.malinabenegui.help.repositories.UserDetailsRepository;
import com.malinabenegui.help.repositories.UserRepository;
import com.malinabenegui.help.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    private UserRepository userRepository;
    private UserDetailsRepository userDetailsRepository;
    private JwtUtil jwtUtil;

    @Autowired
    public UserController(UserRepository userRepository, UserDetailsRepository userDetailsRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userDetailsRepository = userDetailsRepository;
        this.jwtUtil = jwtUtil;
    }

    @RequestMapping(value = "/getdetails", method = RequestMethod.POST)
    private ResponseEntity<UserDetails> getUserDetails(@RequestBody HttpSimpleStringResponse username) {
        return new ResponseEntity<>(userDetailsRepository.getByUsername(username.getString()), HttpStatus.ACCEPTED);
    }


}
