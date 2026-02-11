package com.example.shoppingmall.service;

import com.example.shoppingmall.entity.Product;
import com.example.shoppingmall.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired private ProductRepository productRepository;

    public List<Product> getAllProducts() { return productRepository.findAll(); }
    public Product getProduct(Long id) { return productRepository.findById(id).orElseThrow(); }
    public List<Product> searchProducts(String keyword) { return productRepository.findByNameContaining(keyword); }
    public Product saveProduct(Product product) { return productRepository.save(product); }
}
