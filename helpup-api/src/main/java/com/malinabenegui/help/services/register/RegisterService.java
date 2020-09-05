package com.malinabenegui.help.services.register;

import com.malinabenegui.help.constants.RegisterResponseMessage;
import com.malinabenegui.help.mappers.AuthorizationResponseMapper;
import com.malinabenegui.help.models.User;
import com.malinabenegui.help.models.UserDetails;
import com.malinabenegui.help.models.httpResponseParsers.HttpSimpleStringResponse;
import com.malinabenegui.help.repositories.UserDetailsRepository;
import com.malinabenegui.help.repositories.UserRepository;
import com.malinabenegui.help.services.MailingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegisterService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailingService mailingService;
    private final UserDetailsRepository userDetailsRepository;

    @Autowired
    public RegisterService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                              MailingService mailingService, UserDetailsRepository userDetailsRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailingService = mailingService;
        this.userDetailsRepository = userDetailsRepository;
    }

    public ResponseEntity<HttpSimpleStringResponse> registerNewUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");

        AuthorizationResponseMapper credentialsAvailability = this.checkCredentialsAvailability(user);
        if (credentialsAvailability.getHttpStatus() != HttpStatus.ACCEPTED) {
            return new ResponseEntity<>(credentialsAvailability.getResponseMessage(), HttpStatus.UNAUTHORIZED);
        }

        this.sendRegistrationMail(user);

        userDetailsRepository.save(initUserDetailsOnRegister(user.getUsername()));

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

    private UserDetails initUserDetailsOnRegister(String username) {
        UserDetails userDetails = new UserDetails();
        userDetails.setUsername(username);
        userDetails.setFirstname("");
        userDetails.setLastname("");
        return userDetails;
    }
}
