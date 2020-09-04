package com.malinabenegui.help.controller;


import com.malinabenegui.help.models.Post;
import com.malinabenegui.help.models.editPostRequest.DeleteRequest;
import com.malinabenegui.help.models.editPostRequest.EditRequest;
import com.malinabenegui.help.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/post")
@CrossOrigin
public class PostController {
    @Autowired
    private PostRepository postRepository;

    @GetMapping("/all")
    public Iterable<Post> all() {
        List<Post> list = postRepository.findAll();
        Collections.reverse(list);
        return list;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPost(@RequestParam("imageFile") MultipartFile file, @RequestParam("description") String description, @RequestParam("user_username") String user_username) throws IOException {
        postRepository.save(new Post(description, user_username, file.getBytes()));
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @GetMapping(path = {"/get/{imageName}"})
//    public Post getImage(@PathVariable("imageName") String imageID) {
//        final Optional<Post> retrievedPost = postRepository.findById(Long.parseLong(imageID));
//        return new Post(retrievedPost.get().getDescription(), retrievedPost.get().getImage());
//    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    public void editPost(@RequestBody EditRequest editRequest) {
        Post post = postRepository.getOne(editRequest.getId());
        post.setDescription(editRequest.getDescription());
        postRepository.save(post);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public void deletePost(@RequestBody DeleteRequest deleteRequest) {
        postRepository.deleteById(deleteRequest.getId());
    }

}
