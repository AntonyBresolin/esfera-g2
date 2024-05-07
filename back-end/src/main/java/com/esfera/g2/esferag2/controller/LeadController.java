package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Lead;
import com.esfera.g2.esferag2.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lead")
public class LeadController {

    @Autowired
    private LeadRepository leadRepository;


    @GetMapping("/all")
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
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
                    return leadRepository.save(lead);
                })
                .orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void deleteLead(@PathVariable Long id) {
        leadRepository.deleteById(id);
    }
}
