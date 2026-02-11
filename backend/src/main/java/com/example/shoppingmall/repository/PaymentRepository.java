package com.example.shoppingmall.repository;

import com.example.shoppingmall.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByExternalKey(String externalKey);

    List<Payment> findByAccountId(Long accountId);
}
