package com.example.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class JobDescriptionRequest {

    @NotBlank(message = "Job description is required")
    @Size(min = 30, max = 8000, message = "Job description must be between 30 and 8000 characters")
    private String jobDescription;

    @NotBlank(message = "Role is required")
    @Size(min = 2, max = 120, message = "Role must be between 2 and 120 characters")
    @Pattern(
            regexp = "^[\\p{L}0-9 .,'&()/-]{2,120}$",
            message = "Role contains invalid characters"
    )
    private String role;
}
