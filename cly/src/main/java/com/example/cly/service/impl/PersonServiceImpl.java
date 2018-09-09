package com.example.cly.service.impl;

import com.example.cly.domain.Person;
import com.example.cly.repository.PersonRepository;
import com.example.cly.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class PersonServiceImpl implements PersonService {

    @Autowired
    private PersonRepository personRepository;


    @Override
    @Transactional
    public void savePerson(Person person) {
        personRepository.save(person);
        Person pers = new Person();
        pers.setName("小强.......asadsadasdasasda");
        personRepository.save(pers);
    }

    @Override
    public Person findById(String id) {
        Optional<Person> byId = personRepository.findById(id);
        Person person = byId.get();
        return person;
    }


}
