package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Lead;
import com.esfera.g2.esferag2.model.Proposal;
import com.esfera.g2.esferag2.model.StatusProposal;
import com.esfera.g2.esferag2.model.User;
import com.esfera.g2.esferag2.repository.LeadRepository;
import com.esfera.g2.esferag2.repository.ProposalRepository;
import com.esfera.g2.esferag2.repository.StatusProposalRepository;
import com.esfera.g2.esferag2.repository.UserRepository;
import com.esfera.g2.esferag2.service.ProposalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/proposal")
public class ProposalController {

    @Autowired
    private ProposalRepository proposalRepository;
    @Autowired
    private LeadRepository leadRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StatusProposalRepository statusProposalRepository;
    @Autowired
    private ProposalService proposalService;

    private static final Logger logger = Logger.getLogger(ProposalController.class.getName());

    @GetMapping("/faturamento")
    public ResponseEntity<Map<String, Object>> getFaturamento() {
        try {
            Double totalFaturamento = proposalRepository.sumValue();
            Double faturamentoMesAnterior = proposalRepository.sumValueLastMonth();

            if (totalFaturamento == null) totalFaturamento = 0.0;
            if (faturamentoMesAnterior == null) faturamentoMesAnterior = 0.0;

            double crescimentoPercentual = 0;
            if (faturamentoMesAnterior > 0) {
                crescimentoPercentual = ((totalFaturamento - faturamentoMesAnterior) / faturamentoMesAnterior) * 100;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("totalFaturamento", totalFaturamento);
            response.put("crescimentoPercentual", crescimentoPercentual);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.severe("Erro ao calcular o faturamento: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<List<Object[]>> getProposalStatistics() {
        List<Object[]> statistics = proposalService.getProposalStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/export")
    public ResponseEntity<?> exportProposals() {
        return ResponseEntity.ok(proposalRepository.findAll());
    }

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

    @PostMapping(consumes = "multipart/form-data")
    public Proposal createProposal(@RequestParam("idLead") Long idLead,
                                   @RequestParam("idUser") Long idUser,
                                   @RequestParam("completionDate") String completionDateStr,
                                   @RequestParam("service") String service,
                                   @RequestParam("value") String value,
                                   @RequestParam("description") String description,
                                   @RequestParam("idStatusProposal") Long idStatusProposal,
                                   @RequestPart(value = "file", required = false) MultipartFile file) {
        if (idLead == null || completionDateStr == null) {
            throw new IllegalArgumentException("O campo idClient e a data de conclusão são obrigatórios.");
        }
        Lead lead = leadRepository.findById(idLead).orElseThrow();
        User user = userRepository.findById(idUser).orElseThrow();
        StatusProposal statusProposal = statusProposalRepository.findById(idStatusProposal).orElseThrow();

        // Converter a string para Timestamp
        Timestamp completionDate = Timestamp.valueOf(completionDateStr + " 00:00:00");
        double valueTratado = (!value.isEmpty() ? Double.parseDouble(value) : 0.0);

        Proposal proposal = new Proposal();
        proposal.setIdLead(lead);
        proposal.setIdUser(user);
        proposal.setProposalDate(completionDate);
        proposal.setService(service);
        proposal.setValue(valueTratado);
        proposal.setDescription(description);
        proposal.setIdStatusProposal(statusProposal);

        if (file != null) {
            try {
                proposal.setFile(file.getBytes());
            } catch (IOException e) {
                e.printStackTrace(); // TODO - Melhorar tratamento de erro
            }
        }

        return proposalRepository.save(proposal);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public Proposal updateProposal(@PathVariable Long id,
                                   @RequestParam("idLead") Long idLead,
                                   @RequestParam("idUser") Long idUser,
                                   @RequestParam("completionDate") String completionDateStr,
                                   @RequestParam("service") String service,
                                   @RequestParam("value") Double value,
                                   @RequestParam("description") String description,
                                   @RequestParam("idStatusProposal") Long idStatusProposal,
                                   @RequestPart(value = "file", required = false) MultipartFile file) {
        return proposalRepository.findById(id)
                .map(proposal -> {
                    Lead lead = leadRepository.findById(idLead).orElseThrow();
                    User user = userRepository.findById(idUser).orElseThrow();
                    StatusProposal statusProposal = statusProposalRepository.findById(idStatusProposal).orElseThrow();

                    // Converter a string para Timestamp
                    Timestamp completionDate = Timestamp.valueOf(completionDateStr + " 00:00:00");


                    proposal.setIdLead(lead);
                    proposal.setIdUser(user);
                    proposal.setProposalDate(completionDate);
                    proposal.setService(service);
                    proposal.setValue(value);
                    proposal.setDescription(description);
                    proposal.setIdStatusProposal(statusProposal);

                    if (file != null) {
                        try {
                            proposal.setFile(file.getBytes());
                        } catch (IOException e) {
                            e.printStackTrace(); // TODO - Melhorar tratamento de erro
                        }
                    }

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

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Proposal proposal = proposalRepository.findById(id).orElseThrow();
        byte[] file = proposal.getFile();

        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF); // Defina o tipo de arquivo apropriado
        headers.setContentDispositionFormData("attachment", "proposal_" + id + ".pdf");
        headers.setContentLength(file.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(file);
    }
}
