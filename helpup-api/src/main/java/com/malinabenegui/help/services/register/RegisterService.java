package com.malinabenegui.help.services.register;

import com.malinabenegui.help.mappers.AuthorizationResponseMapper;
import com.malinabenegui.help.models.User;
import com.malinabenegui.help.models.UserDetails;
import com.malinabenegui.help.models.httpResponseParsers.HttpSimpleStringResponse;
import com.malinabenegui.help.repositories.UserDetailsRepository;
import com.malinabenegui.help.repositories.UserRepository;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@NoArgsConstructor
public class RegisterService {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private MailingService mailingService;
    private UserDetailsRepository userDetailsRepository;
    private CredentialsChecker credentialsChecker;

    @Autowired
    public RegisterService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           MailingService mailingService, UserDetailsRepository userDetailsRepository
                            ,CredentialsChecker credentialChecker) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailingService = mailingService;
        this.userDetailsRepository = userDetailsRepository;
        this.credentialsChecker = credentialChecker;
    }

    public ResponseEntity<HttpSimpleStringResponse> registerNewUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");

        AuthorizationResponseMapper credentialsAvailability = credentialsChecker.checkCredentialsAvailability(user);
        if (credentialsAvailability.getHttpStatus() != HttpStatus.ACCEPTED) {
            return new ResponseEntity<>(credentialsAvailability.getResponseMessage(), HttpStatus.UNAUTHORIZED);
        }

        this.sendRegistrationMail(user);

        userDetailsRepository.save(initUserDetailsOnRegister(user.getUsername()));
        userRepository.save(user);

        return new ResponseEntity<>(credentialsAvailability.getResponseMessage(), credentialsAvailability.getHttpStatus());
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
