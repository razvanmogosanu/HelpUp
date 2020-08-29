package com.malinabenegui.help.api;


import com.malinabenegui.help.models.Post;
import com.malinabenegui.help.models.httpCustomRequest.DeleteRequest;
import com.malinabenegui.help.models.httpCustomRequest.EditRequest;
import com.malinabenegui.help.repositories.PostRepository;
import org.hibernate.sql.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

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

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPost(@RequestParam("imageFile") MultipartFile file, @RequestParam("description") String description) throws IOException {
        postRepository.save(new Post(description, file.getBytes()));
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @GetMapping(path = {"/get/{imageName}"})
//    public Post getImage(@PathVariable("imageName") String imageID) {
//        final Optional<Post> retrievedPost = postRepository.findById(Long.parseLong(imageID));
//        return new Post(retrievedPost.get().getDescription(), retrievedPost.get().getImage());
//    }

    @GetMapping("/edit")
    public void editPost(@RequestBody EditRequest editRequest) {
        Post post = postRepository.getOne(editRequest.getId());
        post.setDescription(editRequest.getDescription());
        postRepository.save(post);
        System.out.println("DONE");
    }

    @GetMapping("/delete")
    public void deletePost(@RequestBody DeleteRequest deleteRequest) {
        postRepository.deleteById(deleteRequest.getId());
    }

}
