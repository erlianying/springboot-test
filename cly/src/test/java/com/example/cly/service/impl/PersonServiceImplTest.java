package com.example.cly.service.impl;

import com.example.cly.domain.Person;
import com.example.cly.service.PersonService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.*;

//对service进行测试不
@RunWith(SpringRunner.class)
@SpringBootTest
public class PersonServiceImplTest {

    @Autowired
    private PersonService personService;
    @Test
    public void savePerson() throws Exception {
    }

    @Test
    public void findById() throws Exception {
        Person person = personService.findById("asdaas");
        Assert.assertEquals("小明",person.getName());
    }

}