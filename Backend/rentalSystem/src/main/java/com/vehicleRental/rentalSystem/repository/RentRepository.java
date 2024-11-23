package com.vehicleRental.rentalSystem.repository;

import com.vehicleRental.rentalSystem.model.Rent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentRepository extends JpaRepository<Rent, Long> {
    Rent findByVehicleId(Long vehicleId);
}
