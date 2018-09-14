package com.example.securitydome.repository;

import com.example.securitydome.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority,String> {


}
