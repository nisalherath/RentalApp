package com.vehicleRental.rentalSystem.model;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.List;

@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String plate;
    private int year;
    private double mileage;
    private int passengerCount;
    private String vehicleType; // Add vehicleType field

    @ElementCollection
    private List<String> imageUrls; // Added field to store image URLs

    @Column(name = "rent_status") // Add rentStatus column
    private boolean rentStatus; // Indicates whether the vehicle is rented or not

    public Vehicle() {
    }

    public Vehicle(String name, String plate, int year, double mileage, int passengerCount, String vehicleType) {
        this.name = name;
        this.plate = plate;
        this.year = year;
        this.mileage = mileage;
        this.passengerCount = passengerCount;
        this.vehicleType = vehicleType; // Update constructor
        this.rentStatus = false; // Set default rent status to false (non-rented)
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public double getMileage() {
        return mileage;
    }

    public void setMileage(double mileage) {
        this.mileage = mileage;
    }

    public int getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(int passengerCount) {
        this.passengerCount = passengerCount;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public boolean isRentStatus() {
        return rentStatus;
    }

    public void setRentStatus(boolean rentStatus) {
        this.rentStatus = rentStatus;
    }
}
