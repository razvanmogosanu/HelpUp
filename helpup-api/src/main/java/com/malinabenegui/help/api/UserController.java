package com.malinabenegui.help.api;

import com.malinabenegui.help.models.User;
import com.malinabenegui.help.repositories.UserRepository;
import com.malinabenegui.help.services.MailingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
@CrossOrigin
public class UserController {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private MailingService mailingService;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, MailingService mailingService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailingService = mailingService;
    }

    @GetMapping("/all")
    public Iterable<User> all() {
        return userRepository.findAll();
    }

    @RequestMapping("/add")
    public @ResponseBody String addUser(@RequestParam String username, @RequestParam String email, @RequestParam String password) throws MailException {
        List<User> usernameList = userRepository.findAllByUsername(username);
        List<User> emailList = userRepository.findAllByEmail(email);

        if (emailExists(emailList))
            return "mail already associated to an account";
        if (usernameExists(usernameList))
            return "username taken";

        User user = new User(username, passwordEncoder.encode(password), email);
        try {
            mailingService.sendNotification(user);
        } catch (MailException e) {
            throw new MailAuthenticationException(email);
        }
        userRepository.save(user);
        return "accepted";
    }

    private boolean usernameExists(List<User> usernameList) {
        return !usernameList.isEmpty();
    }

    private boolean emailExists(List<User> emailList) {
        return !emailList.isEmpty();
    }
}
