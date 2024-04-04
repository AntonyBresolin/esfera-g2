package com.esfera.g2.esferag2.model;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

@Entity
public class Lead {

    public enum LeadResult {
        OCUPADO,
        DESLIGADO,
        ATENDIDO,
        CAIXA_POSTAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLead;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private java.sql.Timestamp date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadResult result;

    @Column(nullable = false)
    private double duration;

    @Column(nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "Client_idClient")
    private Client idClient;

    @OneToMany(mappedBy = "idLead", cascade = CascadeType.ALL)
    private List<Proposal> proposals;

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

    public LeadResult getResult() {
        return result;
    }

    public void setResult(LeadResult result) {
        this.result = result;
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

    public List<Proposal> getProposals() {
        return proposals;
    }

    public void setProposals(List<Proposal> proposals) {
        this.proposals = proposals;
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
