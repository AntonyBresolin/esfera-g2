package com.esfera.g2.esferag2;

import com.esfera.g2.esferag2.controller.ProposalController;
import com.esfera.g2.esferag2.model.Proposal;
import com.esfera.g2.esferag2.repository.ProposalRepository;
import com.esfera.g2.esferag2.service.ProposalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProposalControllerTest {

    @Mock
    private ProposalService proposalService;

    @Mock
    private ProposalRepository proposalRepository;

    @InjectMocks
    private ProposalController proposalController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetFaturamento() {
    }

    @Test
    void testGetProposalStatistics() {
        Long idUser = 1L;
        List<Object[]> statistics = Arrays.asList(new Object[]{"stat1"}, new Object[]{"stat2"});
        when(proposalService.getProposalStatistics(idUser, "all")).thenReturn(statistics);

        ResponseEntity<List<Object[]>> response = proposalController.getProposalStatistics(idUser, "all");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(statistics, response.getBody());
    }


    @Test
    void testGetAllProposals() {
        Long idUser = 1L;
        int page = 0;
        int size = 20;
        String sortBy = "idProposal";
        Page<Proposal> proposals = new PageImpl<>(Arrays.asList(new Proposal(), new Proposal()));
        when(proposalController.getAllProposals(idUser, page, size, sortBy)).thenReturn(proposals);

        Page<Proposal> response = proposalController.getAllProposals(idUser, page, size, sortBy);

        assertEquals(proposals, response);
    }

    @Test
    void testGetProposalById() {
        Long id = 1L;
        Long idUser = 1L;
        Proposal proposal = new Proposal();
        when(proposalController.getProposalById(id, idUser)).thenReturn(proposal);

        Proposal response = proposalController.getProposalById(id, idUser);

        assertEquals(proposal, response);
    }



    @Test
    void testGetAllProposalsByClientName() {
        Long idUser = 1L;
        String name = "test";
        int page = 0;
        int size = 20;
        String sortBy = "idProposal";
        Page<Proposal> proposals = new PageImpl<>(Arrays.asList(new Proposal(), new Proposal()));
        when(proposalController.getAllProposalsByClientName(page, size, sortBy, name, idUser)).thenReturn(proposals);

        Page<Proposal> response = proposalController.getAllProposalsByClientName(page, size, sortBy, name, idUser);

        assertEquals(proposals, response);
    }


}