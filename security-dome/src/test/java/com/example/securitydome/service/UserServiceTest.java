package com.example.securitydome.service;

import com.example.securitydome.domain.Resource;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserServiceTest {

    @Autowired
    UserService userService;

    @Test
    public void findAllResourceByUserId() throws Exception {
        List<Resource> resources = userService.findAllResourceByUserId("chengly");
        Assert.assertEquals(1,resources.size());
    }

}