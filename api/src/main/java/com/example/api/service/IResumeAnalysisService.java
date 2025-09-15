package com.example.api.service;

import com.example.api.dto.JobDescriptionRequest;
import com.example.api.dto.ResumeAnalysisResponse;

public interface IResumeAnalysisService {
    ResumeAnalysisResponse analyze(String resumeText, JobDescriptionRequest jobRequest);
}
