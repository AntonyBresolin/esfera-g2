package com.esfera.g2.esferag2.repository;

import com.esfera.g2.esferag2.model.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    Boolean existsByIdClientIdClient(Long leadId);
    Page<Lead> findAll(Pageable pageable);

    Long countByDateBetweenAndIdClientUserIdUser(Timestamp start, Timestamp end, Long idUser);

    Page<Lead> findLeadsByIdClientNameContainingIgnoreCaseAndIdClientUserIdUser(String name, Long idUser, Pageable pageable);


    Page<Lead> findAllByIdClientUserIdUser(Long idUser, Pageable pageable);

    Lead findByIdLeadAndIdClientUserIdUser(Long id, Long idUser);

    List<Lead> findLeadsByIdClientUserIdUser(Long idUser);

    @Query("SELECT r.result, COUNT(l) FROM Lead l JOIN l.result r JOIN l.idClient c JOIN c.user u WHERE u.idUser = :idUser AND (CASE WHEN :period = 'day' THEN DATE(l.date) = CURRENT_DATE WHEN :period = 'week' THEN YEARWEEK(l.date, 1) = YEARWEEK(CURRENT_DATE, 1) WHEN :period = 'month' THEN YEAR(l.date) = YEAR(CURRENT_DATE) AND MONTH(l.date) = MONTH(CURRENT_DATE) ELSE TRUE END) GROUP BY r.result")
    List<Object[]> countLeadsByResult(@Param("idUser") Long idUser, @Param("period") String period);
}
