package com.petcare.petservice.service;

import com.petcare.petservice.exception.PetNotFoundException;
import com.petcare.petservice.model.Pet;
import com.petcare.petservice.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new PetNotFoundException(id));
    }

    public Pet createPet(Pet pet) {
        pet.setId(null); // make sure the database generates the id
        return petRepository.save(pet);
    }

    public Pet updatePet(Long id, Pet updated) {
        Pet existing = getPetById(id);
        existing.setName(updated.getName());
        existing.setSpecies(updated.getSpecies());
        existing.setBreed(updated.getBreed());
        existing.setAge(updated.getAge());
        existing.setOwnerName(updated.getOwnerName());
        return petRepository.save(existing);
    }

    public void deletePet(Long id) {
        Pet existing = getPetById(id);
        petRepository.delete(existing);
    }
}