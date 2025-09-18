package com.example.api.service;

import com.example.api.dto.ContactMessageRequest;

public interface IContactService {
    void handleMessage(ContactMessageRequest request);
}
