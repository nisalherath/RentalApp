package com.vehicleRental.rentalSystem.repository;

import com.vehicleRental.rentalSystem.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    @Query("SELECT DISTINCT v.name FROM Vehicle v WHERE LOWER(v.name) LIKE LOWER(concat('%', :partialName, '%'))")
    List<String> findDistinctNamesByPartialName(@Param("partialName") String partialName);

    @Query("SELECT v FROM Vehicle v WHERE v.plate = :plate")
    Optional<Vehicle> findByPlate(@Param("plate") String plate);

    @Query("SELECT v FROM Vehicle v WHERE v.vehicleType = :vehicleType")
    List<Vehicle> findByVehicleType(@Param("vehicleType") String vehicleType);

    List<Vehicle> findByRentStatus(boolean rentStatus);

    List<Vehicle> findByRentStatusAndNameContainingIgnoreCaseAndVehicleTypeIn(boolean rentStatus, String name, List<String> types);

    List<Vehicle> findByRentStatusAndNameContainingIgnoreCase(boolean rentStatus, String name);

    List<Vehicle> findByRentStatusAndVehicleTypeIn(boolean rentStatus, List<String> types);
}
