package com.example.securitydome.repository;

import com.example.securitydome.domain.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository   extends JpaRepository<Resource,String> {


}
