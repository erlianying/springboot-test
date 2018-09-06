package com.example.cly.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class HttpAspect {

    @Before("execution(public * com.example.cly.controller.HelloController.*(..))")
    public void beforeLog(){
        System.out.println("11111");
    }

    @Before("execution(public * com.example.cly.controller.HelloController.*(..))")
    public void beforeLogIn(){
        System.out.println("2222");
    }
}
