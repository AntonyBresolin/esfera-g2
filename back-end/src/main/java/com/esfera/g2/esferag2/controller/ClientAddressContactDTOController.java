package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Address;
import com.esfera.g2.esferag2.model.Client;
import com.esfera.g2.esferag2.model.ClientAddressContactDTO;
import com.esfera.g2.esferag2.model.Contact;
import com.esfera.g2.esferag2.repository.AddressRepository;
import com.esfera.g2.esferag2.repository.ClientRepository;
import com.esfera.g2.esferag2.repository.ContactRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/client-address-contact")
public class ClientAddressContactDTOController {

    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private TypeContactController typeContactController;

    @PostMapping("/add")
    public ResponseEntity<?> addClientAddressContact(@RequestBody ClientAddressContactDTO clientAddressContactDTO) {
        try {
            clientRepository.save(clientAddressContactDTO.getClient());
            Address address = clientAddressContactDTO.getAddress();
            address.setIdClient(clientAddressContactDTO.getClient());
            addressRepository.save(address);
            for (Contact contact : clientAddressContactDTO.getContact()) {
                contact.setIdClient(clientAddressContactDTO.getClient());
                contactRepository.save(contact);
            }
            return ResponseEntity.status(201).body("Adicionado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao adicionar!");
        }
    }

    @GetMapping("/all")
    public List<ClientAddressContactDTO> listAllClientAddressContact() {
        List<Client> clients = clientRepository.findAll();
        List<Address> addresses = addressRepository.findAll();
        List<Contact> contacts = contactRepository.findAll();
        List<ClientAddressContactDTO> clientAddressContactDTOS = new ArrayList<>();

        // Mapear endereços e contatos por id do cliente para evitar loops aninhados excessivos
        Map<Long, List<Address>> addressMap = addresses.stream()
                .collect(Collectors.groupingBy(a -> a.getIdClient().getIdClient()));
        Map<Long, List<Contact>> contactMap = contacts.stream()
                .collect(Collectors.groupingBy(c -> c.getIdClient().getIdClient()));

        for (Client client : clients) {
            List<Address> clientAddresses = addressMap.getOrDefault(client.getIdClient(), new ArrayList<>());
            List<Contact> clientContacts = contactMap.getOrDefault(client.getIdClient(), new ArrayList<>());

            for (Address address : clientAddresses) {
                ClientAddressContactDTO clientAddressContactDTO = new ClientAddressContactDTO();
                clientAddressContactDTO.setClient(client);
                clientAddressContactDTO.setAddress(address);
                clientAddressContactDTO.setContact(clientContacts);
                clientAddressContactDTOS.add(clientAddressContactDTO);
            }
        }

        return clientAddressContactDTOS;
    }

    @PostMapping("/import")
    public ResponseEntity<?> addClientAddressContact(@RequestParam("file") MultipartFile file) {
        try {
            Reader reader = new InputStreamReader(file.getInputStream());
            CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withHeader());

            for (CSVRecord record : csvParser) {
                String name = record.get("Nome");
                String cpf = record.get("cpf");
                String company = record.get("empresa");
                String role = record.get("cargo");

                //TODO - Implementar isso isso
                String date = record.get("data");


                String email = record.get("email");
                String phone = record.get("telefone");
                String cellphone = record.get("celular");
                String whatsapp = record.get("whatsapp");
                String zipCode = record.get("cep");
                String country = record.get("pais");
                String state = record.get("estado");
                String city = record.get("cidade");
                String street = record.get("rua");
                String number = record.get("numero");

                Client client = new Client(name, cpf, company, role, new Timestamp(System.currentTimeMillis()));
                clientRepository.save(client);

                Address address = new Address(zipCode, country, state, city, street, number);
                address.setIdClient(client);
                addressRepository.save(address);

                List<Contact> contacts = new ArrayList<>();
                contacts.add(new Contact(cellphone, typeContactController.getTypeContactById(1L), client));
                contacts.add(new Contact(phone, typeContactController.getTypeContactById(2L), client));
                contacts.add(new Contact(whatsapp, typeContactController.getTypeContactById(3L), client));
                contacts.add(new Contact(email, typeContactController.getTypeContactById(4L), client));

                contactRepository.saveAll(contacts);
            }
            return ResponseEntity.status(201).body("Arquivo CSV processado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao processar o arquivo CSV!");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClientAddressContact(@PathVariable Long id) {
        try {
            Client c = clientRepository.findById(id).orElseThrow();

            for (Address address : addressRepository.findByIdClient(c)) {
                addressRepository.deleteById(address.getIdAddress());
            }
            for (Contact contact : contactRepository.findByIdClient(c)) {
                    contactRepository.deleteById(contact.getIdContact());
            }

            clientRepository.deleteById(id);
            return ResponseEntity.status(200).body("Deletado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar!");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteClientAddressContacts(@RequestBody List<Long> ids) {
        try {
            for (Long id : ids) {
                Client c = clientRepository.findById(id).orElseThrow();

                for (Address address : addressRepository.findByIdClient(c)) {
                    addressRepository.deleteById(address.getIdAddress());
                }
                for (Contact contact : contactRepository.findByIdClient(c)) {
                    contactRepository.deleteById(contact.getIdContact());
                }

                clientRepository.deleteById(id);
            }
            return ResponseEntity.status(200).body("Deletado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar!");
        }
    }

    @PutMapping("/update/{id}")
    public ClientAddressContactDTO updateClientAddressContact(@PathVariable Long id, @RequestBody ClientAddressContactDTO clientAddressContactDTO) {
        Client client = clientRepository.findById(id).orElseThrow();
        client.setName(clientAddressContactDTO.getClient().getName());
        client.setCpfCnpj(clientAddressContactDTO.getClient().getCpfCnpj());
        client.setCompany(clientAddressContactDTO.getClient().getCompany());
        client.setRole(clientAddressContactDTO.getClient().getRole());
        clientRepository.save(client);

        Address address = addressRepository.findByIdClient(client).get(0);
        address.setZipCode(clientAddressContactDTO.getAddress().getZipCode());
        address.setCountry(clientAddressContactDTO.getAddress().getCountry());
        address.setState(clientAddressContactDTO.getAddress().getState());
        address.setCity(clientAddressContactDTO.getAddress().getCity());
        address.setStreet(clientAddressContactDTO.getAddress().getStreet());
        address.setNumber(clientAddressContactDTO.getAddress().getNumber());
        addressRepository.save(address);

        List<Contact> contacts = contactRepository.findByIdClient(client);

        for(Contact contact : contacts) {
            if(contact.getIdTypeContact().getIdTypeContact() == 1) {
                contact.setData(clientAddressContactDTO.getContact().get(0).getData());
            } else if(contact.getIdTypeContact().getIdTypeContact() == 2) {
                contact.setData(clientAddressContactDTO.getContact().get(1).getData());
            } else if(contact.getIdTypeContact().getIdTypeContact() == 3) {
                contact.setData(clientAddressContactDTO.getContact().get(2).getData());
            } else if(contact.getIdTypeContact().getIdTypeContact() == 4) {
                contact.setData(clientAddressContactDTO.getContact().get(3).getData());
            }
            contactRepository.save(contact);
        }
        return clientAddressContactDTO;
    }

    @GetMapping("/{id}")
    public ClientAddressContactDTO getClientAddressContactById(@PathVariable Long id) {
        Client client = clientRepository.findById(id).orElseThrow();
        Address address = addressRepository.findByIdClient(client).get(0);
        List<Contact> contacts = contactRepository.findByIdClient(client);
        ClientAddressContactDTO clientAddressContactDTO = new ClientAddressContactDTO();
        clientAddressContactDTO.setClient(client);
        clientAddressContactDTO.setAddress(address);
        clientAddressContactDTO.setContact(contacts);
        return clientAddressContactDTO;
    }
}
