package com.malinabenegui.help.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Arrays;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date date;
    private String user_username;
    private String description;
    private byte[] image;

    public Post(String description, String user_username, byte[] image) {
        date = new Date(System.currentTimeMillis());

        this.description = description;
        this.user_username = user_username;
        this.image = image;
    }
}
