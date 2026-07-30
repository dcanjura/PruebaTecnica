package com.pruebatecnica.products.product;

import com.pruebatecnica.products.common.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ProductServiceTest {
    @Mock ProductRepository repository;
    @InjectMocks ProductService service;

    @Test
    void createsProductWithoutClientProvidedId() {
        Product input = Product.builder().id(99L).name("Monitor").description("4K")
                .price(new BigDecimal("399.99")).stock(3).type("Tecnología").build();
        when(repository.save(input)).thenAnswer(invocation -> invocation.getArgument(0));

        Product created = service.create(input);

        assertNull(created.getId());
        verify(repository).save(input);
    }

    @Test
    void throwsWhenProductDoesNotExist() {
        when(repository.findById(42L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.findById(42L));
    }
}
