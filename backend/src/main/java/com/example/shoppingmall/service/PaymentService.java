package com.example.shoppingmall.service;

import com.example.shoppingmall.entity.Payment;
import com.example.shoppingmall.entity.PaymentTransaction;
import com.example.shoppingmall.entity.PaymentMethod;
import com.example.shoppingmall.entity.User;
import com.example.shoppingmall.repository.PaymentRepository;
import com.example.shoppingmall.repository.PaymentTransactionRepository;
import com.example.shoppingmall.repository.PaymentAttemptRepository;
import com.example.shoppingmall.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
            PaymentTransactionRepository paymentTransactionRepository,
            PaymentAttemptRepository paymentAttemptRepository,
            PaymentMethodRepository paymentMethodRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.paymentAttemptRepository = paymentAttemptRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    public Payment createPayment(User user, BigDecimal amount, String currency, Long paymentMethodId,
            String externalKey) {
        Payment payment = new Payment();
        payment.setAccount(user);
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setPaymentMethodId(paymentMethodId);
        payment.setExternalKey(externalKey != null ? externalKey : UUID.randomUUID().toString());
        payment.setStateName("PENDING");
        payment.setLastSuccessStateName("NONE");
        payment.setCreatedDate(LocalDateTime.now());
        payment.setUpdatedDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public PaymentTransaction createTransaction(Payment payment, String transactionType, BigDecimal amount,
            String currency) {
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setPayment(payment);
        transaction.setTransactionType(transactionType);
        transaction.setStatus("PENDING");
        transaction.setAmount(amount);
        transaction.setCurrency(currency);
        transaction.setCreatedDate(LocalDateTime.now());
        transaction.setUpdatedDate(LocalDateTime.now());

        return paymentTransactionRepository.save(transaction);
    }

    public Payment processPayment(User user, BigDecimal amount, String currency, Long paymentMethodId) {
        // 1. Create Payment
        Payment payment = createPayment(user, amount, currency, paymentMethodId, null);

        // 2. Create Initial Transaction (Authorizing)
        PaymentTransaction transaction = createTransaction(payment, "AUTHORIZE", amount, currency);

        // 3. Simulate Gateway Call (In real world, this would be an external API call)
        // For simulation, we assume success if amount > 0
        boolean success = amount.compareTo(BigDecimal.ZERO) > 0;

        if (success) {
            transaction.setStatus("SUCCESS");
            payment.setStateName("AUTHORIZED");
            payment.setLastSuccessStateName("AUTHORIZED");
        } else {
            transaction.setStatus("PAYMENT_FAILURE");
            transaction.setGatewayErrorCode("ERR_001");
            transaction.setGatewayErrorMsg("Invalid amount");
            payment.setStateName("ERRORED");
        }

        transaction.setUpdatedDate(LocalDateTime.now());
        payment.setUpdatedDate(LocalDateTime.now());

        paymentTransactionRepository.save(transaction);
        return paymentRepository.save(payment);
    }

    public Payment getPayment(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    public List<Payment> getPaymentsForUser(Long userId) {
        return paymentRepository.findByAccountId(userId);
    }

    public PaymentMethod addPaymentMethod(User user, String pluginName, String externalKey) {
        PaymentMethod pm = new PaymentMethod();
        pm.setAccount(user);
        pm.setPluginName(pluginName);
        pm.setExternalKey(externalKey);
        pm.setActive(true);
        pm.setCreatedDate(LocalDateTime.now());
        pm.setUpdatedDate(LocalDateTime.now());
        return paymentMethodRepository.save(pm);
    }

    public List<PaymentMethod> getPaymentMethods(Long userId) {
        return paymentMethodRepository.findByAccountId(userId);
    }

    public void refundPayment(Payment payment) {
        // Create Refund Transaction
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setPayment(payment);
        transaction.setTransactionType("REFUND");
        transaction.setStatus("SUCCESS");
        transaction.setAmount(payment.getAmount());
        transaction.setCurrency(payment.getCurrency());
        transaction.setCreatedDate(LocalDateTime.now());
        transaction.setUpdatedDate(LocalDateTime.now());

        paymentTransactionRepository.save(transaction);

        // Update Payment State
        payment.setStateName("REFUNDED");
        payment.setUpdatedDate(LocalDateTime.now());
        paymentRepository.save(payment);
    }
}
