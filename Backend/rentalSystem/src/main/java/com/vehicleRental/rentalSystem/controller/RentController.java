package com.vehicleRental.rentalSystem.controller;

import com.vehicleRental.rentalSystem.model.Rent;
import com.vehicleRental.rentalSystem.service.RentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rents")
public class RentController {

    private final RentService rentService;

    @Autowired
    public RentController(RentService rentService) {
        this.rentService = rentService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Rent>> getAllRents() {
        List<Rent> rents = rentService.getAllRents();
        return ResponseEntity.ok(rents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rent> getRentById(@PathVariable("id") Long id) {
        return rentService.getRentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addRent(@RequestBody Rent rent) {
        try {
            Rent savedRent = rentService.rentCar(rent);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to rent car: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateRent(@RequestBody Rent rent) {
        try {
            Rent updatedRent = rentService.updateRent(rent);
            if (updatedRent != null) {
                return ResponseEntity.ok(updatedRent);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update rent: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove/{vehicleId}")
    public ResponseEntity<?> removeRentByVehicleId(@PathVariable("vehicleId") Long vehicleId) {
        try {
            rentService.deleteRentByVehicleId(vehicleId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to remove rent: " + e.getMessage());
        }
    }


    @GetMapping("/rented")
    public ResponseEntity<List<Rent>> getRentedCars() {
        List<Rent> rentedCars = rentService.getAllRents();
        return ResponseEntity.ok(rentedCars);
    }

    @PutMapping("/update/{vehicleId}")
    public ResponseEntity<?> updateRentDates(@PathVariable("vehicleId") Long vehicleId, @RequestBody Rent updatedRent) {
        try {
            Rent existingRent = rentService.getRentByVehicleId(vehicleId); // Find rent by vehicleId
            if (existingRent == null) {
                return ResponseEntity.notFound().build();
            }

            // Update only the start and end dates
            existingRent.setStartDate(updatedRent.getStartDate());
            existingRent.setEndDate(updatedRent.getEndDate());

            Rent updatedRentDates = rentService.updateRent(existingRent);
            return ResponseEntity.ok(updatedRentDates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update rent dates: " + e.getMessage());
        }
    }


}
