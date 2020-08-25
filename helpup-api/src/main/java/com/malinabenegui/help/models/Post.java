package com.malinabenegui.help.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Arrays;
import java.util.Date;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;
    private int user_id;
    private String description;
    private byte[] image;

    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", date=" + date +
                ", user_id=" + user_id +
                ", description='" + description + '\'' +
                ", image=" + Arrays.toString(image) +
                '}';
    }

    public Post() {
    }

    public Post(String description, byte[] image) {
        date = new Date(System.currentTimeMillis());

        this.description = description;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getuser_id() {
        return user_id;
    }

    public void setuser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getimage() {
        return image;
    }

    public void setimage(byte[] image) {
        this.image = image;
    }
}
