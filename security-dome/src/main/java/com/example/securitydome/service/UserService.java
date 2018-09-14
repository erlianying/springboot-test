package com.example.securitydome.service;

import com.example.securitydome.domain.Resource;

import java.util.List;

public interface UserService {

    public List<Resource> findAllResourceByUserId (String id);
}
