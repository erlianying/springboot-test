package com.example.cly;

import com.example.cly.domain.Person;
import com.example.cly.service.PersonService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ClyApplicationTests {

	@Autowired
	private PersonService personService;

	@Test
	public void contextLoads() {
		Person person = personService.findById("asdaas");
		Assert.assertEquals("小明",person.getName());
	}

}
