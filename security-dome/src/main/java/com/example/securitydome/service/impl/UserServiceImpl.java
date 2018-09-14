package com.example.securitydome.service.impl;

import com.example.securitydome.domain.Authority;
import com.example.securitydome.domain.Resource;
import com.example.securitydome.domain.Role;
import com.example.securitydome.domain.User;
import com.example.securitydome.repository.UserRepository;
import com.example.securitydome.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Resource> findAllResourceByUserId(String id) {

        Optional<User> userOptional = userRepository.findById(id);
        List<Resource> resources = new ArrayList<>();
        if(null != userOptional){
            User user = userOptional.get();
            List<Role> roles =  user.getRoles();
            if(null != roles && roles.size() > 0){
                for(Role role : roles){
                    List<Authority> authoritys = role.getAuthoritys();
                    if(null != authoritys && authoritys.size() > 0){
                        for(Authority authority : authoritys){
                            List<Resource> resourceList= authority.getResource();
                            if(null != resourceList && resourceList.size() > 0){
                                for(Resource resource : resourceList){
                                    resources.add(resource);
                                }
                            }
                        }
                    }
                }
            }
            return resources;
        }
        return null;
    }
}
