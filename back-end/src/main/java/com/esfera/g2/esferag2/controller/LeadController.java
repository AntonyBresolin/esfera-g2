package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.DateLeadForWeak;
import com.esfera.g2.esferag2.model.Lead;
import com.esfera.g2.esferag2.repository.LeadRepository;
import com.esfera.g2.esferag2.repository.ProposalRepository;
import com.esfera.g2.esferag2.service.LeadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping("/lead")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;
    @Autowired
    private ProposalRepository proposalRepository;
    @Autowired
    private LeadService leadService;

    @GetMapping("/statistics/{idUser}")
    public ResponseEntity<List<Object[]>> getLeadStatistics(@PathVariable Long idUser) {
        List<Object[]> statistics = leadService.getLeadStatistics(idUser);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/export/{idUser}")
    public ResponseEntity<?> exportLeads(@PathVariable Long idUser) {
        return ResponseEntity.ok(leadRepository.findLeadsByIdClientUserIdUser(idUser));
    }

    @GetMapping("/all/{idUser}")
    public Page<Lead> getAllLeads(
            @PathVariable Long idUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "idLead") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return leadRepository.findAllByIdClientUserIdUser(idUser, pageable);
    }

    @GetMapping("/{id}/{idUser}")
    public Lead getLeadById(@PathVariable Long id,
                            @PathVariable Long idUser) {
        return leadRepository.findByIdLeadAndIdClientUserIdUser(id, idUser);
    }

    @PostMapping
    public Lead createLead(@RequestBody Lead lead) {
        return leadRepository.save(lead);
    }

    @PutMapping("/{id}")
    public Lead updateLead(@PathVariable Long id, @RequestBody Lead leadDetails) {
        return leadRepository.findById(id)
                .map(lead -> {
                    lead.setContact(leadDetails.getContact());
                    lead.setDate(leadDetails.getDate());
                    lead.setDuration(leadDetails.getDuration());
                    lead.setDescription(leadDetails.getDescription());
                    lead.setCallTime(leadDetails.getCallTime());
                    lead.setResult(leadDetails.getResult());
                    return leadRepository.save(lead);
                })
                .orElseThrow();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id) {
        if (!leadRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        } else if (proposalRepository.existsByIdLeadIdLead(id)) {
            return new ResponseEntity<>("Existem propostas associadas a este lead, não é possível deletar", HttpStatus.CONFLICT);
        }
        try {
            leadRepository.deleteById(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar lead");
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/name/{name}/{idUser}")
    public Page<Lead> getLeadsByContact(@PathVariable String name,
                                        @PathVariable Long idUser,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "20") int size,
                                        @RequestParam(defaultValue = "idLead") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return leadRepository.findLeadsByIdClientNameContainingIgnoreCaseAndIdClientUserIdUser(name, idUser, pageable);
    }

    @GetMapping("/graph/leadsweek/{idUser}")
    public DateLeadForWeak getLeadsForWeakByUser(@PathVariable Long idUser) {
        ArrayList<Long> leads = new ArrayList<>();
        ArrayList<String> dates = new ArrayList<>();


        Timestamp startOfTheDay = new Timestamp(getFirstTimeOfTheDay().getTimeInMillis());
        Timestamp endOfTheDay = new Timestamp(getLastTimeOfTheDay().getTimeInMillis());

        for (int i = 0; i < 7; i++) {
            leads.add(leadRepository.countByDateBetweenAndIdClientUserIdUser(startOfTheDay, endOfTheDay, idUser));
            dates.add(startOfTheDay.toString().substring(0, 10));

            startOfTheDay = new Timestamp(startOfTheDay.getTime() + 86400000);
            endOfTheDay = new Timestamp(endOfTheDay.getTime() + 86400000);
        }

        return new DateLeadForWeak(leads, dates);
    }

    private Calendar getFirstTimeOfTheDay(){
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(timestamp);
        calendar.add(Calendar.DAY_OF_MONTH, -7);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);

        return calendar;
    }

    private Calendar getLastTimeOfTheDay(){
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(timestamp);
        calendar.add(Calendar.DAY_OF_MONTH, -7);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);

        return calendar;
    }


}
