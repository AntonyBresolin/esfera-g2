package com.esfera.g2.esferag2.repository;

import com.esfera.g2.esferag2.model.Lead;
import com.esfera.g2.esferag2.model.Proposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    Boolean existsByIdLeadIdLead(Long leadId);

    Page<Proposal> findByIdLeadIdClientUserIdUser(Long idUser, Pageable pageable);

    List<Proposal> findByIdLeadIdClientUserIdUser(Long idUser);

    Page<Proposal> findByIdLeadIdClientNameContainingIgnoreCaseAndIdLeadIdClientUserIdUser(String name, Long idUser, Pageable pageable);

    Proposal findByIdProposalAndIdLeadIdClientUserIdUser(Long id, Long idUser);


    @Query("SELECT SUM(p.value) FROM Proposal p WHERE p.proposalDate >= :startDate AND p.proposalDate < :endDate")
    Double sumValue(@Param("startDate") Timestamp startDate, @Param("endDate") Timestamp endDate);

    default Double sumValue() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate startOfNextMonth = startOfMonth.plusMonths(1);
        return sumValue(Timestamp.valueOf(startOfMonth.atStartOfDay()), Timestamp.valueOf(startOfNextMonth.atStartOfDay()));
    }

    default Double sumValueLastMonth() {
        LocalDate now = LocalDate.now();
        LocalDate startOfLastMonth = now.minusMonths(1).withDayOfMonth(1);
        LocalDate startOfThisMonth = now.withDayOfMonth(1);
        return sumValue(Timestamp.valueOf(startOfLastMonth.atStartOfDay()), Timestamp.valueOf(startOfThisMonth.atStartOfDay()));
    }

    @Query("SELECT sp.name, COUNT(p) FROM Proposal p JOIN p.idStatusProposal sp GROUP BY sp.name")
    List<Object[]> countProposalsByStatus();
}
