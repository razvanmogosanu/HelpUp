package com.malinabenegui.help.controller;

import com.malinabenegui.help.models.User;
import com.malinabenegui.help.models.UserDetails;
import com.malinabenegui.help.repositories.UserDetailsRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.assertEquals;

@RunWith(SpringRunner.class)
@DataJpaTest
public class SearchCheck {
    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Test
    public void test1() {
        UserDetails userDetails = new UserDetails();
        userDetails.setUsername("test user");

        userDetailsRepository.save(userDetails);
        assertEquals(userDetailsRepository.findAll().size(), 1);
    }

}
