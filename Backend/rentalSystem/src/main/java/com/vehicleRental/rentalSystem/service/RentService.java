package com.vehicleRental.rentalSystem.service;

import com.vehicleRental.rentalSystem.model.Rent;
import com.vehicleRental.rentalSystem.model.Vehicle;
import com.vehicleRental.rentalSystem.repository.RentRepository;
import com.vehicleRental.rentalSystem.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RentService {

    private final RentRepository rentRepository;
    private final VehicleRepository vehicleRepository;

    @Autowired
    public RentService(RentRepository rentRepository, VehicleRepository vehicleRepository) {
        this.rentRepository = rentRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<Rent> getAllRents() {
        return rentRepository.findAll();
    }

    public Optional<Rent> getRentById(Long id) {
        return rentRepository.findById(id);
    }

    public Rent rentCar(Rent rent) {
        Vehicle vehicle = rent.getVehicle();
        vehicle.setRentStatus(true); // Set rent_status to true (rented)
        vehicleRepository.save(vehicle);
        return rentRepository.save(rent);
    }

    public Rent updateRent(Rent rent) {
        // Update the rental period or stop the rent based on the end date
        if (rent.getEndDate() != null && rent.getEndDate().after(new Date())) {
            rentRepository.save(rent);
            return rent;
        } else {
            // End the rent if the end date has passed
            endRent(rent.getId());
            return null; // Return null to indicate that the rent has ended
        }
    }


    private void endRent(Long rentId) {
        Optional<Rent> rentOptional = rentRepository.findById(rentId);
        if (rentOptional.isPresent()) {
            Rent rent = rentOptional.get();
            Vehicle vehicle = rent.getVehicle();
            vehicle.setRentStatus(false); // Set rent_status to false (not rented)
            vehicleRepository.save(vehicle);
            rentRepository.deleteById(rentId);
        }
    }

    public void deleteRentByVehicleId(Long vehicleId) {
        // Find the corresponding rent entry based on the vehicle ID
        Rent rent = rentRepository.findByVehicleId(vehicleId);
        if (rent != null) {
            rentRepository.deleteById(rent.getId());
        } else {
            throw new RuntimeException("Rent entry not found for vehicle ID: " + vehicleId);
        }
    }


    public void deleteRent(Long id) {
        rentRepository.deleteById(id);
    }

    public void removeRent(Long id) {
        rentRepository.deleteById(id);
    }


    public Rent getRentByVehicleId(Long vehicleId) {
        return rentRepository.findByVehicleId(vehicleId);
    }
}
