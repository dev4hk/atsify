package com.example.api.service.impl;

import com.example.api.dto.Category;
import com.example.api.dto.JobDescriptionRequest;
import com.example.api.dto.ResumeAnalysisResponse;
import com.example.api.dto.Tip;
import com.example.api.exception.AnalysisException;
import com.example.api.service.IResumeAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAnalysisServiceImpl implements IResumeAnalysisService {

    private final ChatClient chatClient;

    @Value("classpath:prompts/resume-analysis.st")
    private Resource resumeAnalysisPrompt;

    @Override
    @Retryable(/* ... */)
    public ResumeAnalysisResponse analyze(String resumeText, JobDescriptionRequest jobRequest) {

        String role = jobRequest.getRole() != null ? jobRequest.getRole() : "";

        try {
            return chatClient.prompt()
                    .user(promptTemplateSpec ->
                                    promptTemplateSpec.text(resumeAnalysisPrompt)
                                            .param("role", role)
                                            .param("jobDescription", jobRequest.getJobDescription())
                                            .param("resumeText", resumeText)
                    )
                    .call()
                    .entity(ResumeAnalysisResponse.class);
        } catch (Exception e) {
            throw new AnalysisException("AI analysis failed: communication error or malformed structured output.", e);
        }
    }

    @Recover
    public ResumeAnalysisResponse recover(AnalysisException e, String resumeText, JobDescriptionRequest jobRequest) {
        log.error("AI Analysis failed after max retries. Returning a safe default response.", e);

        Tip unavailableTip = new Tip("improve", "Service Unavailable", "The AI analysis service is currently down or unresponsive. Please try again later for a full report.");
        Category defaultCategory = new Category(0, List.of(unavailableTip));

        return new ResumeAnalysisResponse(
                0,
                defaultCategory,
                defaultCategory,
                defaultCategory,
                defaultCategory,
                defaultCategory
        );
    }
}
