package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Client;
import com.esfera.g2.esferag2.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @GetMapping("/{id}")
    public Client getClientById(@PathVariable Long id) {
        return clientRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @RequestBody Client clientDetails) {
        return clientRepository.findById(id)
                .map(client -> {
                    client.setName(clientDetails.getName());
                    client.setCpfCnpj(clientDetails.getCpfCnpj());
                    client.setCompany(clientDetails.getCompany());
                    client.setRole(clientDetails.getRole());
                    return clientRepository.save(client);
                })
                .orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientRepository.deleteById(id);
    }
}