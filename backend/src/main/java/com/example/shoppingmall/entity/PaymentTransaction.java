package com.example.shoppingmall.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "payment_transactions")
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(name = "attempt_id")
    private String attemptId; // Keeping as String/UUID to match usage, or could be linked to PaymentAttempt

    @Column(name = "transaction_type", nullable = false)
    private String transactionType; // AUTHORIZE, CAPTURE, REFUND, CREDIT

    @Column(name = "status", nullable = false)
    private String status; // SUCCESS, PENDING, PAYMENT_FAILURE, PLUGIN_FAILURE

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Column(name = "gateway_error_code")
    private String gatewayErrorCode;

    @Column(name = "gateway_error_msg")
    private String gatewayErrorMsg;

    @Column(name = "created_date")
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "updated_date")
    private LocalDateTime updatedDate = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}
