package com.malinabenegui.help.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.malinabenegui.help.models.Chat;
import com.malinabenegui.help.models.Conversation;
import com.malinabenegui.help.models.UserDetails;
import com.malinabenegui.help.models.httpResponseParsers.HttpSimpleStringResponse;
import com.malinabenegui.help.repositories.ChatRepository;
import com.malinabenegui.help.repositories.UserDetailsRepository;
import com.malinabenegui.help.services.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("messenger")
public class MessageController {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @RequestMapping(value = "/getConversation", method = RequestMethod.POST)
    private ResponseEntity<List<Chat>> getConversation(
            @RequestHeader("Authorization") String header,
            @RequestBody HttpSimpleStringResponse toJson) {

        String from = jwtService.parseUsernameFromJWT(header).getString();
        System.out.println(from);
        String to = toJson.getString();
        List<Chat> retrieved = chatRepository.findBySender(from)
                .stream()
                .filter((chat -> chat.getReceiver().equals(to)))
                .collect(Collectors.toList());

        retrieved.addAll(chatRepository.findBySender(to)
                .stream()
                .filter(chat -> chat.getReceiver().equals(from))
                .collect(Collectors.toList()));
        return ResponseEntity.ok(retrieved);
    }

    @RequestMapping(value = "/getConversationHistory", method = RequestMethod.POST)
    private ResponseEntity<List<Conversation>> getConversationHistory(
            @RequestHeader("Authorization") String header) {

        String from = jwtService.parseUsernameFromJWT(header).getString();
        List<Conversation> conversations = new ArrayList<>();

        List<Chat> list = chatRepository.findAll();

        for(Chat chat : list) {
            if(chat.getReceiver().equals(from) || chat.getSender().equals(from)) {
                boolean conversationExists = false;
                for (Conversation conversation : conversations) {
                    if (conversation.getFrom().equals(from)) {
                        conversation.getChat().add(chat);
                        conversationExists = true;
                        break;
                    }
                }
                if (!conversationExists) {
                    Conversation newConversation =
                            new Conversation(chat.getReceiver(), from, userDetailsRepository.getByUsername(from).getProfilepic());
                    newConversation.getChat().add(chat);
                    conversations.add(newConversation);
                }
            }
        }


        return ResponseEntity.ok(conversations);
    }

    @RequestMapping(value = "/addMessage", method = RequestMethod.POST)
    private void addMessage(@RequestBody Chat chat) {
        chatRepository.save(chat);
    }
}
