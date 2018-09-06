package com.example.cly.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Person {

    @Id
    @GeneratedValue
    String id;

    private String name;

    private Integer xhNum;

    public Person() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getXhNum() {
        return xhNum;
    }

    public void setXhNum(Integer xhNum) {
        this.xhNum = xhNum;
    }
}
