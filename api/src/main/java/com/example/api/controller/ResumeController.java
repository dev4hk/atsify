package com.example.api.controller;

import com.example.api.dto.JobDescriptionRequest;
import com.example.api.dto.ResumeAnalysisResponse;
import com.example.api.service.IResumeAnalysisService;
import com.example.api.service.IResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final IResumeService resumeService;
    private final IResumeAnalysisService resumeAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @RequestPart("file") MultipartFile file,
            @RequestPart("job") JobDescriptionRequest jobRequest) {

        String resumeText = resumeService.extractText(file);

        ResumeAnalysisResponse analysis = resumeAnalysisService.analyze(resumeText, jobRequest);

        return ResponseEntity.ok(analysis);
    }
}
