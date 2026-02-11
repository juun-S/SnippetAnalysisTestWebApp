package com.example.shoppingmall.service;

import com.example.shoppingmall.entity.User;
import com.example.shoppingmall.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired private UserRepository userRepository;

    public User register(User user) {
        // In a real application, you should hash the password here.
        // For this demo, we store it as is (NOT RECOMMENDED for production).
        return userRepository.save(user);
    }

    public Optional<User> login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }
}
