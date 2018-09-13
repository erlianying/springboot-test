package com.example.cly.controller;

import com.example.cly.domain.Person;
import com.example.cly.repository.PersonRepository;
import com.example.cly.result.Result;
import com.example.cly.service.PersonService;
import com.example.cly.util.ReturnResultUtil;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value="/hello")
public class HelloController {

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private PersonService personService;

    @Value("${xingming}")
    private String xingming;

    @RequestMapping(value="/test" ,method = RequestMethod.POST)
    public String test(){
        return xingming;
    }

    @RequestMapping(value="/findAllPerson" ,method = RequestMethod.POST)
    public Result findAllPerson(){
        Person person = new Person();

        List<Person> persons = personRepository.findAll();
        if(null == persons || persons.size() <= 0){
            ReturnResultUtil.returnError(null);
        }
        return ReturnResultUtil.returnSuccess(persons);
    }

    @RequestMapping(value="/savePerson" ,method = RequestMethod.POST)
    public String savePerson(Person person){
        Person p = new Person();
        p.setName(person.getName());
        personService.savePerson(p);
        return "true";
    }
}
