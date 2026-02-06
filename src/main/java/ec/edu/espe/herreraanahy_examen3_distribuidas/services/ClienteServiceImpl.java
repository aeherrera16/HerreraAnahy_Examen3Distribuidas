package ec.edu.espe.herreraanahy_examen3_distribuidas.services;

import ec.edu.espe.herreraanahy_examen3_distribuidas.exceptions.ResourceNotFoundException;
import ec.edu.espe.herreraanahy_examen3_distribuidas.exceptions.DuplicateResourceException;
import ec.edu.espe.herreraanahy_examen3_distribuidas.models.Cliente;
import ec.edu.espe.herreraanahy_examen3_distribuidas.repositories.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    @Override
    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }

    @Override
    public Optional<Cliente> findByIdentificacion(String identificacion) {
        return clienteRepository.findByIdentificacion(identificacion);
    }

    @Override
    public Cliente save(Cliente cliente) {
        // Validar que no exista duplicado por identificación
        if (clienteRepository.existsByIdentificacion(cliente.getIdentificacion())) {
            throw new DuplicateResourceException(
                    "Ya existe un cliente con la identificación: " + cliente.getIdentificacion());
        }
        // Validar que no exista duplicado por email
        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new DuplicateResourceException("Ya existe un cliente con el email: " + cliente.getEmail());
        }
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente update(Long id, Cliente clienteDetails) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + id));

        // Verificar si la identificación cambió y ya existe
        if (!cliente.getIdentificacion().equals(clienteDetails.getIdentificacion())
                && clienteRepository.existsByIdentificacion(clienteDetails.getIdentificacion())) {
            throw new DuplicateResourceException(
                    "Ya existe un cliente con la identificación: " + clienteDetails.getIdentificacion());
        }

        // Verificar si el email cambió y ya existe
        if (!cliente.getEmail().equals(clienteDetails.getEmail())
                && clienteRepository.existsByEmail(clienteDetails.getEmail())) {
            throw new DuplicateResourceException("Ya existe un cliente con el email: " + clienteDetails.getEmail());
        }

        cliente.setNombres(clienteDetails.getNombres());
        cliente.setIdentificacion(clienteDetails.getIdentificacion());
        cliente.setEmail(clienteDetails.getEmail());
        cliente.setTelefono(clienteDetails.getTelefono());

        return clienteRepository.save(cliente);
    }

    @Override
    public void deleteById(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado con id: " + id);
        }
        clienteRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return clienteRepository.existsById(id);
    }
}
