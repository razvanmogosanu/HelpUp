package com.example.help.api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;

@RestController
@RequestMapping("")
@CrossOrigin
public class UserController {
    @GetMapping("/all")
    public List<String> all() {
        var allCategories = new LinkedList<String>();
        for(int i = 0; i < 10; i++) {
            allCategories.add("postare " + i);
        }
        return allCategories;
    }
}
