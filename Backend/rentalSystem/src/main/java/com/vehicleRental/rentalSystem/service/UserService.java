package com.vehicleRental.rentalSystem.service;

import com.vehicleRental.rentalSystem.model.User;
import com.vehicleRental.rentalSystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public void register(User user) {
        // Check if user with given username already exists
        if (findByUsername(user.getUsername()) != null) {
            throw new IllegalArgumentException("User with this username already exists");
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // Save the user
        save(user);
    }

    // Other methods for user management, such as update, delete, etc.
}
