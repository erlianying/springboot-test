package com.example.securitydome.domain;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table
public class Authority {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name="uuid",strategy = "uuid2" )
    private String id;

    //资源名称
    private String name;

    @ManyToMany(targetEntity = Role.class)
    @JoinTable(name = "RoleAuthority",
    joinColumns = @JoinColumn(name = "authority_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id",referencedColumnName = "id"))
    private List<Role> roles;

    @ManyToMany(targetEntity = Resource.class)
    @JoinTable(name = "AuthorityResource",
            joinColumns = @JoinColumn(name = "authority_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "resource_id",referencedColumnName = "id"))
    private  List<Resource> resource;

    //创建时间
    private Date createTime;

    //更新时间
    private Date updateTime;

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

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public List<Resource> getResource() {
        return resource;
    }

    public void setResource(List<Resource> resource) {
        this.resource = resource;
    }
}
