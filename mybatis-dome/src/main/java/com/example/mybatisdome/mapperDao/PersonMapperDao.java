package com.example.mybatisdome.mapperDao;

import com.example.mybatisdome.mapperDao.pojo.Person;

import java.util.List;

public interface PersonMapperDao {

    public List<Person> findAllPerson();
}
