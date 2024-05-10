package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Proposal;
import com.esfera.g2.esferag2.repository.ProposalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proposal")
public class ProposalController {

    @Autowired
    private ProposalRepository proposalRepository;



    @GetMapping("/all")
    public Page<Proposal> getAllProposals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "idProposal") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return proposalRepository.findAll(pageable);
    }
    @GetMapping("/{id}")
    public Proposal getProposalById(@PathVariable Long id) {
        return proposalRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Proposal createProposal(@RequestBody Proposal proposal) {
        return proposalRepository.save(proposal);
    }

    @PutMapping("/{id}")
    public Proposal updateProposal(@PathVariable Long id, @RequestBody Proposal proposalDetails) {
        return proposalRepository.findById(id)
                .map(proposal -> {
                    proposal.setService(proposalDetails.getService());
                    proposal.setProposalDate(proposalDetails.getProposalDate());
                    proposal.setValue(proposalDetails.getValue());
                    proposal.setIdStatusProposal(proposalDetails.getIdStatusProposal());
                    proposal.setDescription(proposalDetails.getDescription());
                    proposal.setFile(proposalDetails.getFile());
                    return proposalRepository.save(proposal);
                })
                .orElseThrow();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProposal(@PathVariable Long id) {
        try {
            proposalRepository.deleteById(id);
            return new ResponseEntity<>("Deletado com sucesso!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("ID não encontrado!", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search/{name}")
    public Page<Proposal> getAllProposalsByClientName(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "idProposal") String sortBy,
            @PathVariable String name) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return proposalRepository.findByIdLeadIdClientNameContainingIgnoreCase(name, pageable);
    }
}
