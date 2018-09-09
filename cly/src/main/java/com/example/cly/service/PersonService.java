package com.example.cly.service;

import com.example.cly.domain.Person;

public interface PersonService {
    public void savePerson(Person person);

    public Person findById(String id);
}
