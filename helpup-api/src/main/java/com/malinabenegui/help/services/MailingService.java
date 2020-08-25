package com.malinabenegui.help.services;

import com.malinabenegui.help.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailingService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendNotification(User user) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setFrom("helpupcompany@gmail.com");
        mail.setSubject("licenta");
        mail.setText("link cool");

        javaMailSender.send(mail);
    }
}
