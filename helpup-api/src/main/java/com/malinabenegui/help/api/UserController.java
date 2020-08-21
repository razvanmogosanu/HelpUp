package com.malinabenegui.help.api;

import com.malinabenegui.help.models.User;
import com.malinabenegui.help.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
@CrossOrigin
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/all")
    public Iterable<User> all() {
        return userRepository.findAll();
    }

    @RequestMapping("/add")
    public @ResponseBody String addNewUser(@RequestParam String username, @RequestParam String email, @RequestParam String password) {
        List<User> usernameList = userRepository.findAllByUsername(username);
        List<User> emailList = userRepository.findAllByEmail(email);
        if (emailExists(emailList))
            return "mail already associated to an account";
        if (usernameExists(usernameList))
            return "username taken";

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);

        return "accepted";
        }

    private boolean usernameExists(List<User> usernameList){
        return !usernameList.isEmpty();
    }
    private boolean emailExists(List<User> emailList){
        return !emailList.isEmpty();
    }
}
