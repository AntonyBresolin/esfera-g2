package com.esfera.g2.esferag2.model;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTeam;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String teamcode;

    @OneToMany(mappedBy = "idTeam", cascade = CascadeType.ALL)
    private List<User> users;

    public Long getIdTeam() {
        return idTeam;
    }

    public void setIdTeam(Long idTeam) {
        this.idTeam = idTeam;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeamcode() {
        return teamcode;
    }

    public void setTeamcode(String teamcode) {
        this.teamcode = teamcode;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Team team = (Team) o;
        return Objects.equals(idTeam, team.idTeam);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idTeam);
    }
}
