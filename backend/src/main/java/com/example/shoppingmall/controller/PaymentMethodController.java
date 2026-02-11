package com.example.shoppingmall.controller;

import com.example.shoppingmall.entity.PaymentMethod;
import com.example.shoppingmall.entity.User;
import com.example.shoppingmall.service.PaymentService;
import com.example.shoppingmall.service.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentService paymentService;
    private final UserService userService;

    @Autowired
    public PaymentMethodController(PaymentService paymentService, UserService userService) {
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PaymentMethod>> getPaymentMethods(@PathVariable Long userId) {
        // We need to add getPaymentMethods to PaymentService
        return ResponseEntity.ok(paymentService.getPaymentMethods(userId));
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> addPaymentMethod(@RequestBody AddPaymentMethodRequest request) {
        User user = userService.getUserById(request.getUserId());
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        PaymentMethod pm = paymentService.addPaymentMethod(user, request.getPluginName(), request.getExternalKey());
        return ResponseEntity.ok(pm);
    }

    @Data
    public static class AddPaymentMethodRequest {
        private Long userId;
        private String pluginName;
        private String externalKey;
    }
}
