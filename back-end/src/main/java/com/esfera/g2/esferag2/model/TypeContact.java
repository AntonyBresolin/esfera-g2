package com.esfera.g2.esferag2.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class TypeContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTypeContact;
    private String type;

    public Long getIdTypeContact() {
        return idTypeContact;
    }

    public void setIdTypeContact(Long idTypeContact) {
        this.idTypeContact = idTypeContact;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
