package com.vehicleRental.rentalSystem.controller;

import com.vehicleRental.rentalSystem.model.Vehicle;
import com.vehicleRental.rentalSystem.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable("id") int id) {
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(id);
        return vehicleOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addVehicle(@ModelAttribute Vehicle vehicle, @RequestParam("files") MultipartFile[] files, @RequestParam("vehicleType") String vehicleType) {
        try {
            // Check if a vehicle with the same plate number already exists
            Optional<Vehicle> existingVehicleOptional = vehicleRepository.findByPlate(vehicle.getPlate());
            if (existingVehicleOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Vehicle with plate number already exists");
            }

            // Set the vehicle type
            vehicle.setVehicleType(vehicleType);

            // Set rent status to false (non-rented)
            vehicle.setRentStatus(false);

            // Save image URLs and set them to the vehicle object
            List<String> imageUrls = saveUploadedFiles(files);
            vehicle.setImageUrls(imageUrls);

            // Save only the image URLs to the database
            Vehicle savedVehicle = vehicleRepository.save(vehicle);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedVehicle);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add vehicle");
        }
    }


    private List<String> saveUploadedFiles(MultipartFile[] files) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue; // Skip empty files
            }

            // Save the uploaded image to the server
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Construct the URL for the uploaded image
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();
            imageUrls.add(imageUrl);
        }
        return imageUrls;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam("partialName") String partialName) {
        List<String> suggestions = vehicleRepository.findDistinctNamesByPartialName(partialName);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/rented")
    public ResponseEntity<List<Vehicle>> getRentedVehicles(
            @RequestParam(name = "searchTerm", required = false) String searchTerm,
            @RequestParam(name = "car", defaultValue = "false") boolean car,
            @RequestParam(name = "van", defaultValue = "false") boolean van,
            @RequestParam(name = "lorry", defaultValue = "false") boolean lorry) {

        List<Vehicle> rentedVehicles;

        if (searchTerm != null && !searchTerm.isEmpty()) {
            if (car || van || lorry) {
                rentedVehicles = vehicleRepository.findByRentStatusAndNameContainingIgnoreCaseAndVehicleTypeIn(
                        true, searchTerm, getVehicleTypes(car, van, lorry));
            } else {
                rentedVehicles = vehicleRepository.findByRentStatusAndNameContainingIgnoreCase(true, searchTerm);
            }
        } else {
            if (car || van || lorry) {
                rentedVehicles = vehicleRepository.findByRentStatusAndVehicleTypeIn(true, getVehicleTypes(car, van, lorry));
            } else {
                rentedVehicles = vehicleRepository.findByRentStatus(true);
            }
        }

        return ResponseEntity.ok(rentedVehicles);
    }




    @GetMapping("/not-rented")
    public ResponseEntity<List<Vehicle>> getNotRentedVehicles(
            @RequestParam(name = "searchTerm", required = false) String searchTerm,
            @RequestParam(name = "car", defaultValue = "false") boolean car,
            @RequestParam(name = "van", defaultValue = "false") boolean van,
            @RequestParam(name = "lorry", defaultValue = "false") boolean lorry) {

        List<Vehicle> notRentedVehicles;

        if (searchTerm != null && !searchTerm.isEmpty()) {
            if (car || van || lorry) {
                notRentedVehicles = vehicleRepository.findByRentStatusAndNameContainingIgnoreCaseAndVehicleTypeIn(
                        false, searchTerm, getVehicleTypes(car, van, lorry));
            } else {
                notRentedVehicles = vehicleRepository.findByRentStatusAndNameContainingIgnoreCase(false, searchTerm);
            }
        } else {
            if (car || van || lorry) {
                notRentedVehicles = vehicleRepository.findByRentStatusAndVehicleTypeIn(false, getVehicleTypes(car, van, lorry));
            } else {
                notRentedVehicles = vehicleRepository.findByRentStatus(false);
            }
        }

        return ResponseEntity.ok(notRentedVehicles);
    }


    private List<String> getVehicleTypes(boolean car, boolean van, boolean lorry) {
        List<String> types = new ArrayList<>();
        if (car) types.add("car");
        if (van) types.add("van");
        if (lorry) types.add("lorry");
        return types;
    }



    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable("id") int id, @RequestBody Vehicle updatedVehicle) {
        Optional<Vehicle> existingVehicleOptional = vehicleRepository.findById(id);
        if (existingVehicleOptional.isPresent()) {
            updatedVehicle.setId(id);
            Vehicle savedVehicle = vehicleRepository.save(updatedVehicle);
            return ResponseEntity.ok(savedVehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable("id") int id) {
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(id);
        if (vehicleOptional.isPresent()) {
            vehicleRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Vehicle>> fetchCars() {
        List<Vehicle> cars = vehicleRepository.findAll();
        return ResponseEntity.ok(cars);
    }

    @PutMapping("/{id}/updateRentStatus")
    public ResponseEntity<Vehicle> updateRentStatus(@PathVariable("id") int id) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setRentStatus(false); // Set rent status to false (not rented)
            // Save the updated vehicle
            Vehicle savedVehicle = vehicleRepository.save(vehicle);
            return ResponseEntity.ok(savedVehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/updateMileage")
    public ResponseEntity<Vehicle> updateMileage(@PathVariable("id") int id, @RequestParam("mileage") int newMileage) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            vehicle.setMileage(newMileage); // Update the mileage
            // Save the updated vehicle
            Vehicle savedVehicle = vehicleRepository.save(vehicle);
            return ResponseEntity.ok(savedVehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
