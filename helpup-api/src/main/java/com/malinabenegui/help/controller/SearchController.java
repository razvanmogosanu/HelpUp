package com.malinabenegui.help.controller;

import com.malinabenegui.help.models.Post;
import com.malinabenegui.help.models.UserDetails;
import com.malinabenegui.help.models.search.SearchFilter;
import com.malinabenegui.help.repositories.PostRepository;
import com.malinabenegui.help.repositories.UserDetailsRepository;
import com.malinabenegui.help.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/search")
@CrossOrigin
public class SearchController {
    private PostRepository postRepository;
    private UserRepository userRepository;
    private final UserDetailsRepository userDetailsRepository;

    @Autowired
    public SearchController(PostRepository postRepository, UserRepository userRepository, UserDetailsRepository userDetailsRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.userDetailsRepository = userDetailsRepository;
    }

    @GetMapping
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    private ResponseEntity<List<UserDetails>> searchUsers(@RequestBody SearchFilter search) {
        List<UserDetails> filteredUsersList = userDetailsRepository.findAll()
                .stream()
                .filter(user -> usersFilter(user, search.getSearchField()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(filteredUsersList, HttpStatus.ACCEPTED);
    }

    private boolean usersFilter(UserDetails user, String filter) {
        if (user.getUsername().contains(filter))
            return true;

        UserDetails userDetails = userDetailsRepository.getByUsername(user.getUsername());

        if (userDetails.getFirstname().contains(filter))
            return true;
        return userDetails.getLastname().contains(filter);
    }

    @RequestMapping(value = "/posts", method = RequestMethod.POST)
    private ResponseEntity<List<Post>> searchPosts(@RequestBody SearchFilter search) {
        List<Post> filteredPostsList = new ArrayList<>();
        String searchFilter = search.getSearchField();


        return new ResponseEntity<>(filteredPostsList, HttpStatus.ACCEPTED);
    }
}
