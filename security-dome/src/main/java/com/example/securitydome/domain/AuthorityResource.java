package com.example.securitydome.domain;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;


public class AuthorityResource {


    private Authority authority;


    private Resource resource;

    public Authority getAuthority() {
        return authority;
    }

    public void setAuthority(Authority authority) {
        this.authority = authority;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }
}
