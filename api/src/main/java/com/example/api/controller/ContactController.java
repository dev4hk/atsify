package com.example.api.controller;

import com.example.api.dto.ContactMessageRequest;
import com.example.api.service.IContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final IContactService contactService;

    @PostMapping
    public ResponseEntity<Void> sendMessage(@Valid @RequestBody ContactMessageRequest request) {
        contactService.handleMessage(request);
        return ResponseEntity.accepted().build();
    }
}