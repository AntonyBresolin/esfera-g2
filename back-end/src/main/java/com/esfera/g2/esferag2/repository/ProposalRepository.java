package com.esfera.g2.esferag2.repository;

import com.esfera.g2.esferag2.model.Lead;
import com.esfera.g2.esferag2.model.Proposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    Optional<Proposal> findByIdLeadIdLead(Long leadId);
    Page<Proposal> findAll(Pageable pageable);
    Page<Proposal> findByIdLeadIdClientNameContainingIgnoreCase(String name, Pageable pageable);
}
