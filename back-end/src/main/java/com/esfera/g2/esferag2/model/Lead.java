package com.esfera.g2.esferag2.model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "leads")
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLead;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private java.sql.Timestamp date;

    @OneToOne
    @JoinColumn(nullable = false)
    private LeadResult result;

    @Column(nullable = false)
    private double duration;

    @Column(nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "Client_idClient")
    private Client idClient;

    public Long getIdLead() {
        return idLead;
    }

    public void setIdLead(Long idLead) {
        this.idLead = idLead;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Client getIdClient() {
        return idClient;
    }

    public void setIdClient(Client idClient) {
        this.idClient = idClient;
    }

    public LeadResult getResult() {
        return result;
    }

    public void setResult(LeadResult result) {
        this.result = result;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Lead lead = (Lead) o;
        return Objects.equals(idLead, lead.idLead);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idLead);
    }
}
