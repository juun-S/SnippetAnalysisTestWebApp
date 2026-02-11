package com.example.shoppingmall.controller;

import com.example.shoppingmall.entity.Product;
import com.example.shoppingmall.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired private ProductService productService;

    @GetMapping
    public List<Product> getAll() { return productService.getAllProducts(); }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) { return productService.getProduct(id); }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String keyword) { return productService.searchProducts(keyword); }
    
    @PostMapping
    public Product create(@RequestBody Product product) { return productService.saveProduct(product); }
}
