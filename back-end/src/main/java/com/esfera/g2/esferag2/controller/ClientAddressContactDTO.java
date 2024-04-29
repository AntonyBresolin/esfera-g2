package com.esfera.g2.esferag2.controller;

import com.esfera.g2.esferag2.model.Address;
import com.esfera.g2.esferag2.model.Client;
import com.esfera.g2.esferag2.model.ClientAddressContact;
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
import java.time.Clock;
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
    @Autowired
    private TypeContactController typeContactController;

    @PostMapping("/add")
    public ResponseEntity<?> addClientAddressContact(@RequestBody ClientAddressContact clientAddressContact) {
        try {
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

                System.out.println(name + " " + cpf + " " + company + " " + role + " " + date + " " + email + " " + phone + " " + cellphone + " " + whatsapp + " " + zipCode + " " + country + " " + state + " " + city + " " + street + " " + number);

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
}
