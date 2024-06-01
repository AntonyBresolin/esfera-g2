package com.esfera.g2.esferag2.repository;

import com.esfera.g2.esferag2.model.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    Boolean existsByIdClientIdClient(Long leadId);
    Page<Lead> findAll(Pageable pageable);

    Long countLeadsByDateBetween(Timestamp start, Timestamp end);

    Page<Lead> findLeadsByIdClientNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT r.result, COUNT(l) FROM Lead l JOIN l.result r GROUP BY r.result")
    List<Object[]> countLeadsByResult();
}
