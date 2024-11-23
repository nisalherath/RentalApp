package com.vehicleRental.rentalSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import com.vehicleRental.rentalSystem.config.WebConfig;


@SpringBootApplication
@Import(WebConfig.class)
public class RentalSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentalSystemApplication.class, args);
	}

}
