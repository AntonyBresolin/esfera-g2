package com.esfera.g2.esferag2.repository;

import com.esfera.g2.esferag2.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNameContainingIgnoreCase(String name);
    List<Client> findClientsByCpfCnpj(String cpfCnpj);
    Page<Client> findClientsByNameContainingIgnoreCase(String name, Pageable pageable);
}
