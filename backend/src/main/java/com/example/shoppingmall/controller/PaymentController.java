package com.example.shoppingmall.controller;

import com.example.shoppingmall.dto.PaymentRequest;
import com.example.shoppingmall.entity.Payment;
import com.example.shoppingmall.entity.User;
import com.example.shoppingmall.service.PaymentService;
import com.example.shoppingmall.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    @Autowired
    public PaymentController(PaymentService paymentService, UserService userService) {
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentRequest request) {
        User user = userService.getUserById(request.getUserId()); // Assuming UserService has this method
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        Payment payment = paymentService.processPayment(user, request.getAmount(), request.getCurrency(),
                request.getPaymentMethodId());
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long id) {
        Payment payment = paymentService.getPayment(id);
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(payment);
    }
}
