package com.example.api.controller;

import com.example.api.dto.JobDescriptionRequest;
import com.example.api.service.IResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final IResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeResume(
            @RequestPart("file") MultipartFile file,
            @RequestPart("job") JobDescriptionRequest jobRequest) {
        String resumeText = resumeService.extractText(file);
        return ResponseEntity.ok(resumeText);
    }
}
