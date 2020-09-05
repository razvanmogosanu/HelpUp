package com.malinabenegui.help.services.register;

import com.malinabenegui.help.constants.RegisterResponseMessage;
import com.malinabenegui.help.mappers.AuthorizationResponseMapper;
import com.malinabenegui.help.models.User;
import com.malinabenegui.help.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CredentialsChecker {
    private final UserRepository userRepository;

    @Autowired
    public CredentialsChecker(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthorizationResponseMapper checkCredentialsAvailability(User user) {
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
}
