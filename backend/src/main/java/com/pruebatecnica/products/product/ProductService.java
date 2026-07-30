package com.pruebatecnica.products.product;

import com.pruebatecnica.products.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;

    public List<Product> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

    public Product findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    }

    public Product create(Product product) {
        product.setId(null);
        return repository.save(product);
    }

    public Product update(Long id, Product input) {
        Product product = findById(id);
        product.setName(input.getName());
        product.setDescription(input.getDescription());
        product.setPrice(input.getPrice());
        product.setStock(input.getStock());
        product.setType(input.getType());
        return repository.save(product);
    }

    public void delete(Long id) {
        repository.delete(findById(id));
    }
}
