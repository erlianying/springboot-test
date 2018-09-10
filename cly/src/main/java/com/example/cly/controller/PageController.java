package com.example.cly.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//页面跳转controller
@Controller
public class PageController {

    @RequestMapping("/index")
    public String edit() {
        return "/index";
    }

}
