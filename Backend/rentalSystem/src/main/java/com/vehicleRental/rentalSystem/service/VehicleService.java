package com.vehicleRental.rentalSystem.service;

import com.vehicleRental.rentalSystem.model.Vehicle;

import java.util.List;
import java.util.Optional;

public interface VehicleService {
    void saveVehicle(Vehicle vehicle, List<String> imageUrls); // Add imageUrls parameter
    List<Vehicle> getAllVehicles();
    Optional<Vehicle> getVehicleByPlate(String plate);
    List<String> getDistinctVehicleNameSuggestions(String partialName);
    List<Vehicle> getVehiclesByVehicleType(String vehicleType); // New method
    void updateMileage(int id, int newMileage);
}
