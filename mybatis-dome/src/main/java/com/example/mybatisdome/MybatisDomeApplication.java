package com.example.mybatisdome;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.mybatisdome.mapperDao")
public class MybatisDomeApplication {
	public static void main(String[] args) {
		SpringApplication.run(MybatisDomeApplication.class, args);
	}
}
