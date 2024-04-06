package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Proposal;
import com.esfera.g2.esferag2.repository.ProposalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proposal")
public class ProposalController {

    @Autowired
    private ProposalRepository proposalRepository;

    @GetMapping
    public List<Proposal> getAllProposals() {
        return proposalRepository.findAll();
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
}
