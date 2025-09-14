package com.example.api.service;

import org.springframework.web.multipart.MultipartFile;

public interface IResumeService {
    String extractText(MultipartFile file);
}
