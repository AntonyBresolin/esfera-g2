package com.esfera.g2.esferag2.repository;

import com.esfera.g2.esferag2.model.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    Optional<Lead> findByIdClientIdClient(Long leadId);
}
