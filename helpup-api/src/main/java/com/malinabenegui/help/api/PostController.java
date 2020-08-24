package com.malinabenegui.help.api;


import com.malinabenegui.help.models.Post;
import com.malinabenegui.help.models.User;
import com.malinabenegui.help.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
@CrossOrigin
public class PostController {
    @Autowired
    private PostRepository postRepository;

    @GetMapping("/all")
    public Iterable<Post> all() {
        return postRepository.findAll();
    }

    @RequestMapping("/add")
    public @ResponseBody String addPost(@RequestParam String caca) {
        return "";
    }

    @RequestMapping("/edit")
    public @ResponseBody String editPost() {
        return "";
    }

    @RequestMapping("/delete")
    public @ResponseBody String deletePost() {
        return "";
    }

}
