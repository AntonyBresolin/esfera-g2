package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Lead;
import com.esfera.g2.esferag2.repository.LeadRepository;
import com.esfera.g2.esferag2.repository.ProposalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lead")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;
    @Autowired
    private ProposalRepository proposalRepository;

    @GetMapping("/export")
    public ResponseEntity<?> exportLeads() {
        return ResponseEntity.ok(leadRepository.findAll());
    }

    @GetMapping("/all")
    public Page<Lead> getAllLeads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "idLead") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return leadRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public Lead getLeadById(@PathVariable Long id) {
        return leadRepository.findById(id).orElseThrow();
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

    @GetMapping("/name/{name}")
    public Page<Lead> getLeadsByContact(@PathVariable String name,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "20") int size,
                                        @RequestParam(defaultValue = "idLead") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return leadRepository.findLeadsByIdClientNameContainingIgnoreCase(name, pageable);
    }
}
