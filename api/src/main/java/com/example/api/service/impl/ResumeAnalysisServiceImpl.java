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

    @Override
    @Retryable(
            retryFor = {AnalysisException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1500)
    )
    public ResumeAnalysisResponse analyze(String resumeText, JobDescriptionRequest jobRequest) {
        String prompt = buildPrompt(resumeText, jobRequest);

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .entity(ResumeAnalysisResponse.class);
        } catch (Exception e) {
            throw new AnalysisException("AI provider failed to return a response", e);
        }
    }

    private String buildPrompt(String resumeText, JobDescriptionRequest jobRequest) {
        String AIResponseFormat = """
                {
                  "overallScore": number, // max 100
                  "ats": {
                    "score": number, // rate based on ATS suitability (0–100)
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", // short title
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "toneAndStyle": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "content": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "structure": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  },
                  "skills": {
                    "score": number, // max 100
                    "tips": [
                      {
                        "type": "good" | "improve",
                        "tip": "string", //make it a short "title" for the actual explanation
                        "explanation": "string" //explain in detail here
                      }
                    ] // give 3–4 tips
                  }
                }""";

        return String.format("""
                        You are an expert in ATS (Applicant Tracking System) and resume analysis.
                        Please analyze and rate this resume and suggest how to improve it.
                        The rating can be low if the resume is bad. Be thorough and detailed.
                        Don't be afraid to point out any mistakes or areas for improvement.
                        If there is a lot to improve, don't hesitate to give low scores.
                        If available, use the job description for the job user is applying to to give more detailed feedback.
                        The job title is: %s
                        The job description is: %s
                        Provide the feedback using the following format: %s
                        The resume is: %s
                        Your response must be data in JSON format only, without any leading or trailing text before and after the JSON data.
                        """,
                jobRequest.getRole() != null ? jobRequest.getRole() : "",
                jobRequest.getJobDescription(),
                AIResponseFormat,
                resumeText
        );
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
