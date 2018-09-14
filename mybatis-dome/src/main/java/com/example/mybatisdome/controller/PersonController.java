package com.example.mybatisdome.controller;

import com.example.mybatisdome.mapperDao.PersonMapperDao;
import com.example.mybatisdome.mapperDao.pojo.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value="/person")
public class PersonController {

    @Autowired
    private PersonMapperDao personMapperDao;

    @RequestMapping(value="/findAllPerson" ,method = RequestMethod.POST)
    public List<Person> findAllPerson(){
       return  personMapperDao.findAllPerson();
    }
}
