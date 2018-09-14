package com.example.securitydome.domain;

import javax.persistence.JoinColumn;


public class RoleAuthority {

    private  Role role;

    private  Authority authority;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Authority getAuthority() {
        return authority;
    }

    public void setAuthority(Authority authority) {
        this.authority = authority;
    }
}
