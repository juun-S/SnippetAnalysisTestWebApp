package com.example.shoppingmall.repository;

import com.example.shoppingmall.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByAccountId(Long accountId);

    Optional<PaymentMethod> findByExternalKey(String externalKey);
}
