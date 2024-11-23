package com.vehicleRental.rentalSystem.service;

import com.vehicleRental.rentalSystem.model.Vehicle;
import com.vehicleRental.rentalSystem.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class VehicleServiceImplementation implements VehicleService {
    private static final Logger logger = LoggerFactory.getLogger(VehicleServiceImplementation.class);

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public void saveVehicle(Vehicle vehicle, List<String> imageUrls) {
        try {
            // Set the image URLs to the vehicle entity
            vehicle.setImageUrls(imageUrls);
            vehicleRepository.save(vehicle);
            logger.info("Vehicle saved successfully: {}", vehicle);
        } catch (Exception e) {
            logger.error("Error saving vehicle: {}", e.getMessage());
        }
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Optional<Vehicle> getVehicleByPlate(String plate) {
        return vehicleRepository.findByPlate(plate);
    }

    @Override
    public List<String> getDistinctVehicleNameSuggestions(String partialName) {
        return vehicleRepository.findDistinctNamesByPartialName(partialName);
    }

    @Override
    public List<Vehicle> getVehiclesByVehicleType(String vehicleType) {
        return vehicleRepository.findByVehicleType(vehicleType);
    }

    @Override
    public void updateMileage(int id, int newMileage) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setMileage(newMileage); // Update the mileage
            vehicleRepository.save(vehicle); // Save the updated vehicle
            logger.info("Mileage updated for vehicle with ID {}: New Mileage: {}", id, newMileage);
        } else {
            logger.error("Vehicle with ID {} not found", id);
            throw new RuntimeException("Vehicle not found with ID: " + id);
        }
    }
}
