package com.malinabenegui.help.controller;

import com.malinabenegui.help.models.Post;
import com.malinabenegui.help.models.UserDetails;
import com.malinabenegui.help.models.httpResponseParsers.HttpSimpleStringResponse;
import com.malinabenegui.help.services.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService service;

    @RequestMapping(value = "/getdetails", method = RequestMethod.POST)
    private ResponseEntity<UserDetails> getUserDetails(@RequestBody HttpSimpleStringResponse username) {
        return service.getUserDetails(username);
    }

    @RequestMapping(value = "/editdetails", method = RequestMethod.POST)
    private void editUserDetails(@RequestBody UserDetails userDetails) {
        service.editUserDetails(userDetails);
    }

    @RequestMapping(value = "/getposts", method = RequestMethod.POST)
    private ResponseEntity<?> getPostsOfUser(@RequestBody HttpSimpleStringResponse username){
        return service.getPostsOfUser(username);
    }

}
