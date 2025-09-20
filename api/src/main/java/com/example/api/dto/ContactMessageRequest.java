package com.example.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ContactMessageRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Pattern(
            regexp = "^[\\p{L}][\\p{L} .'-]{1,99}$",
            message = "Name contains invalid characters"
    )
    private String name;

    @NotBlank(message = "Email is required")
    @Size(max = 254, message = "Email must be at most 254 characters")
    @Email(message = "Email must be valid")
    @Pattern(regexp = "^\\S+@\\S+\\.\\S+$", message = "Email must not contain spaces")
    private String email;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 4000, message = "Message must be between 10 and 4000 characters")
    private String message;
}
