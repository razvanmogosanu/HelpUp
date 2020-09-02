package com.malinabenegui.help.api;

import com.malinabenegui.help.HelpApplication;
import com.malinabenegui.help.models.Post;
import com.malinabenegui.help.models.search.SearchFilter;
import com.malinabenegui.help.repositories.PostRepository;
import javafx.application.Application;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@WebMvcTest(SearchController.class)
public class SearchTesting {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private PostRepository postRepository;

    public SearchTesting() {

    }

    @Test
    void test1() throws Exception {
        postRepository.save(new Post());

        RequestBuilder request = MockMvcRequestBuilders.get("/search/users", new SearchFilter("predi"));
        MvcResult result = mvc.perform(request).andReturn();
        assertEquals("predi", result.toString());
    }

}
