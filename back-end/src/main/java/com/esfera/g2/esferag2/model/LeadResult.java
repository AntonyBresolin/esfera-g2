package com.esfera.g2.esferag2.model;

import jakarta.persistence.*;

@Entity
public class LeadResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLeadResult;

    @Column(nullable = false)
    private String result;

    public Long getIdLeadResult() {
        return idLeadResult;
    }

    public void setIdLeadResult(Long idLeadResult) {
        this.idLeadResult = idLeadResult;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
