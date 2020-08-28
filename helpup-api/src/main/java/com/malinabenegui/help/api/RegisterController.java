package com.malinabenegui.help.api;

import com.malinabenegui.help.constants.RegisterResponseMessage;
import com.malinabenegui.help.mappers.AuthorizationResponseMapper;
import com.malinabenegui.help.models.User;
import com.malinabenegui.help.models.httpCustomResponse.HttpSimpleStringResponse;
import com.malinabenegui.help.repositories.UserRepository;
import com.malinabenegui.help.services.MailingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/register")
@CrossOrigin
public class RegisterController {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private MailingService mailingService;

    @Autowired
    public RegisterController(UserRepository userRepository, PasswordEncoder passwordEncoder, MailingService mailingService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailingService = mailingService;
    }

    @RequestMapping("")
    public @ResponseBody
    ResponseEntity<HttpSimpleStringResponse> registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        AuthorizationResponseMapper credentialsAvailability = this.checkCredentialsAvailability(user);
        if (credentialsAvailability.getHttpStatus() != HttpStatus.ACCEPTED) {
            return new ResponseEntity<>(credentialsAvailability.getResponseMessage(), HttpStatus.UNAUTHORIZED);
        }

        this.sendRegistrationMail(user);

        userRepository.save(user);
        return new ResponseEntity<>(credentialsAvailability.getResponseMessage(), credentialsAvailability.getHttpStatus());
    }


    private AuthorizationResponseMapper checkCredentialsAvailability(User user) {
        if (emailExists(user))
            return new AuthorizationResponseMapper(HttpStatus.UNAUTHORIZED, RegisterResponseMessage.USED_MAIL_HTTP_RESPONSE);
        if (usernameExists(user))
            return new AuthorizationResponseMapper(HttpStatus.UNAUTHORIZED, RegisterResponseMessage.USED_USERNAME_HTTP_RESPONSE);
        return new AuthorizationResponseMapper(HttpStatus.ACCEPTED, RegisterResponseMessage.ACCEPTED_HTTP_RESPONSE);
    }

    private boolean usernameExists(User user) {
        List<User> usernameList = userRepository.findAllByUsername(user.getUsername());
        return !usernameList.isEmpty();
    }

    private boolean emailExists(User user) {
        List<User> emailList = userRepository.findAllByEmail(user.getEmail());
        return !emailList.isEmpty();
    }

    private void sendRegistrationMail(User user) throws MailException {
        try {
            mailingService.sendNotification(user);
        } catch (MailException e) {
            throw new MailAuthenticationException(user.getEmail());
        }
    }
}
