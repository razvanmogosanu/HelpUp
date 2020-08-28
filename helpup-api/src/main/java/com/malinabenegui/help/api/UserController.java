package com.malinabenegui.help.api;

import com.malinabenegui.help.models.User;
import com.malinabenegui.help.models.auth.AuthenticationResponse;
import com.malinabenegui.help.repositories.UserRepository;
import com.malinabenegui.help.services.MailingService;
import com.sun.mail.iap.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public @ResponseBody
    ResponseEntity<?> addUser(@RequestBody User user) throws MailException {
        List<User> usernameList = userRepository.findAllByUsername(user.getUsername());
        List<User> emailList = userRepository.findAllByEmail(user.getEmail());

        if (emailExists(emailList))
            return new ResponseEntity<>("mail already associated to an account", HttpStatus.UNAUTHORIZED);
        if (usernameExists(usernameList))
            return new ResponseEntity<>("username already used", HttpStatus.UNAUTHORIZED);

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            mailingService.sendNotification(user);
        } catch (MailException e) {
            throw new MailAuthenticationException(user.getEmail());
        }
        userRepository.save(user);
        return ResponseEntity.ok(new AuthenticationResponse("accepted"));
    }

    private boolean usernameExists(List<User> usernameList) {
        return !usernameList.isEmpty();
    }

    private boolean emailExists(List<User> emailList) {
        return !emailList.isEmpty();
    }
}
