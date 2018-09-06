package com.example.cly.service.impl;

import com.example.cly.domain.Person;
import com.example.cly.repository.PersonRepository;
import com.example.cly.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.UUID;

@Service
public class PersonServiceImpl implements PersonService {

    @Autowired
    private PersonRepository personRepository;


    @Override
    @Transactional
    public void savePerson(Person person) {
        person.setId(UUID.randomUUID().toString());
        personRepository.save(person);

    }
}
