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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @GetMapping("/all")
    public List<ClientAddressContact> listAllClientAddressContact() {
        List<Client> clients = clientRepository.findAll();
        List<Address> addresses = addressRepository.findAll();
        List<Contact> contacts = contactRepository.findAll();
        List<ClientAddressContact> clientAddressContacts = new ArrayList<>();

        // Mapear endereços e contatos por id do cliente para evitar loops aninhados excessivos
        Map<Long, List<Address>> addressMap = addresses.stream()
                .collect(Collectors.groupingBy(a -> a.getIdClient().getIdClient()));
        Map<Long, List<Contact>> contactMap = contacts.stream()
                .collect(Collectors.groupingBy(c -> c.getIdClient().getIdClient()));

        for (Client client : clients) {
            List<Address> clientAddresses = addressMap.getOrDefault(client.getIdClient(), new ArrayList<>());
            List<Contact> clientContacts = contactMap.getOrDefault(client.getIdClient(), new ArrayList<>());

            // Pode haver mais de um endereço por cliente, então precisamos criar um ClientAddressContact para cada um
            for (Address address : clientAddresses) {
                ClientAddressContact clientAddressContact = new ClientAddressContact();
                clientAddressContact.setClient(client);
                clientAddressContact.setAddress(address);
                clientAddressContact.setContact(clientContacts);  // Agora só inclui contatos que pertencem ao cliente
                clientAddressContacts.add(clientAddressContact);
            }
        }

        return clientAddressContacts;
    }

}
