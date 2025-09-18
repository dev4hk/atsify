package com.example.api.service.impl;

import com.example.api.dto.ContactMessageRequest;
import com.example.api.email.EmailService;
import com.example.api.service.IContactService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements IContactService {

    private final EmailService emailService;

    @Value("${app.contact.to:support@atsify.com}")
    private String toAddress;

    @Value("${app.contact.from:no-reply@atsify.dev}")
    private String fromAddress;

    @Override
    public void handleMessage(ContactMessageRequest request) {
        try {
            emailService.sendTemplate(
                    toAddress,
                    fromAddress,
                    request.getEmail(),
                    "New Contact Message from " + request.getName(),
                    "contact_message",
                    Map.of("name", request.getName(), "email", request.getEmail(), "message", request.getMessage())
            );
        } catch (MessagingException e) {
            log.error("Failed to send contact email: {}", e.getMessage(), e);
        }
    }
}