package com.example.shoppingmall.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentRequest {
    private Long userId;
    private BigDecimal amount;
    private String currency;
    private Long paymentMethodId;
}
