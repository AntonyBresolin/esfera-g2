package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Address;
import com.esfera.g2.esferag2.model.Client;
import com.esfera.g2.esferag2.model.ClientAddressContact;
import com.esfera.g2.esferag2.model.Contact;
import com.esfera.g2.esferag2.repository.AddressRepository;
import com.esfera.g2.esferag2.repository.ClientRepository;
import com.esfera.g2.esferag2.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client-address-contact")
public class ClientAddressContactDTO {

    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ContactRepository contactRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addClientAddressContact(@RequestBody ClientAddressContact clientAddressContact) {
        try{
            clientRepository.save(clientAddressContact.getClient());
            Address address = clientAddressContact.getAddress();
            address.setIdClient(clientAddressContact.getClient());
            addressRepository.save(address);
            for (Contact contact : clientAddressContact.getContact()) {
                contact.setIdClient(clientAddressContact.getClient());
                contactRepository.save(contact);
            }
            return ResponseEntity.status(201).body("Adicionado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao adicionar!");
        }
    }
}
