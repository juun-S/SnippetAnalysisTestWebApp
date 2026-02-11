package com.example.shoppingmall.repository;

import com.example.shoppingmall.entity.Cart;
import com.example.shoppingmall.entity.User;
import com.example.shoppingmall.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);
    Optional<Cart> findByUserAndProduct(User user, Product product);
}
